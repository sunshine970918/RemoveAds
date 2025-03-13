// 专为 Loon 优化的位置修改脚本
const env = new LocationEnv("LoonGeoModifier");

function main() {
    try {
        console.log("接收到的参数:", $argument); // 调试用，确认$argument内容

        // 获取Loon参数
        const params = getLoonParams();
        console.log("解析得到的参数:", params);

        // 参数解析（确保默认值）
        const {
            useCoordinates = "true",
            customLatitude = "",
            customLongitude = "",
            sortBy = "distance",
            mapSearch = "false"
        } = params;

        // 获取请求对象 (Loon 专用)
        const request = $request;
        if (!request || !request.url) {
            throw new Error("❌ 缺少请求对象");
        }
        const currentUrl = request.url;

        // 功能开关判断
        if (useCoordinates === "false") {
            return finalResult(currentUrl, "📍 使用原始位置");
        }

        // 坐标校验
        if (!isValidCoordinate(customLatitude) || !isValidCoordinate(customLongitude)) {
            throw new Error(`❌ 无效的经纬度参数: lat=${customLatitude} lng=${customLongitude}`);
        }

        // 执行URL修改
        const modifiedUrl = modifyUrl(currentUrl, customLatitude, customLongitude, {
            enableSort: mapSearch === "true",
            sortType: sortBy
        });

        finalResult(modifiedUrl, "🔄 位置已修改");
    } catch (error) {
        handleError(error);
    } finally {
        console.log("脚本执行完成");
    }
}

// Loon 参数获取函数
function getLoonParams() {
    // 方式1: 使用 $config API，适用于较新版本的 Loon
    if (typeof $config !== "undefined" && $config.getParameter) {
        const useCoordinatesParam = $config.getParameter("useCoordinates") || "true";
        const customLatitude = $config.getParameter("customLatitude") || "";
        const customLongitude = $config.getParameter("customLongitude") || "";
        const sortBy = $config.getParameter("sortBy") || "distance";
        const mapSearch = $config.getParameter("mapSearch") || "false";
        return {
            useCoordinates: useCoordinatesParam,
            customLatitude: customLatitude,
            customLongitude: customLongitude,
            sortBy: sortBy,
            mapSearch: mapSearch
        };
    }

    // 方式2: 通过解析 $argument 参数
    if (typeof $argument !== "undefined") {
        const paramPairs = $argument.split('&');
        const params = paramPairs.reduce((acc, pair) => {
            const [key, value] = pair.split('=');
            if (key) {
                acc[key] = decodeURIComponent(value || '');
            }
            return acc;
        }, {});

        console.log("解析得到的参数:", params);
        return params;
    }

    // 保底返回默认参数
    console.warn("未通过 $config 或 $argument 获取参数，使用默认值");
    return {
        useCoordinates: "true",
        customLatitude: "",
        customLongitude: "",
        sortBy: "distance",
        mapSearch: "false"
    };
}

// 核心修改逻辑
function modifyUrl(originalUrl, lat, lng, options = {}) {
    let newUrl = originalUrl
        .replace(/([?&])(lat|latitude)=[^&]*/gi, `$1lat=${lat}`)
        .replace(/([?&])(lng|longitude|lon|lot)=[^&]*/gi, `$1lng=${lng}`);

    if (options.enableSort) {
        const sortParam = `sort_by=${options.sortType || 'distance'}`;
        newUrl = newUrl.includes('?') ? 
            `${newUrl}&${sortParam}` : 
            `${newUrl}?${sortParam}`;
    }
    return newUrl;
}

// 辅助函数
function isValidCoordinate(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= -180 && num <= 180;
}

function finalResult(url, message) {
    console.log(`${message}\n最终URL: ${url}`);
    env.done({ url });
}

function handleError(error) {
    console.error(`⚠️ 错误: ${error.message}`);
    env.done({});
}

// 环境封装类
class LocationEnv {
    constructor(name) {
        this.name = name || "LocationEnv";
    }
    
    done(response) {
        console.log(`[${this.name}] 执行完成`);
        if (typeof $done === "function") {
            $done(response);
        } else {
            console.warn("环境未提供$done方法");
        }
    }
}

// 启动保护
if (typeof __mainExecuted === "undefined") {
    let __mainExecuted = true;
    main();
}
