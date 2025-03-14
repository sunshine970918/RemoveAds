// 环境检测模块
const detectEnvironment = () => {
    if (typeof $loon !== "undefined") return `Loon ${$loon.version || '未知版本'}`;
    if (typeof $rocket !== "undefined") return `Stash ${$rocket.version || '未知版本'}`;
    if (typeof $environment !== "undefined" && $environment['surge-version']) {
        return `Surge ${$environment['surge-version']}`;
    }
    return '未知环境';
};

console.log(`🚀 Blued定位修改器 服务启动 | ${detectEnvironment()}`);

// 参数解析模块
function parseArguments() {
    try {
        const raw = $argument || '';
        console.log(`📥 原始输入参数: ${typeof raw === 'object' ? JSON.stringify(raw) : raw}`);

        const args = typeof raw === 'string' ? 
            Object.fromEntries(raw.split('&').map(p => {
                const [k, v] = p.split('=');
                return [k, decodeURIComponent(v || '')];
            })) : 
            raw;
        
        // 转换布尔值字符串为实际布尔类型
        if ('mapSearchEnabled' in args) args.mapSearchEnabled = args.mapSearchEnabled === 'true';
        if ('useCoordinates' in args) args.useCoordinates = args.useCoordinates === 'true';
        
        console.log(`🔍 参数解析结果:\n${JSON.stringify(args, null, 2)}`);
        return args;
    } catch (e) {
        console.log(`⚠️ 参数解析失败: ${e.stack || e}`);
        return {};
    }
}

// 主逻辑
async function main() {
    const start = Date.now();
    try {
        const { 
            customLatitude = '23.124231',
            customLongitude = '113.378788',
            sortBy = 'nearby',
            mapSearchEnabled = true,  // 默认允许修改排序
            useCoordinates = true    // 默认允许修改坐标
        } = parseArguments();

        let newUrl = $request.url;

        // 条件修改坐标
        if (useCoordinates) {
            newUrl = newUrl
                .replace(/([?&](lat|latitude)=)[^&]*/gi, `$1${customLatitude}`)
                .replace(/([?&](lon|longitude)=)[^&]*/gi, `$1${customLongitude}`);
        }

        // 条件修改排序
        if (mapSearchEnabled) {
            newUrl = newUrl.replace(/([?&]sort_by=)[^&]*/i, `$1${sortBy}`);
        }

        console.log(`✅ 修改成功:\n${newUrl}`);
        $done({ url: newUrl });
    } catch (e) {
        console.error(`❗ 执行异常: ${e.stack || e}`);
        $done({});
    } finally {
        console.log(`⏱️ 请求处理耗时: ${Date.now() - start}ms`);
    }
}

main();
