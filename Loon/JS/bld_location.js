// 🚀 Blued 定位修改器
// 支持 URL 参数 + JSON body 经纬度替换
// 使用方式：在 Loon 配置中加入：
// http-request ^https:\/\/((social|argo)\.(blued|irisgw)\.cn|\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b)\/(users|users/selection|users/nearby/new_face|ticktocks/.*) script-path=bld_location.js, tag=FakeGPS

console.log(`🚀 Blued定位修改器 服务启动`);
console.log(`🔧 [Argument]传入参数: ${JSON.stringify($argument, null, 2)}`);

// 参数解析
function parseArguments() {
    try {
        const { customLatitude, customLongitude } = $argument || {};
        const defaultLat = '23.134709';
        const defaultLon = '113.333000';

        const finalParams = {
            customLatitude: (customLatitude && customLatitude.trim()) || defaultLat,
            customLongitude: (customLongitude && customLongitude.trim()) || defaultLon
        };

        console.log(`🔍 最终经纬度参数:
纬度：${finalParams.customLatitude}（${customLatitude ? '用户输入' : '默认值'}）
经度：${finalParams.customLongitude}（${customLongitude ? '用户输入' : '默认值'}）`);
        return finalParams;
    } catch (error) {
        console.error(`❌ 参数解析失败：${error.message}`);
        return { customLatitude: '23.134709', customLongitude: '113.333000' };
    }
}

// URL 参数处理
function processUrlParams(url, params) {
    try {
        const [baseUrl, queryString] = url.split('?');
        const searchParams = new URLSearchParams(queryString || '');

        const latKeys = ['lat', 'latitude', 'custom_lat'];
        latKeys.forEach(key => {
            if (searchParams.has(key)) {
                const oldVal = searchParams.get(key);
                searchParams.set(key, params.customLatitude);
                console.log(`🔄 纬度(${key})：${oldVal} → ${params.customLatitude}`);
            }
        });

        const lonKeys = ['lot', 'longitude', 'custom_lon', 'lng'];
        lonKeys.forEach(key => {
            if (searchParams.has(key)) {
                const oldVal = searchParams.get(key);
                searchParams.set(key, params.customLongitude);
                console.log(`🔄 经度(${key})：${oldVal} → ${params.customLongitude}`);
            }
        });

        const newQuery = searchParams.toString();
        return newQuery ? `${baseUrl}?${newQuery}` : baseUrl;
    } catch (error) {
        console.error(`❗ URL处理失败：${error.message}`);
        return url;
    }
}

// Body 参数处理（支持 JSON）
function processBody(body, params) {
    try {
        if (!body) return body;
        let modified = body;

        // 尝试 JSON 解析
        try {
            const obj = JSON.parse(body);
            let changed = false;

            if (obj.lat !== undefined) {
                console.log(`🔄 Body.lat: ${obj.lat} → ${params.customLatitude}`);
                obj.lat = params.customLatitude;
                changed = true;
            }
            if (obj.latitude !== undefined) {
                console.log(`🔄 Body.latitude: ${obj.latitude} → ${params.customLatitude}`);
                obj.latitude = params.customLatitude;
                changed = true;
            }
            if (obj.lng !== undefined) {
                console.log(`🔄 Body.lng: ${obj.lng} → ${params.customLongitude}`);
                obj.lng = params.customLongitude;
                changed = true;
            }
            if (obj.longitude !== undefined) {
                console.log(`🔄 Body.longitude: ${obj.longitude} → ${params.customLongitude}`);
                obj.longitude = params.customLongitude;
                changed = true;
            }

            if (changed) {
                modified = JSON.stringify(obj);
            }
        } catch {
            // 如果不是 JSON，尝试正则替换（key=value）
            modified = body
                .replace(/(lat=)([^&]*)/, `$1${params.customLatitude}`)
                .replace(/(latitude=)([^&]*)/, `$1${params.customLatitude}`)
                .replace(/(lng=)([^&]*)/, `$1${params.customLongitude}`)
                .replace(/(longitude=)([^&]*)/, `$1${params.customLongitude}`);
        }

        return modified;
    } catch (error) {
        console.error(`❗ Body处理失败：${error.message}`);
        return body;
    }
}

// 主逻辑
function main() {
    const startTime = Date.now();
    try {
        const params = parseArguments();

        // 修改 URL
        const modifiedUrl = processUrlParams($request.url, params);

        // 修改 Body（仅限 POST/PUT 等有 body 的请求）
        const modifiedBody = processBody($request.body, params);

        console.log(`✅ 修改完成: URL=${modifiedUrl}, Body=${modifiedBody ? '[已改写]' : '[无修改]'}`);
        $done({ url: modifiedUrl, body: modifiedBody });
    } catch (error) {
        console.error(`❗ 脚本执行异常：${error.message}`);
        $done({});
    } finally {
        console.log(`⏱️ 处理耗时：${Date.now() - startTime}ms`);
    }
}

main();
