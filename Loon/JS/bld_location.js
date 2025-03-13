// 修复1: 先声明类再实例化
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

const env = new Env("LocationModifier"); // 必须在类声明后实例化

// 修复2: 安全参数处理
function getArgs() {
    try {
        return typeof $argument !== "undefined" ? JSON.parse($argument) : {};
    } catch (e) {
        return {};
    }
}

async function main() {
    try {
        // 修复3: 安全解构赋值
        const args = getArgs();
        const { 
            useCoordinates = "true",
            customLatitude = "",
            customLongitude = "",
            sortBy = "nearby",
            mapSearchEnabled = "false"
        } = args;

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

        // 修复4: 函数提前声明
        const modifiedUrl = updateCoordinates($request.url, customLatitude, customLongitude);
        const finalUrl = enableMapSearch ? addSearchParam(modifiedUrl, sortBy) : modifiedUrl;

        console.log(`✅ 修改后URL: ${finalUrl}`);
        env.done({ url: finalUrl });

    } catch (error) {
        console.error(`❗ 发生错误: ${error.stack || error}`);
        env.done({});
    }
}

// 修复5: 使用函数声明提升
function updateCoordinates(url, lat, lon) {
    return url.replace(/([?&](lot|longitude|lon)=)[^&]*/g, `$1${lon}`)
             .replace(/([?&](lat|latitude)=)[^&]*/g, `$1${lat}`);
}

function addSearchParam(url, sort) {
    return url.includes("sort_by=") ? url.replace(/sort_by=\w+/, `sort_by=${sort}`)
                                   : `${url}${url.includes("?") ? "&" : "?"}sort_by=${sort}`;
}

// 最后启动主函数
main();
