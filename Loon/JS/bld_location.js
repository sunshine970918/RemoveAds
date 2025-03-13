const env = new Env("LocationModifier");

async function main() {
    try {
        const { useCoordinates = "true", customLatitude = "", customLongitude = "", sortBy = "nearby", mapSearchEnabled = "false" } = $argument;
        const shouldUseCoordinates = useCoordinates !== "false";
        const enableMapSearch = mapSearchEnabled === "true";

        if (!shouldUseCoordinates) {
            console.log("📍 使用原始定位信息");
            return env.done({ url: $request.url });
        }

        if (!customLatitude || !customLongitude) {
            console.log("❌ 缺少经纬度参数");
            return env.done({});
        }

        let modifiedUrl = updateCoordinates($request.url, customLatitude, customLongitude);
        if (enableMapSearch) {
            modifiedUrl = addSearchParam(modifiedUrl, sortBy);
        }

        console.log(`✅ 修改后URL: ${modifiedUrl}`);
        env.done({ url: modifiedUrl });

    } catch (error) {
        console.error(`❗ 发生错误: ${error.stack || error}`);
        env.done({});
    }
}

// 核心功能函数
const updateCoordinates = (url, lat, lon) => 
    url.replace(/([?&](lot|longitude|lon)=)[^&]*/g, `$1${lon}`)
       .replace(/([?&](lat|latitude)=)[^&]*/g, `$1${lat}`);

const addSearchParam = (url, sort) => 
    url.includes("sort_by=") ? url.replace(/sort_by=\w+/, `sort_by=${sort}`)
                             : url + (url.includes("?") ? "&" : "?") + `sort_by=${sort}`;

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

main();
