class Env {
    constructor(name) {
        this.name = name;
        this.startTime = Date.now();
        console.log(`🔔 ${name} 服务启动`);
    }

    done(result) {
        console.log(`🕒 耗时: ${((Date.now() - this.startTime)/1000).toFixed(1)}秒`);
        $done(result);
    }
}

const env = new Env("终极位置修改器");

function parseArguments() {
    try {
        // 1. 获取原始参数
        const rawArgs = typeof $argument !== "undefined" ? $argument : "";
        console.log(`📦 原始参数: ${rawArgs}`); // 调试关键点
        
        // 2. 尝试解析为JSON
        try {
            return JSON.parse(rawArgs);
        } catch (jsonError) {
            // 3. 非JSON格式时解析为URL参数
            const params = {};
            rawArgs.split("&").forEach(pair => {
                const [key, value] = pair.split("=").map(decodeURIComponent);
                if (key) params[key] = value || "";
            });
            return params;
        }
    } catch (e) {
        console.log("⚠️ 参数解析失败，错误详情:", e);
        return {};
    }
}

async function main() {
    try {
        const args = parseArguments();
        console.log("🔍 解析后参数:", JSON.stringify(args, null, 2)); // 结构化输出
        
        // 参数映射（兼容所有可能名称）
        const latitude = args.lat || args.latitude || args.customLatitude || "";
        const longitude = args.lon || args.longitude || args.customLongitude || "";
        const useCoordinates = (args.useCoordinates || "true") === "true";
        const enableMapSearch = (args.mapSearchEnabled || "false") === "true";
        const sortBy = args.sortBy || "nearby";

        // 强制类型检查
        if (useCoordinates) {
            if (!/^-?\d+\.?\d*$/.test(latitude) || !/^-?\d+\.?\d*$/.test(longitude)) {
                console.log(`
❌ 经纬度格式错误！
   当前纬度: ${latitude} 
   当前经度: ${longitude}
   合法示例: lat=34.0522 lon=-118.2437
                `);
                return env.done({});
            }
        }

        // 核心逻辑
        if (useCoordinates) {
            let newUrl = $request.url
                .replace(/([?&]lat=)[^&]*/gi, `$1${latitude}`)
                .replace(/([?&]lon=)[^&]*/gi, `$1${longitude}`)
                .replace(/([?&]latitude=)[^&]*/gi, `$1${latitude}`)
                .replace(/([?&]longitude=)[^&]*/gi, `$1${longitude}`);

            if (enableMapSearch) {
                newUrl = newUrl.includes("sort_by=") ? 
                    newUrl.replace(/([?&]sort_by=)[^&]*/, `$1${sortBy}`) : 
                    newUrl + (newUrl.includes("?") ? "&" : "?") + `sort_by=${sortBy}`;
            }

            console.log(`✅ 修改成功:\n${newUrl}`);
            env.done({ url: newUrl });
        } else {
            console.log("📍 使用原始位置信息");
            env.done({ url: $request.url });
        }

    } catch (error) {
        console.error(`❗ 未捕获错误:\n${error.stack || error}`);
        env.done({});
    }
}

main();
