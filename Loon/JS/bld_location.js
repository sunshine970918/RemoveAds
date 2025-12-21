// 🚀 Blued定位修改器（仅Argument传参+流程可视化版）
// 仅读取Loon传入的customLatitude/customLongitude，无本地存储/默认值，强化日志排查
// Loon配置示例：
// http-request ^https:\/\/((social|argo)\.(blued|irisgw)\.cn)\/(users/(nearby/new_face|selection|guess-like/push|[^/]+/joy)|ticktocks/[^?]*\?.*(?:lat|lng|latitude|longitude)=|blued/(?!adms/)[^?]*\?.*(?:lat|lng|latitude|longitude)=|users\?.*(?:lat|lng|latitude|longitude)=) script-path=bld_location_arg_only_debug.js, tag=FakeGPS, customLatitude=23.135197677361752, customLongitude=113.33890805000999

console.log(`🚀 Blued定位修改器启动（仅Argument传参）`);
console.log(`🔧 传入参数原始值：${JSON.stringify($argument)}`);

// 1. 参数解析（简化校验，确保有效参数必返回）
function parseArguments() {
    try {
        // 直接从$argument提取，无需额外处理（Loon已确保参数为对象）
        const { customLatitude, customLongitude } = $argument || {};
        
        // 基础校验：参数存在且不为空
        if (!customLatitude || !customLongitude) {
            console.error(`❌ 错误：缺少经纬度参数！需传入customLatitude和customLongitude`);
            return null;
        }
        
        // 格式化参数（去空格+转字符串，避免格式异常）
        const finalParams = {
            lat: String(customLatitude).trim(),
            lon: String(customLongitude).trim()
        };
        
        // 二次校验：参数为有效数字（允许字符串格式的数字，如"23.123"）
        if (isNaN(Number(finalParams.lat)) || isNaN(Number(finalParams.lon))) {
            console.error(`❌ 错误：经纬度格式无效！当前纬度：${finalParams.lat}，经度：${finalParams.lon}`);
            return null;
        }
        
        console.log(`✅ 参数解析成功：目标纬度=${finalParams.lat}，目标经度=${finalParams.lon}`);
        return finalParams;
    } catch (error) {
        console.error(`❌ 参数解析异常：${error.message}`);
        return null;
    }
}

// 2. URL参数修改（核心逻辑，强制打印修改详情）
function processUrlParams(url, target) {
    console.log(`📡 开始处理URL：${url}`);
    const [baseUrl, queryString] = url.split('?');
    
    // 无查询参数直接返回原URL
    if (!queryString) {
        console.log(`ℹ️ URL无查询参数，无需修改`);
        return url;
    }
    
    const searchParams = new URLSearchParams(queryString);
    let modifiedCount = 0;
    
    // 替换纬度参数（覆盖所有可能的键）
    const latKeys = ['lat', 'latitude', 'custom_lat'];
    latKeys.forEach(key => {
        if (searchParams.has(key)) {
            const oldVal = searchParams.get(key);
            searchParams.set(key, target.lat);
            console.log(`🔄 替换纬度[${key}]：${oldVal} → ${target.lat}`);
            modifiedCount++;
        }
    });
    
    // 替换经度参数（覆盖所有可能的键）
    const lonKeys = ['lot', 'longitude', 'custom_lon', 'lng', 'lon'];
    lonKeys.forEach(key => {
        if (searchParams.has(key)) {
            const oldVal = searchParams.get(key);
            searchParams.set(key, target.lon);
            console.log(`🔄 替换经度[${key}]：${oldVal} → ${target.lon}`);
            modifiedCount++;
        }
    });
    
    if (modifiedCount === 0) {
        console.log(`ℹ️ URL中无匹配的经纬度参数，未修改`);
        return url;
    }
    
    const newUrl = `${baseUrl}?${searchParams.toString()}`;
    console.log(`✅ URL修改完成：${newUrl}`);
    return newUrl;
}

// 3. 主逻辑（强制流程执行，打印完整链路）
function main() {
    const startTime = Date.now();
    console.log(`⏱️ 主逻辑启动，处理耗时计时开始`);
    
    try {
        // 步骤1：解析参数
        const targetParams = parseArguments();
        if (!targetParams) {
            console.warn(`⚠️ 无有效参数，终止修改`);
            $done({});
            return;
        }
        
        // 步骤2：修改URL
        const originalUrl = $request.url;
        const modifiedUrl = processUrlParams(originalUrl, targetParams);
        
        // 步骤3：返回结果（即使URL未修改，也携带原URL/Body，避免空对象）
        console.log(`🎉 处理完成！最终返回：URL=${modifiedUrl}，Body=[原内容]`);
        $done({
            url: modifiedUrl,
            body: $request.body || '' // 确保Body不为空，避免Loon异常
        });
    } catch (error) {
        console.error(`❗ 主逻辑执行失败：${error.message}`);
        $done({ url: $request.url, body: $request.body || '' });
    } finally {
        console.log(`⏱️ 处理结束，总耗时：${Date.now() - startTime}ms`);
    }
}

// 启动主逻辑（确保必执行）
main();
