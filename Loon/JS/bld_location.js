// ======================= 环境适配器 =======================
class Env {
    constructor(name) {
        this.name = name || "Location-Modifier";
        this.startTime = Date.now();
        console.log(`🔔 [${this.name}] 服务启动`);
    }

    done(result) {
        const duration = Date.now() - this.startTime;
        console.log(`🕒 请求处理耗时: ${duration}ms`);
        $done(result);
    }
}

// ====================== 核心逻辑部分 ======================
const env = new Env("Blued定位修改器");

/**
 * 万能参数解析器
 * 兼容以下格式：
 * 1. Surge Module格式: {"lat":31,"lon":121}
 * 2. 传统键值对格式: lat=31&lon=121
 * 3. 中文参数格式: 纬度=31&经度=121
 */
function parseArguments() {
    try {
        const rawInput = typeof $argument !== "undefined" ? $argument : "";
        console.log(`📥 原始输入参数: ${JSON.stringify(rawInput)}`);

        // 环境自动检测
        const isJSON = typeof rawInput === "object" || 
                      (typeof rawInput === "string" && rawInput.startsWith("{"));

        // 解析逻辑
        if (isJSON) {
            try {
                return typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput;
            } catch (e) {
                console.log("⚠️ JSON解析失败，尝试回退到键值对解析");
            }
        }

        // 键值对解析
        const params = {};
        String(rawInput).split("&").forEach(pair => {
            const [key, val] = pair.split("=").map(v => decodeURIComponent(v.trim()));
            if (key) params[key] = val || "";
        });
        return params;

    } catch (e) {
        console.log(`❌ 参数解析崩溃: ${e.stack || e}`);
        return {};
    }
}

/**
 * 经纬度格式验证器
 */
function validateCoordinates(lat, lon) {
    const isNumber = v => /^-?\d+(\.\d+)?$/.test(v);
    const inRange = (v, min, max) => v >= min && v <= max;

    if (!isNumber(lat) || !isNumber(lon)) {
        return { valid: false, reason: "格式错误，必须为数字" };
    }

    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (!inRange(latNum, -90, 90)) {
        return { valid: false, reason: "纬度范围应在 -90 至 90 之间" };
    }

    if (!inRange(lonNum, -180, 180)) {
        return { valid: false, reason: "经度范围应在 -180 至 180 之间" };
    }

    return { valid: true };
}

// ====================== 主执行逻辑 ======================
async function main() {
    try {
        // 参数解析
        const args = parseArguments();
        console.log("🔍 参数解析结果:", JSON.stringify(args, null, 2));

        // 参数映射（兼容10+种参数名）
        const lat = args.lat || args.latitude || args.纬度 || args.customLat || "";
        const lon = args.lon || args.longitude || args.经度 || args.customLon || "";
        const enableMap = args.enableMap === "true" || args.map === "true";
        const sortMethod = args.sort || args.sort_by || "nearby";

        // 参数校验
        const { valid, reason } = validateCoordinates(lat, lon);
        if (!valid) {
            console.log(`❌ 参数校验失败: ${reason}
   当前纬度: ${lat || "空"}
   当前经度: ${lon || "空"}
            `);
            return env.done({});
        }

        // 修改URL
        let newUrl = $request.url
            .replace(/([?&](lat|latitude)=)[^&]*/gi, `$1${lat}`)
            .replace(/([?&](lon|longitude)=)[^&]*/gi, `$1${lon}`);

        // 添加排序参数
        if (enableMap) {
            newUrl = newUrl.includes("sort_by=") ? 
                newUrl.replace(/([?&]sort_by=)[^&]*/, `$1${sortMethod}`) : 
                newUrl + (newUrl.includes("?") ? "&" : "?") + `sort_by=${sortMethod}`;
        }

        console.log(`✅ 修改成功:
${newUrl}
        `);
        env.done({ url: newUrl });

    } catch (error) {
        console.error(`💥 未捕获异常:
${error.stack || error}
        `);
        env.done({});
    }
}

// ====================== 启动脚本 ======================
main();
