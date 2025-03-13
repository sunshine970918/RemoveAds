class Env {
    constructor(name) {
        this.name = name;
        this.startTime = Date.now();
        console.log(`🚀 ${name} 服务启动`);
    }

    done(result) {
        const duration = Date.now() - this.startTime;
        console.log(`⏱️ 耗时: ${duration}ms`);
        $done(result);
    }
}

const env = new Env("Blued定位修改器");

function parseArguments() {
    try {
        return typeof $argument === "object" ? $argument : JSON.parse($argument);
    } catch (e) {
        console.log("⚠️ 参数解析错误:", e.message);
        return {};
    }
}

async function main() {
    try {
        const args = parseArguments();
        console.log("📥 原始输入参数:", JSON.stringify(args));
        
        // 参数处理（兼容布尔值和字符串）
        const lat = args.customLatitude || args.latitude;
        const lon = args.customLongitude || args.longitude;
        const enableMapSearch = String(args.mapSearchEnabled).toLowerCase() === "true";
        const sortBy = args.sortBy || "nearby";

        // 核心逻辑
        if (lat && lon) {
            let newUrl = $request.url
                .replace(/([?&](lat|latitude)=)[^&]*/gi, `$1${lat}`)
                .replace(/([?&](lon|longitude)=)[^&]*/gi, `$1${lon}`);

            if (enableMapSearch) {
                const hasSortBy = /[?&]sort_by=/i.test(newUrl);
                newUrl = hasSortBy ? 
                    newUrl.replace(/([?&]sort_by=)[^&]*/i, `$1${sortBy}`) :
                    newUrl + (newUrl.includes("?") ? "&" : "?") + `sort_by=${sortBy}`;
            }

            console.log("✅ 修改成功:\n" + newUrl);
            env.done({ url: newUrl });
        } else {
            console.log("❌ 缺少经纬度参数");
            env.done({});
        }
    } catch (error) {
        console.error("❗ 错误:", error.stack || error);
        env.done({});
    }
}

main();
