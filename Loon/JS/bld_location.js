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

const env = new Env("LocationModifier");

// 兼容多平台参数解析
function parseArguments() {
    try {
        // 情况1：参数为JSON字符串 (Surge Module格式)
        if (typeof $argument === "string" && $argument.startsWith("{")) {
            return JSON.parse($argument);
        }
        
        // 情况2：参数为query string (Loon/Surge传统格式)
        if (typeof $argument === "string") {
            const params = {};
            $argument.split("&").forEach(pair => {
                const [key, value] = pair.split("=");
                params[key] = decodeURIComponent(value);
            });
            return params;
        }

        // 情况3：参数未定义
        return {};
    } catch (e) {
        console.log("⚠️ 参数解析失败，请检查格式");
        return {};
    }
}

async function main() {
    try {
        const args = parseArguments();
        console.log("🔍 调试参数:", JSON.stringify(args)); // 调试日志
        
        // 参数映射（兼容不同名称）
        const latitude = args.customLatitude || args.lat || "";
        const longitude = args.customLongitude || args.lon || args.longitude || "";
        const useCoordinates = args.useCoordinates !== "false";
        const enableMapSearch = args.mapSearchEnabled === "true";
        const sortBy = args.sortBy || "nearby";

        // 参数校验
        if (useCoordinates) {
            if (!latitude || !longitude) {
                console.log(`❌ 参数异常:
                传入参数: ${JSON.stringify(args)}
                实际读取: lat=${latitude}, lon=${longitude}
                `);
                return env.done({});
            }
        }

        // 核心逻辑
        if (useCoordinates) {
            let newUrl = $request.url
                .replace(/([?&]lat=)[^&]*/g, `$1${latitude}`)
                .replace(/([?&]lon=)[^&]*/g, `$1${longitude}`)
                .replace(/([?&]longitude=)[^&]*/g, `$1${longitude}`)
                .replace(/([?&]latitude=)[^&]*/g, `$1${latitude}`);

            if (enableMapSearch) {
                newUrl = newUrl.includes("sort_by=") ? 
                    newUrl.replace(/sort_by=[^&]+/, `sort_by=${sortBy}`) : 
                    newUrl + (newUrl.includes("?") ? "&" : "?") + `sort_by=${sortBy}`;
            }

            console.log(`✅ 修改成功: ${newUrl}`);
            env.done({ url: newUrl });
        } else {
            console.log("📍 使用原始定位");
            env.done({ url: $request.url });
        }

    } catch (error) {
        console.error(`❗ 错误: ${error.stack || error}`);
        env.done({});
    }
}

main();
