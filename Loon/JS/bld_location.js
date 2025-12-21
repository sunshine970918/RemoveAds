// 🚀 Blued 定位修改（仅 Argument 传参）
// Surge / Loon 双兼容
// 仅修改 URL 中的经纬度参数，不碰 Body
//
// Surge 示例：
// http-request ^https:\/\/((social|argo)\.(blued|irisgw)\.cn)\/... script-path=bld_location_only_arg.js, tag=FakeGPS, argument={"customLatitude":"23.135197677361752","customLongitude":"113.33890805000999"}

console.log(`🚀 Blued定位修改器启动（仅Argument传参）`);
console.log(`🔧 传入参数原始值：${typeof $argument === 'string' ? $argument : JSON.stringify($argument)}`);
console.log(`⏱️ 主逻辑启动，处理耗时计时开始`);

// ========================
// Argument 解析（核心修复点）
// ========================
function parseArguments() {
    try {
        let userInput = {};

        // Surge：$argument 是 string
        if (typeof $argument === 'string' && $argument.trim() !== '') {
            userInput = JSON.parse($argument);
        }
        // Loon：$argument 是 object
        else if (typeof $argument === 'object' && $argument !== null) {
            userInput = $argument;
        }

        const finalParams = {
            customLatitude: userInput.customLatitude?.toString().trim() || null,
            customLongitude: userInput.customLongitude?.toString().trim() || null
        };

        if (!finalParams.customLatitude || !finalParams.customLongitude) {
            console.error(`❌ 参数缺失，解析结果：${JSON.stringify(userInput)}`);
            return null;
        }

        if (
            isNaN(Number(finalParams.customLatitude)) ||
            isNaN(Number(finalParams.customLongitude))
        ) {
            console.error(`❌ 参数格式错误：${JSON.stringify(finalParams)}`);
            return null;
        }

        console.log(`🔍 最终生效参数：
纬度：${finalParams.customLatitude}
经度：${finalParams.customLongitude}`);

        return finalParams;
    } catch (error) {
        console.error(`❌ Argument 解析失败：${error.message}`);
        return null;
    }
}

// ========================
// URL 参数修改
// ========================
function processUrlParams(url, params) {
    try {
        const [baseUrl, queryString] = url.split('?');
        if (!queryString) return url;

        const searchParams = new URLSearchParams(queryString);
        let isModified = false;

        // 纬度参数
        ['lat', 'latitude', 'custom_lat'].forEach(key => {
            if (searchParams.has(key)) {
                const oldVal = searchParams.get(key);
                searchParams.set(key, params.customLatitude);
                console.log(`🔄 URL纬度(${key})：${oldVal} → ${params.customLatitude}`);
                isModified = true;
            }
        });

        // 经度参数
        ['lng', 'longitude', 'lot', 'custom_lon'].forEach(key => {
            if (searchParams.has(key)) {
                const oldVal = searchParams.get(key);
                searchParams.set(key, params.customLongitude);
                console.log(`🔄 URL经度(${key})：${oldVal} → ${params.customLongitude}`);
                isModified = true;
            }
        });

        return isModified ? `${baseUrl}?${searchParams.toString()}` : url;
    } catch (error) {
        console.error(`❗ URL 参数处理失败：${error.message}`);
        return url;
    }
}

// ========================
// 主逻辑
// ========================
function main() {
    const startTime = Date.now();

    try {
        const params = parseArguments();
        if (!params) {
            console.warn(`⚠️ 无有效参数，不执行定位修改`);
            $done({});
            return;
        }

        const modifiedUrl = processUrlParams($request.url, params);

        console.log(`✅ 定位修改完成
URL：${modifiedUrl}`);

        $done({ url: modifiedUrl });
    } catch (error) {
        console.error(`❗ 脚本执行异常：${error.message}`);
        $done({});
    } finally {
        console.log(`⏱️ 处理耗时：${Date.now() - startTime}ms`);
    }
}

main();
