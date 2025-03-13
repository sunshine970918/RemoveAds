// 增强版位置修改脚本
const env = new Env("位置修改器");

function main() {
    try {
        env.log("脚本开始执行");
        
        // 参数详细解析
        const params = {
            useCoordinates: ($argument.useCoordinates || "true").toLowerCase(),
            customLatitude: $argument.customLatitude?.trim() || "",
            customLongitude: $argument.customLongitude?.trim() || "",
            sortBy: $argument.sortBy || "distance",
            mapSearch: ($argument.mapSearch || "false").toLowerCase()
        };
        
        env.log("解析参数:", JSON.stringify(params, null, 2));

        const originalUrl = $request.url;
        env.log("原始URL:", originalUrl);

        // 功能开关处理
        if (params.useCoordinates === "false") {
            env.log("🔌 坐标修改功能已禁用");
            return env.done({ url: originalUrl });
        }

        // 增强坐标验证
        if (!isValidCoord(params.customLatitude) || !isValidCoord(params.customLongitude)) {
            const errorMsg = `❌ 坐标验证失败，请检查参数：
纬度: ${params.customLatitude || "空"}  
经度: ${params.customLongitude || "空"}`;
            throw new Error(errorMsg);
        }

        // 执行深度URL修改
        const modifiedUrl = processUrl(originalUrl, params);
        env.log("✅ 修改成功", `新URL: ${modifiedUrl}`);
        
        env.done({ url: modifiedUrl });

    } catch (error) {
        env.log("❗️ 处理失败:", error.message);
        env.done({});
    }
}

function processUrl(url, params) {
    // 增强参数匹配规则
    const coordPatterns = {
        lat: /([?&])(lat(?:itude)?)=[^&]*/gi,
        lng: /([?&])(lng|longitude|lon|lot)=[^&]*/gi
    };

    // 分步处理参数
    let newUrl = url
        .replace(coordPatterns.lat, `$1lat=${params.customLatitude}`)
        .replace(coordPatterns.lng, `$1lng=${params.customLongitude}`);

    // 添加排序参数
    if (params.mapSearch === "true") {
        const hasQuery = newUrl.includes("?");
        const hasSort = /sort_by=/.test(newUrl);
        
        if (!hasSort) {
            newUrl += `${hasQuery ? "&" : "?"}sort_by=${params.sortBy}`;
            env.log("🔧 已添加排序参数");
        }
    }
    
    return newUrl;
}

// 增强坐标验证
function isValidCoord(coord) {
    const num = parseFloat(coord);
    return !isNaN(num) && num >= -180 && num <= 180;
}

// 强化环境类
function Env(name) {
    const startTime = Date.now();
    
    return {
        log: function(...args) {
            const timestamp = new Date().toLocaleTimeString();
            const prefix = `[${name}] ${timestamp}`;
            console.log(prefix, ...args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : arg
            ));
        },
        
        done: function(response) {
            const duration = ((Date.now() - startTime)/1000).toFixed(3);
            console.log(`⏱️ 执行耗时: ${duration}s`);
            $done(response);
        }
    };
}

// 启动
main();
