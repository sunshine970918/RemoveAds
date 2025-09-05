// 🚀 Blued定位修改
// 仅依赖Loon配置中传入的customLatitude/customLongitude
// 使用方式：Loon配置需带参数，示例：
// http-request ^https:\/\/((social|argo)\.(blued|irisgw)\.cn)\/(users/(nearby/new_face|selection|guess-like/push|[^/]+/joy)|ticktocks/[^?]*\?.*(?:lat|lng|latitude|longitude)=|blued/(?!adms/)[^?]*\?.*(?:lat|lng|latitude|longitude)=|users\?.*(?:lat|lng|latitude|longitude)=) script-path=bld_location_only_arg.js, tag=FakeGPS, customLatitude=目标纬度, customLongitude=目标经度

console.log(`🚀 Blued定位修改，服务启动`);
console.log(`🔧 [Argument]传入参数: ${JSON.stringify($argument, null, 2) || '未传入任何参数'}`);

// 参数解析：读取$argument传参
function parseArguments() {
    try {
        const userInput = $argument || {};
        // 从传入参数中获取经纬度，trim()去除空格避免无效值
        const finalParams = {
            customLatitude: userInput.customLatitude ? userInput.customLatitude.trim() : null,
            customLongitude: userInput.customLongitude ? userInput.customLongitude.trim() : null
        };

        // 强制校验：必须传入完整经纬度，否则不执行修改
        if (!finalParams.customLatitude || !finalParams.customLongitude) {
            console.error(`❌ 参数缺失！Loon配置中必须传入 "customLatitude"（纬度）和 "customLongitude"（经度），当前参数：${JSON.stringify(finalParams)}`);
            return null;
        }

        // 校验经纬度格式（基础数字校验，避免非数字参数）
        if (isNaN(Number(finalParams.customLatitude)) || isNaN(Number(finalParams.customLongitude))) {
            console.error(`❌ 参数格式错误！经纬度必须为数字，当前纬度：${finalParams.customLatitude}，经度：${finalParams.customLongitude}`);
            return null;
        }

        console.log(`🔍 最终生效参数:
纬度：${finalParams.customLatitude}（用户Argument传入）
经度：${finalParams.customLongitude}（用户Argument传入）`);
        return finalParams;
    } catch (error) {
        console.error(`❌ 参数解析异常：${error.message}`);
        return null;
    }
}

// URL 参数处理：核心修改逻辑（仅改URL中的经纬度参数）
function processUrlParams(url, params) {
    try {
        const [baseUrl, queryString] = url.split('?');
        if (!queryString) return url; // 无URL参数，直接返回原URL

        const searchParams = new URLSearchParams(queryString);
        let isModified = false;

        // 匹配所有可能的纬度参数键（lat/latitude/custom_lat）
        const latKeys = ['lat', 'latitude', 'custom_lat'];
        latKeys.forEach(key => {
            if (searchParams.has(key)) {
                const oldVal = searchParams.get(key);
                searchParams.set(key, params.customLatitude);
                console.log(`🔄 URL纬度(${key})：${oldVal} → ${params.customLatitude}`);
                isModified = true;
            }
        });

        // 匹配所有可能的经度参数键（lot/longitude/custom_lon/lng）
        const lonKeys = ['lot', 'longitude', 'custom_lon', 'lng'];
        lonKeys.forEach(key => {
            if (searchParams.has(key)) {
                const oldVal = searchParams.get(key);
                searchParams.set(key, params.customLongitude);
                console.log(`🔄 URL经度(${key})：${oldVal} → ${params.customLongitude}`);
                isModified = true;
            }
        });

        // 生成新URL（仅修改过才重组，未修改则返回原URL）
        const newQuery = searchParams.toString();
        return isModified ? `${baseUrl}?${newQuery}` : url;
    } catch (error) {
        console.error(`❗ URL参数处理失败：${error.message}`);
        return url;
    }
}

// Body处理：简化（无需修改，直接返回原Body）
function processBody(body) {
    return body;
}

// 主逻辑：参数校验 → URL修改 → 执行完成
function main() {
    const startTime = Date.now();
    try {
        // 1. 解析参数（无有效参数则终止）
        const params = parseArguments();
        if (!params) {
            console.warn(`⚠️ 无有效经纬度参数，不执行定位修改`);
            $done({});
            return;
        }

        // 2. 修改URL中的经纬度参数
        const modifiedUrl = processUrlParams($request.url, params);

        // 3. Body无需修改，保持原内容
        const modifiedBody = processBody($request.body);

        // 4. 输出结果并完成
        console.log(`✅ 定位修改完成: 
URL：${modifiedUrl}
Body：[无需修改，保持原内容]`);
        $done({ url: modifiedUrl, body: modifiedBody });
    } catch (error) {
        console.error(`❗ 脚本执行异常：${error.message}`);
        $done({});
    } finally {
        console.log(`⏱️ 处理耗时：${Date.now() - startTime}ms`);
    }
}

// 启动主逻辑
main();
