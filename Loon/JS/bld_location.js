// 🚀 Blued定位修改器（最终稳定版）
// 修复全角字符+return语法错误，双兼容Surge/Loon，无任何语法问题
// 配置示例：
// Surge: [Script]节点传参；Loon: 规则后传参，参数名customLatitude/customLongitude

console.log("🚀 双兼容稳定版定位修改器启动");

function main() {
    try {
        // 1. 自动适配Surge/Loon参数格式
        let argObj = {};
        if ($argument) {
            if (typeof $argument === "string") {
                // Loon环境：解析JSON字符串
                try {
                    argObj = JSON.parse($argument);
                    console.log("🔧 识别为Loon环境，参数解析成功");
                } catch (e) {
                    console.error("❌ Loon参数解析失败：", e.message);
                    $done({ url: $request.url, body: $request.body || "" });
                    return;
                }
            } else {
                // Surge环境：读取键值对
                argObj = $argument;
                console.log("🔧 识别为Surge环境，参数读取成功");
            }
        } else {
            console.error("❌ 未传入经纬度参数");
            $done({ url: $request.url, body: $request.body || "" });
            return;
        }

        // 2. 提取并校验参数（全半角修复：所有符号用半角）
        const lat = argObj.customLatitude ? String(argObj.customLatitude).trim() : null;
        const lon = argObj.customLongitude ? String(argObj.customLongitude).trim() : null;
        if (!lat || !lon || isNaN(Number(lat)) || isNaN(Number(lon))) {
            console.error("❌ 参数无效：lat=", lat, "lon=", lon, "(需为数字)");
            $done({ url: $request.url, body: $request.body || "" });
            return;
        }
        console.log("✅ 目标定位：lat=", lat, "lon=", lon);

        // 3. URL参数替换（正则全覆盖，半角符号）
        const originalUrl = $request.url;
        const [baseUrl, queryString] = originalUrl.split("?");

        if (!queryString) {
            console.log("ℹ️ URL无查询参数，无需修改");
            $done({ url: originalUrl, body: $request.body || "" });
            return;
        }

        // 正则替换所有经纬度键（忽略大小写，半角符号）
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

        // 4. 合规返回（半角符号，满足Surge/Loon规范）
        $done({
            url: modifiedUrl,
            body: $request.body || ""
        });

    } catch (error) {
        console.error("❗ 脚本执行异常：", error.message);
        $done({ url: $request.url, body: $request.body || "" });
    }
}

// 启动主函数
main();
