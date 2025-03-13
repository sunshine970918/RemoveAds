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

function getArgs() {
    try {
        return typeof $argument !== "undefined" ? JSON.parse($argument) : {};
    } catch (e) {
        return {};
    }
}

function isValidCoordinate(value) {
    return /^-?\d+(\.\d+)?$/.test(value);
}

async function main() {
    try {
        const args = getArgs();
        const { 
            useCoordinates = "true",
            customLatitude = "",
            customLongitude = "",
            sortBy = "nearby",
            mapSearchEnabled = "false"
        } = args;

        // 参数有效性检查
        if (useCoordinates !== "false") {
            if (!customLatitude || !customLongitude) {
                console.log(`❌ 参数缺失:
                   纬度: ${customLatitude || "未设置"}
                   经度: ${customLongitude || "未设置"}
                `);
                return env.done({});
            }
            
            if (!isValidCoordinate(customLatitude) || !isValidCoordinate(customLongitude)) {
                console.log("❌ 经纬度必须为数字格式，示例：34.0522");
                return env.done({});
            }
        }

        // 核心处理逻辑
        if (useCoordinates === "true") {
            let modifiedUrl = $request.url
                .replace(/([?&](lot|longitude|lon)=)[^&]*/g, `$1${customLongitude}`)
                .replace(/([?&](lat|latitude)=)[^&]*/g, `$1${customLatitude}`);

            if (mapSearchEnabled === "true") {
                modifiedUrl = modifiedUrl.includes("sort_by=") ?
                    modifiedUrl.replace(/sort_by=\w+/, `sort_by=${sortBy}`) :
                    `${modifiedUrl}${modifiedUrl.includes("?") ? "&" : "?"}sort_by=${sortBy}`;
            }

            console.log(`✅ 修改后URL: ${modifiedUrl}`);
            env.done({ url: modifiedUrl });
        } else {
            console.log("📍 使用原始URL");
            env.done({ url: $request.url });
        }

    } catch (error) {
        console.error(`❗ 错误: ${error.stack || error}`);
        env.done({});
    }
}

main();
