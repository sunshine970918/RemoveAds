class LocationService {
    constructor() {
        this.startTime = Date.now();
        console.log("🚀 Blued定位服务 启动");
    }

    logPerformance() {
        const duration = Date.now() - this.startTime;
        console.log(`⏱️ 服务耗时: ${duration}ms`);
    }
}

const service = new LocationService();

function parseArguments() {
    try {
        console.log("🔍 原始$argument类型:", typeof $argument);
        console.log("🔍 原始$argument值:", $argument);

        if (typeof $argument === "object" && $argument !== null) {
            console.log("⚡ 检测到对象参数，直接返回");
            return $argument;
        }

        const rawStr = String($argument || "");
        console.log("🔍 字符串参数原始值:", rawStr);

        if (rawStr.startsWith("{") && rawStr.endsWith("}")) {
            try {
                const obj = JSON.parse(rawStr);
                console.log("🔍 JSON解析结果:", obj);
                return obj;
            } catch (e) {
                console.log("⚠️ JSON解析失败，回退键值对解析");
            }
        }

        const params = {};
        rawStr.split("&").forEach(pair => {
            const [k, v] = pair.split("=").map(decodeURIComponent);
            if (k) params[k] = v || "";
        });
        console.log("🔍 键值对解析结果:", params);
        return params;

    } catch (e) {
        console.error("‼️ 参数解析崩溃:", e.stack || e);
        return {};
    }
}

async function main() {
    try {
        const args = parseArguments();
        console.log("📊 有效参数:", Object.keys(args).length ? 
            JSON.stringify(args, null, 2) : 
            "无有效参数"
        );

        // 参数映射
        const lat = args.lat || args.latitude || "";
        const lon = args.lon || args.longitude || "";

        if (!lat || !lon) {
            console.log("❌ 必需参数缺失: lat, lon");
            service.logPerformance();
            return $done({});
        }

        const newUrl = $request.url
            .replace(/([?&](lat|latitude)=)[^&]*/gi, `$1${lat}`)
            .replace(/([?&](lon|longitude)=)[^&]*/gi, `$1${lon}`);

        console.log(`✅ 修改后URL:\n${newUrl}`);
        service.logPerformance();
        $done({ url: newUrl });

    } catch (error) {
        console.error(`❗ 全局异常: ${error.stack || error}`);
        service.logPerformance();
        $done({});
    }
}

main();
