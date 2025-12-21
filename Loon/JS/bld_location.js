/**
 * 🚀 Blued 定位强制修改（终极完整版）
 * 仅作用于 blued.cn
 * URL + JSON Body + protobuf 兜底
 * Surge / Loon 双兼容
 */

console.log("🚀 Blued 定位修改器启动");

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
            console.log("❌ 缺少 customLatitude / customLongitude");
            return null;
        }

        if (isNaN(lat) || isNaN(lng)) {
            console.log("❌ 经纬度不是数字");
            return null;
        }

        console.log(`📍 固定定位：lat=${lat}, lng=${lng}`);
        return { lat, lng };
    } catch (e) {
        console.log("❌ Argument 解析失败：" + e.message);
        return null;
    }
}

// ========================
// URL 经纬度强制修改
// ========================
function rewriteUrl(url, params) {
    if (!url.includes('?')) return { url, modified: false };

    const [base, qs] = url.split('?');
    const sp = new URLSearchParams(qs);

    let modified = false;

    const LAT_KEYS = ['lat', 'latitude', 'custom_lat'];
    const LNG_KEYS = ['lng', 'longitude', 'lot', 'custom_lon'];

    LAT_KEYS.forEach(k => {
        if (sp.has(k)) {
            console.log(`🔁 URL 纬度 ${k}: ${sp.get(k)} → ${params.lat}`);
            sp.set(k, params.lat);
            modified = true;
        }
    });

    LNG_KEYS.forEach(k => {
        if (sp.has(k)) {
            console.log(`🔁 URL 经度 ${k}: ${sp.get(k)} → ${params.lng}`);
            sp.set(k, params.lng);
            modified = true;
        }
    });

    return {
        url: modified ? `${base}?${sp.toString()}` : url,
        modified
    };
}

// ========================
// JSON Body 经纬度修改
// ========================
function rewriteJsonBody(body, params) {
    if (!body) return { body, modified: false };

    try {
        const obj = JSON.parse(body);
        let modified = false;

        function walk(o) {
            if (typeof o !== 'object' || o === null) return;

            for (const k in o) {
                const v = o[k];

                if (['lat', 'latitude'].includes(k)) {
                    console.log(`🧬 Body 纬度 ${k}: ${v} → ${params.lat}`);
                    o[k] = Number(params.lat);
                    modified = true;
                }

                if (['lng', 'longitude', 'lot'].includes(k)) {
                    console.log(`🧬 Body 经度 ${k}: ${v} → ${params.lng}`);
                    o[k] = Number(params.lng);
                    modified = true;
                }

                if (typeof v === 'object') walk(v);
            }
        }

        walk(obj);

        return {
            body: modified ? JSON.stringify(obj) : body,
            modified
        };
    } catch {
        return { body, modified: false };
    }
}

// ========================
// protobuf / octet-stream 兜底
// ========================
function rewriteProtobuf(body, params, headers) {
    if (!body) return { body, modified: false };

    const ct =
        headers?.['content-type'] ||
        headers?.['Content-Type'] ||
        '';

    if (!/protobuf|octet-stream/i.test(ct)) {
        return { body, modified: false };
    }

    try {
        let raw = body;
        let modified = false;

        const LAT_KEYS = ['latitude', 'lat'];
        const LNG_KEYS = ['longitude', 'lng', 'lot'];

        LAT_KEYS.forEach(k => {
            if (raw.includes(k)) {
                raw = raw.replace(
                    new RegExp(k + '[^0-9\\-\\.]*[0-9\\-\\.]+', 'g'),
                    `${k}:${params.lat}`
                );
                modified = true;
            }
        });

        LNG_KEYS.forEach(k => {
            if (raw.includes(k)) {
                raw = raw.replace(
                    new RegExp(k + '[^0-9\\-\\.]*[0-9\\-\\.]+', 'g'),
                    `${k}:${params.lng}`
                );
                modified = true;
            }
        });

        if (modified) {
            console.log("🧬 protobuf 定位兜底命中");
            return { body: raw, modified: true };
        }
    } catch {}

    return { body, modified: false };
}

// ========================
// 主逻辑
// ========================
(function main() {
    // 🔒 只允许 blued.cn
    if (!$request.url.includes(".blued.cn")) {
        $done({});
        return;
    }

    const params = parseArguments();
    if (!params) {
        $done({});
        return;
    }

    // 1️⃣ URL
    const urlResult = rewriteUrl($request.url, params);
    if (urlResult.modified) {
        $done({ url: urlResult.url });
        return;
    }

    // 2️⃣ JSON Body
    const jsonResult = rewriteJsonBody($request.body, params);
    if (jsonResult.modified) {
        $done({ body: jsonResult.body });
        return;
    }

    // 3️⃣ protobuf 兜底
    const pbResult = rewriteProtobuf(
        $request.body,
        params,
        $request.headers
    );

    if (pbResult.modified) {
        $done({ body: pbResult.body });
        return;
    }

    $done({});
})();
