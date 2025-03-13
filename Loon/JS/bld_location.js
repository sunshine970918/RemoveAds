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
        // 强制类型转换确保参数可处理
        const rawInput = String($argument || "");
        console.log(`📥 原始输入参数: "${rawInput}"`); // 确保显示原始输入

        // 空参数处理
        if (!rawInput.trim()) {
            console.log("⚠️ 参数为空");
            return {};
        }

        // 多格式解析
        let parsedArgs = {};
        try {
            parsedArgs = JSON.parse(rawInput);
            console.log("🔍 解析方式: JSON对象");
        } catch {
            parsedArgs = Object.fromEntries(
                rawInput.split("&").map(pair => {
                    const [k, v] = pair.split("=").map(decodeURIComponent);
                    return [k, v || ""];
                })
            );
            console.log("🔍 解析方式: 键值对");
        }

        console.log("📊 解析结果:", JSON.stringify(parsedArgs, (k, v) => v || undefined, 2));
        return parsedArgs;

    } catch (e) {
        console.log("❗ 参数解析失败:", e.message);
        return {};
    }
}

async function main() {
    try {
        const args = parseArguments();
        
        // 参数映射（全兼容模式）
        const params = {
            lat: args.lat ?? args.latitude ?? args.customLatitude ?? args.纬度 ?? "",
            lon: args.lon ?? args.longitude ?? args.customLongitude ?? args.经度 ?? "",
            sort: args.sort_by ?? args.sortBy ?? "nearby",
            enableMap: args.mapSearchEnabled === "true" || args.地图搜索 === "true"
        };

        console.log("⚙️ 生效参数:", JSON.stringify(params, null, 2));

        // 核心逻辑
        let newUrl = $request.url;
        if (params.lat && params.lon) {
            newUrl = newUrl
                .replace(/([?&](lat|latitude)=)[^&]*/gi, `$1${params.lat}`)
                .replace(/([?&](lon|longitude)=)[^&]*/gi, `$1${params.lon}`);

            if (params.enableMap) {
                newUrl = newUrl.includes("sort_by=") ? 
                    newUrl.replace(/([?&]sort_by=)[^&]*/, `$1${params.sort}`) : 
                    newUrl + (newUrl.includes("?") ? "&" : "?") + `sort_by=${params.sort}`;
            }
        }

        console.log(`✅ 修改成功:\n${newUrl}`);
        env.done({ url: newUrl });

    } catch (error) {
        console.error(`💥 未捕获错误:\n${error.stack || error}`);
        env.done({});
    }
}

main();
