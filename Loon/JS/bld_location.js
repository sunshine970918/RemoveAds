// 位置修改脚本 - 完整可用版本
const env = new Env("位置修改器");

function main() {
    try {
        // 参数解析
        const {
            useCoordinates = "true",
            customLatitude = "",
            customLongitude = "",
            sortBy = "distance",
            mapSearch = "false"
        } = $argument;

        const originalUrl = $request.url;
        
        // 功能开关判断
        if (useCoordinates === "false") {
            env.log("🔍 使用原始位置");
            return env.done({ url: originalUrl });
        }

        // 坐标校验
        if (!isValidCoord(customLatitude) || !isValidCoord(customLongitude)) {
            throw new Error("❌ 经纬度格式错误，请检查参数");
        }

        // 修改URL
        let modifiedUrl = originalUrl;
        
        // 替换纬度参数
        modifiedUrl = modifiedUrl.replace(
            /([?&])(lat|latitude)=[^&]*/gi, 
            `$1lat=${customLatitude}`
        );
        
        // 替换经度参数
        modifiedUrl = modifiedUrl.replace(
            /([?&])(lng|longitude|lon|lot)=[^&]*/gi, 
            `$1lng=${customLongitude}`
        );

        // 添加排序参数
        if (mapSearch === "true") {
            modifiedUrl = modifiedUrl.includes("?") 
                ? `${modifiedUrl}&sort_by=${sortBy}`
                : `${modifiedUrl}?sort_by=${sortBy}`;
        }

        env.log("✅ 位置修改成功");
        env.log("原始URL:", originalUrl);
        env.log("新URL:", modifiedUrl);
        env.done({ url: modifiedUrl });

    } catch (error) {
        env.log("⚠️ 发生错误:", error.message);
        env.done({});
    }
}

// 坐标校验函数
function isValidCoord(coord) {
    return /^-?\d{1,3}(\.\d+)?$/.test(coord) && Math.abs(coord) <= 180;
}

// 环境类 (必需)
function Env(name) {
    const startTime = Date.now();
    
    return {
        log: (...args) => {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`[${name}] ${timestamp}`, ...args);
        },
        
        done: (response) => {
            const duration = ((Date.now() - startTime)/1000).toFixed(2);
            console.log(`⏱️ 执行耗时: ${duration}s`);
            $done(response);
        }
    };
}

// 启动脚本
main();
