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

const env = new Env("Blued定位修改器");

// 多平台参数解析
function parseArguments() {
    try {
        // 1. 处理已解析的对象参数
        if (typeof $argument === "object" && $argument !== null) {
            console.log("⚙️ 检测到对象参数:", JSON.stringify($argument));
            return $argument;
        }

        // 2. 处理字符串参数
        const rawArgs = typeof $argument === "string" ? $argument : "";
        console.log(`📦 原始参数字符串: "${rawArgs}"`);

        // 尝试解析为JSON
        try {
            return JSON.parse(rawArgs);
        } catch (jsonError) {
            // 解析为键值对
            const params = {};
            rawArgs.split("&").forEach(pair => {
                const [key, value] = pair.split("=").map(decodeURIComponent);
                if (key) params[key] = value || "";
            });
            return params;
        }
    } catch (e) {
        console.log("⚠️ 参数解析失败:", e.stack || e);
        return {};
    }
}

async function main() {
    try {
        const args = parseArguments();
        console.log("🔍 解析后参数详情:", JSON.stringify(args, null, 2));

        // 参数映射（精确匹配Blued接口参数）
        const targetLat = args.latitude || args.lat || ""; // Blued使用latitude参数名
        const targetLon = args.longitude || args.lon || ""; // Blued使用longitude参数名
        
        // 强制数值校验
        const isValid = (v) => /^-?\d+\.?\d+$/.test(v);
        if (!isValid(targetLat) || !isValid(targetLon)) {
            console.log(`
❌ 经纬度格式非法！ 
   当前参数: 
   - latitude: ${targetLat || "未设置"}
   - longitude: ${targetLon || "未设置"}
   正确示例: latitude=34.0522&longitude=-118.2437
            `);
            return env.done({});
        }

        // 精确替换Blued接口参数
        const modifiedUrl = $request.url
            .replace(/([?&]latitude=)[^&]*/i, `$1${targetLat}`)
            .replace(/([?&]longitude=)[^&]*/i, `$1${targetLon}`)
            .replace(/([?&]sort_by=)[^&]*/i, `$1nearby`);

        console.log(`✅ 修改成功: ${modifiedUrl}`);
        env.done({ url: modifiedUrl });

    } catch (error) {
        console.error(`❗ 致命错误: ${error.stack || error}`);
        env.done({});
    }
}

main();
