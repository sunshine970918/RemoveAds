// 🚀 Blued定位修改器（Surge/Loon 双兼容版）
// 自动适配参数格式：Surge直接读键值对，Loon自动解析JSON字符串
// 配置示例（二选一）：
// 👉 Surge配置：
// [Script]
// http-request ^https:\/\/((social|argo)\.(blued|irisgw)\.cn)\/(users/(nearby/new_face|selection|guess-like/push|[^/]+/joy)|ticktocks/[^?]*\?.*(?:lat|lng|latitude|longitude)=|blued/(?!adms/)[^?]*\?.*(?:lat|lng|latitude|longitude)=|users\?.*(?:lat|lng|latitude|longitude)=) script-path=bld_location_universal.js, tag=FakeGPS, customLatitude=23.135197677361752, customLongitude=113.33890805000999
// 👉 Loon配置：
// http-request ^https:\/\/((social|argo)\.(blued|irisgw)\.cn)\/(users/(nearby/new_face|selection|guess-like/push|[^/]+/joy)|ticktocks/[^?]*\?.*(?:lat|lng|latitude|longitude)=|blued/(?!adms/)[^?]*\?.*(?:lat|lng|latitude|longitude)=|users\?.*(?:lat|lng|latitude|longitude)=) script-path=bld_location_universal.js, tag=FakeGPS, customLatitude=23.135197677361752, customLongitude=113.33890805000999

console.log("🚀 双兼容版定位修改器启动");

try {
    // 核心：自动适配 Surge/Loon 参数格式
    let argObj = {};
    if ($argument) {
        // 判定格式：字符串→Loon（JSON字符串），对象→Surge（键值对）
        if (typeof $argument === "string") {
            try {
                argObj = JSON.parse($argument);
                console.log("🔧 识别为Loon环境，解析JSON参数成功");
            } catch (e) {
                console.error("❌ Loon参数JSON解析失败：", e.message);
                $done({ url: $request.url, body: $request.body || "" });
                return;
            }
        } else {
            argObj = $argument;
            console.log("🔧 识别为Surge环境，直接读取键值对参数");
        }
    } else {
        console.error("❌ 未传入任何参数！");
        $done({ url: $request.url, body: $request.body || "" });
        return;
    }

    // 提取并校验经纬度（无默认值，严格校验）
    const lat = argObj.customLatitude ? String(argObj.customLatitude).trim() : null;
    const lon = argObj.customLongitude ? String(argObj.customLongitude).trim() : null;
    if (!lat || !lon || isNaN(Number(lat)) || isNaN(Number(lon))) {
        console.error("❌ 经纬度参数无效：lat=", lat, "lon=", lon);
        $done({ url: $request.url, body: $request.body || "" });
        return;
    }
    console.log("✅ 目标定位：lat=", lat, "lon=", lon);

    // URL参数替换（正则全覆盖，兼容大小写）
    const originalUrl = $request.url;
    console.log("📡 原始URL：", originalUrl);
    const [baseUrl, queryString] = originalUrl.split("?");

    if (!queryString) {
        console.log("ℹ️ URL无查询参数，无需修改");
        $done({ url: originalUrl, body: $request.body || "" });
        return;
    }

    // 正则替换所有可能的经纬度键（忽略大小写，适配所有场景）
    let newQuery = queryString
        .replace(/(lat=)([^&]*)/gi, `$1${lat}`)
        .replace(/(latitude=)([^&]*)/gi, `$1${lat}`)
        .replace(/(custom_lat=)([^&]*)/gi, `$1${lat}`)
        .replace(/(lon=)([^&]*)/gi, `$1${lon}`)
        .replace(/(lng=)([^&]*)/gi, `$1${lon}`)
        .replace(/(longitude=)([^&]*)/gi, `$1${lon}`)
        .replace(/(lot=)([^&]*)/gi, `$1${lon}`)
        .replace(/(custom_lon=)([^&]*)/gi, `$1${lon}`);

    const modifiedUrl = `${baseUrl}?${newQuery}`;
    console.log("✅ 修改后URL：", modifiedUrl);

    // 双兼容返回格式（同时满足Surge/Loon规范）
    $done({
        url: modifiedUrl,
        body: $request.body || "" // 避免空body导致工具异常
    });

} catch (error) {
    console.error("❗ 脚本执行异常：", error.message);
    // 异常时返回原始请求，不影响App使用
    $done({
        url: $request.url,
        body: $request.body || ""
    });
}
