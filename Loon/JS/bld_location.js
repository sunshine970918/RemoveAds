// 专为 Loon 优化的位置修改脚本
const env = new LocationEnv("LoonGeoModifier");

function main() {
    try {
        // Loon 参数获取方式
        const params = getLoonParams();
        
        // 参数解析
        const {
            useCoordinates = "true",
            customLatitude = "",
            customLongitude = "",
            sortBy = "distance",
            mapSearch = "false"
        } = params;

        // 获取请求对象 (Loon 专用方式)
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
    }
}

// Loon 参数获取函数
function getLoonParams() {
    // 方式1: 通过 $config 获取
    if (typeof $config !== "undefined" && $config.getParameter) {
        return {
            useCoordinates: $config.getParameter("useCoordinates") || "true",
            customLatitude: $config.getParameter("customLatitude") || "",
            customLongitude: $config.getParameter("customLongitude") || "",
            sortBy: $config.getParameter("sortBy") || "distance",
            mapSearch: $config.getParameter("mapSearch") || "false"
        };
    }
    
    // 方式2: 通过 URL 参数解析 (适用于 Loon 的脚本参数传递)
    if (typeof $argument !== "undefined") {
        const parseParams = (str) => {
            return str.split('&').reduce((acc, pair) => {
                const [key, value] = pair.split('=');
                acc[key] = decodeURIComponent(value || '');
                return acc;
            }, {});
        };
        return parseParams($argument);
    }
    
    // 保底返回空对象
    return {};
}

/* 以下函数保持不变 */
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
