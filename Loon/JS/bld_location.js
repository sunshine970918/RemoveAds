// 🚀 Blued 经纬度全 URL 强制修改
// Surge / Loon 双兼容
// 所有 URL 中出现的经纬度字段全部覆盖
// 与是否刷新无关，只要命中请求就改

console.log("🚀 Blued 全 URL 定位修改器启动");

// ========================
// Argument 解析
// ========================
function parseArguments() {
    try {
        let input = {};

        if (typeof $argument === 'string' && $argument.trim()) {
            input = JSON.parse($argument);
        } else if (typeof $argument === 'object' && $argument !== null) {
            input = $argument;
        }

        const lat = input.customLatitude?.toString().trim();
        const lng = input.customLongitude?.toString().trim();

        if (!lat || !lng) {
            console.error("❌ 缺少 customLatitude / customLongitude");
            return null;
        }

        if (isNaN(lat) || isNaN(lng)) {
            console.error("❌ 经纬度不是数字");
            return null;
        }

        console.log(`📍 固定定位 → lat=${lat}, lng=${lng}`);
        return { lat, lng };
    } catch (e) {
        console.error(`❌ Argument 解析失败：${e.message}`);
        return null;
    }
}

// ========================
// URL 全量修改
// ========================
function rewriteUrl(url, params) {
    if (!url.includes('?')) return { url, modified: false };

    const [base, qs] = url.split('?');
    const sp = new URLSearchParams(qs);

    let modified = false;

    const LAT_KEYS = ['lat', 'latitude', 'custom_lat'];
    const LNG_KEYS = ['lng', 'longitude', 'lot', 'custom_lon'];

    for (const key of LAT_KEYS) {
        if (sp.has(key)) {
            console.log(`🔁 URL 纬度命中 ${key}: ${sp.get(key)} → ${params.lat}`);
            sp.set(key, params.lat);
            modified = true;
        }
    }

    for (const key of LNG_KEYS) {
        if (sp.has(key)) {
            console.log(`🔁 URL 经度命中 ${key}: ${sp.get(key)} → ${params.lng}`);
            sp.set(key, params.lng);
            modified = true;
        }
    }

    return {
        url: modified ? `${base}?${sp.toString()}` : url,
        modified
    };
}

// ========================
// 主逻辑
// ========================
(function main() {
    const params = parseArguments();
    if (!params) {
        $done({});
        return;
    }

    const result = rewriteUrl($request.url, params);

    if (result.modified) {
        console.log(`✅ URL 已强制重写`);
        $done({ url: result.url });
    } else {
        console.log(`⚠️ URL 中未发现经纬度参数`);
        $done({});
    }
})();
