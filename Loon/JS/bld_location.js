const env = new Env("LocationModifier");

function main() {
    try {
        const { 
            useCoordinates = "true",
            customLatitude = "",
            customLongitude = "",
            sortBy = "nearby",
            mapSearchEnabled = "false"
        } = $argument;

        const reqUrl = $request.url;
        const shouldUseCoords = useCoordinates !== "false";
        const hasValidCoords = customLatitude && customLongitude;

        if (!shouldUseCoords) {
            return finalize(reqUrl, "使用原始位置");
        }

        if (!hasValidCoords) {
            env.done({});
            throw new Error("缺少经纬度参数");
        }

        const modifiedUrl = processUrl(reqUrl, customLatitude, customLongitude, {
            sortBy: mapSearchEnabled === "true" ? sortBy : null
        });

        finalize(modifiedUrl, "位置已修改");
    } catch (error) {
        console.error(`处理失败: ${error.message}`);
        env.done({});
    }
}

function processUrl(url, lat, lng, options = {}) {
    // 替换坐标参数
    let newUrl = url.replace(/([?&])(lat|latitude|lng|longitude|lon|lot)=[^&]*/g, (m, p1, p2) => {
        return p2.toLowerCase().startsWith("lat") ? `${p1}lat=${lat}` : `${p1}lng=${lng}`;
    });

    // 处理排序参数
    if (options.sortBy) {
        newUrl = newUrl.includes("sort_by=") 
            ? newUrl.replace(/sort_by=[^&]*/, `sort_by=${options.sortBy}`)
            : `${newUrl}${newUrl.includes("?") ? "&" : "?"}sort_by=${options.sortBy}`;
    }
    
    return newUrl;
}

function finalize(url, message) {
    console.log(`${message} => ${url}`);
    env.done({ url });
}

class Env {
    constructor(name) {
        this.name = name;
        this.logs = [];
    }

    done(response) {
        console.log(`[${this.name}] 处理完成`);
        $done(response);
    }
}

main();
