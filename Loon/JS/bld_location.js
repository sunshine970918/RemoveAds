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

const env = new Env("终极定位修改器");

// 多环境参数兼容方案
function parseArguments() {
    try {
        // 环境检测
        const isSurgeModule = typeof $environment !== "undefined" && $environment["surge-version"];

        // 处理已解析的对象参数
        if (typeof $argument === "object" && $argument !== null) {
            console.log("⚙️ 检测到对象类型参数");
            return $argument;
        }

        // 处理字符串类型参数
        const rawArgs = typeof $argument === "string" ? $argument : "";
        console.log(`📦 原始参数数据: ${rawArgs}`);

        // JSON格式解析
        if (rawArgs.startsWith("{") && rawArgs.endsWith("}")) {
            return JSON.parse(rawArgs);
        }

        // 传统键值对解析
        const params = {};
        rawArgs.split("&").forEach(pair => {
            const [key, value] = pair.split("=").map(decodeURIComponent);
            if (key) params[key] = value || "";
        });
        return params;

    } catch (e) {
        console.log("⚠️ 参数解析异常，详细信息:", e.stack || e);
        return {};
    }
}

async function main() {
    try {
        const args = parseArguments();
        console.log("🔍 调试参数结构:", JSON.stringify(args, null, 2));

        // 参数映射 (兼容所有平台)
        const lat = args.lat || args.latitude || args.customLatitude || args.纬度 || "";
        const lon = args.lon || args.longitude || args.customLongitude || args.经度 || "";
        const useCoordinates = String(args.useCoordinates || "true").toLowerCase() === "true";
        const enableMapSearch = String(args.mapSearchEnabled || "false").toLowerCase() === "true";
        const sortBy = args.sortBy || args.排序 || "nearby";

        // 参数完整性校验
        if (useCoordinates) {
            if (!lat || !lon) {
                console.log(`
❌ 关键参数缺失！
   可用参数名: 
   - 纬度: lat/latitude/customLatitude/纬度
   - 经度: lon/longitude/customLongitude/经度
   当前配置: ${JSON.stringify(args, null, 4)}
                `);
                return env.done({});
            }

            // 数值格式校验
            const isNumber = v => /^-?\d+\.?\d*$/.test(v);
            if (!isNumber(lat) || !isNumber(lon)) {
                console.log(`
❌ 数值格式异常！
   合法示例: lat=34.0522 lon=-118.2437
   当前纬度: ${lat} (${typeof lat})
   当前经度: ${lon} (${typeof lon})
                `);
                return env.done({});
            }
        }

        // 核心处理逻辑
        if (useCoordinates) {
            let newUrl = $request.url
                .replace(/([?&](lat|latitude)=)[^&]*/gi, `$1${lat}`)
                .replace(/([?&](lon|longitude)=)[^&]*/gi, `$1${lon}`);

            if (enableMapSearch) {
                newUrl = newUrl.includes("sort_by=") ? 
                    newUrl.replace(/([?&]sort_by=)[^&]*/, `$1${sortBy}`) : 
                    newUrl + (newUrl.includes("?") ? "&" : "?") + `sort_by=${sortBy}`;
            }

            console.log(`✅ 最终修改结果:\n${newUrl}`);
            env.done({ url: newUrl });
        } else {
            console.log("📍 使用原始地理位置数据");
            env.done({ url: $request.url });
        }

    } catch (error) {
        console.error(`❗ 未捕获异常:\n${error.stack || error}`);
        env.done({});
    }
}

main();
