// 🚀 Blued 定位修改（URL + Body）
// Surge / Loon 双兼容
// 优先改 URL，其次改 JSON Body
// 自动跳过非 JSON Body（protobuf / gzip）

console.log(`🚀 Blued定位修改器启动（URL + Body）`);

// ========================
// Argument 解析
// ========================
function parseArguments() {
    try {
        let userInput = {};

        if (typeof $argument === 'string' && $argument.trim() !== '') {
            userInput = JSON.parse($argument);
        } else if (typeof $argument === 'object' && $argument !== null) {
            userInput = $argument;
        }

        const params = {
            lat: userInput.customLatitude?.toString().trim(),
            lng: userInput.customLongitude?.toString().trim()
        };

        if (!params.lat || !params.lng) {
            console.error(`❌ 参数缺失：${JSON.stringify(userInput)}`);
            return null;
        }

        if (isNaN(Number(params.lat)) || isNaN(Number(params.lng))) {
            console.error(`❌ 参数格式错误`);
            return null;
        }

        console.log(`📍 目标定位：lat=${params.lat}, lng=${params.lng}`);
        return params;
    } catch (e) {
        console.error(`❌ Argument 解析失败：${e.message}`);
        return null;
    }
}

// ========================
// URL 参数修改
// ========================
function processUrl(url, params) {
    try {
        const [base, qs] = url.split('?');
        if (!qs) return { url, modified: false };

        const sp = new URLSearchParams(qs);
        let modified = false;

        ['lat', 'latitude', 'custom_lat'].forEach(k => {
            if (sp.has(k)) {
                console.log(`🔄 URL纬度(${k})：${sp.get(k)} → ${params.lat}`);
                sp.set(k, params.lat);
                modified = true;
            }
        });

        ['lng', 'longitude', 'lot', 'custom_lon'].forEach(k => {
            if (sp.has(k)) {
                console.log(`🔄 URL经度(${k})：${sp.get(k)} → ${params.lng}`);
                sp.set(k, params.lng);
                modified = true;
            }
        });

        return {
            url: modified ? `${base}?${sp.toString()}` : url,
            modified
        };
    } catch (e) {
        console.error(`❗ URL 处理失败：${e.message}`);
        return { url, modified: false };
    }
}

// ========================
// Body 修改（仅 JSON）
// ========================
function processBody(body, params) {
    if (!body) return { body, modified: false };

    try {
        const obj = JSON.parse(body);
        let modified = false;

        function walk(o) {
            if (typeof o !== 'object' || o === null) return;

            for (const k in o) {
                const v = o[k];

                if (['lat', 'latitude'].includes(k)) {
                    console.log(`🧬 Body纬度(${k})：${v} → ${params.lat}`);
                    o[k] = Number(params.lat);
                    modified = true;
                }

                if (['lng', 'longitude', 'lot'].includes(k)) {
                    console.log(`🧬 Body经度(${k})：${v} → ${params.lng}`);
                    o[k] = Number(params.lng);
                    modified = true;
                }

                if (typeof v === 'object') {
                    walk(v);
                }
            }
        }

        walk(obj);

        return {
            body: modified ? JSON.stringify(obj) : body,
            modified
        };
    } catch (e) {
        // 非 JSON（protobuf / gzip），直接跳过
        console.log(`⏭️ Body 非 JSON，跳过`);
        return { body, modified: false };
    }
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

    let urlResult = processUrl($request.url, params);
    let bodyResult = processBody($request.body, params);

    if (urlResult.modified || bodyResult.modified) {
        console.log(`✅ 定位修改生效（URL:${urlResult.modified} Body:${bodyResult.modified}）`);
        $done({
            url: urlResult.url,
            body: bodyResult.body
        });
    } else {
        console.log(`⚠️ 未发现可修改的定位字段`);
        $done({});
    }
})();
