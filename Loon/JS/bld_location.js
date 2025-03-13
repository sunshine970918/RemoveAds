class Env {
    constructor(name) {
        this.name = name;
        this.startTime = Date.now();
        console.log(`🔔 [${name}] 服务启动`);
    }

    done(result) {
        const duration = Date.now() - this.startTime;
        console.log(`🕒 请求处理耗时: ${duration}ms`);
        $done(result);
    }
}

const env = new Env("Blued定位修改器");

function parseArgs() {
    try {
        // Loon会将JSON参数自动转为对象
        if (typeof $argument === "object") {
            console.log("📥 原始输入参数:", JSON.stringify($argument));
            return $argument;
        }
        return {};
    } catch (e) {
        console.log("⚠️ 参数解析失败:", e.message);
        return {};
    }
}

function validateCoordinate(value) {
    // 增强校验逻辑：支持字符串数字和数值类型
    return !isNaN(value) && /^-?\d+\.?\d*$/.test(value);
}

async function main() {
    try {
        const args = parseArgs();
        
        // 参数映射兼容Loon特性
        const lat = args.customLatitude || args.lat || args.latitude;
        const lon = args.customLongitude || args.lon || args.longitude;
        const enableMap = Boolean(args.mapSearchEnabled); // 兼容布尔值
        const sort = args.sortBy || "nearby";

        // 调试输出
        console.log("🔍 参数解析结果:", JSON.stringify({ lat, lon }, null, 2));

        // 增强校验逻辑
        if (!validateCoordinate(lat) || !validateCoordinate(lon)) {
            console.log(`❌ 参数校验失败: 格式错误，必须为数字
   当前纬度: ${lat || "空"} (类型: ${typeof lat})
   当前经度: ${lon || "空"} (类型: ${typeof lon})
            `);
            return env.done({});
        }

        // 核心修改逻辑
        let newUrl = $request.url
            .replace(/([?&](lat|latitude)=)[^&]*/gi, `$1${lat}`)
            .replace(/([?&](lon|longitude)=)[^&]*/gi, `$1${lon}`);

        if (enableMap) {
            newUrl = newUrl.includes("sort_by=") ? 
                newUrl.replace(/([?&]sort_by=)[^&]*/, `$1${sort}`) : 
                newUrl + (newUrl.includes("?") ? "&" : "?") + `sort_by=${sort}`;
        }

        console.log(`✅ 修改成功:\n${newUrl}`);
        env.done({ url: newUrl });

    } catch (error) {
        console.error(`❗ 未捕获错误:\n${error.stack || error}`);
        env.done({});
    }
}

main();
