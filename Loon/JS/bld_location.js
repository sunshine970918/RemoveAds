// 修复版位置修改脚本
const env = new LocationEnv("GeoModifier");

function main() {
    try {
        // 确保$argument存在（关键修复点）
        const params = $argument || {};
        
        // 参数解析（添加安全保护）
        const {
            useCoordinates = "true",
            customLatitude = "",
            customLongitude = "",
            sortBy = "distance",
            mapSearch = "false"
        } = params;

        // 请求对象验证（新增保护逻辑）
        if (!$request || !$request.url) {
            throw new Error("缺少请求对象");
        }
        const currentUrl = $request.url;
        
        // 功能开关判断
        if (useCoordinates === "false") {
            return finalResult(currentUrl, "📍 使用原始位置");
        }

        // 坐标校验（增强验证）
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

// 核心修改逻辑（保持稳定）
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

// 辅助函数（添加数值范围校验）
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

// 环境封装类（添加实例化保护）
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

// 启动保护（防止重复执行）
if (typeof __mainExecuted === "undefined") {
    let __mainExecuted = true;
    main();
}
