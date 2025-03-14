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

        // 通用布尔值转换
        const parseBool = (value) => String(value).toLowerCase() === 'true';
        if ('mapSearchEnabled' in args) args.mapSearchEnabled = parseBool(args.mapSearchEnabled);
        if ('useCoordinates' in args) args.useCoordinates = parseBool(args.useCoordinates);

        console.log(`🔍 参数解析结果:\n${JSON.stringify(args, null, 2)}`);
        return args;
    } catch (e) {
        console.log(`⚠️ 参数解析失败: ${e.stack || e}`);
        return {};
    }
}

// URL参数处理函数
function processUrlParams(url, params) {
    try {
        const [baseUrl, queryString] = url.split('?');
        const searchParams = new URLSearchParams(queryString || '');

        // 处理坐标参数
        if (params.useCoordinates) {
            searchParams.set('latitude', params.customLatitude);
            searchParams.set('longitude', params.customLongitude);
        }

        // 处理排序参数
        if (params.mapSearchEnabled) {
            searchParams.set('sort_by', params.sortBy);
        }

        // 重构URL
        const newQuery = searchParams.toString();
        return newQuery ? `${baseUrl}?${newQuery}` : baseUrl;
    } catch (e) {
        console.error(`❗ URL处理失败: ${e.stack || e}`);
        return url;
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
            mapSearchEnabled = true,
            useCoordinates = true
        } = parseArguments();

        // 使用更稳健的URL处理方式
        const newUrl = processUrlParams($request.url, {
            customLatitude,
            customLongitude,
            sortBy,
            mapSearchEnabled,
            useCoordinates
        });

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
