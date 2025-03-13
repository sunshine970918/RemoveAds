// 环境初始化
class Env {
    constructor(name) {
        this.name = name;
        this.startTime = Date.now();
        console.log(`🚀 ${name} 服务启动 | Loon ${typeof $loon !== 'undefined' ? $loon.version : 'Unknown'}`);
    }

    done(result) {
        const duration = Date.now() - this.startTime;
        console.log(`⏱️ 请求处理耗时: ${duration}ms`);
        $done(result);
    }
}

const env = new Env("Blued定位修改器");

// Loon 专用参数解析
function parseLoonArgs() {
    try {
        // 调试输出原始参数结构
        console.log("📥 原始输入参数:", JSON.stringify($argument, null, 2));
        
        // 兼容不同参数传递方式
        return {
            lat: $argument?.lat || $argument?.latitude || $argument?.customLatitude,
            lon: $argument?.lon || $argument?.longitude || $argument?.customLongitude,
            sort: $argument?.sortBy || "nearby",
            enableMap: $argument?.mapSearchEnabled === "true"
        };
    } catch (e) {
        console.log("⚠️ 参数解析失败:", e.message);
        return { lat: null, lon: null };
    }
}

// 主处理逻辑
async function main() {
    const { lat, lon, sort, enableMap } = parseLoonArgs();
    console.log("🔍 参数解析结果:", JSON.stringify({ lat, lon, sort, enableMap }, null, 2));

    // 参数有效性验证
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        console.log("❌ 参数校验失败: 坐标必须为数字格式\n示例: latitude=23.12 longitude=113.33");
        return env.done({});
    }

    // 核心修改逻辑
    let newUrl = $request.url
        .replace(/([?&](latitude|lat)=)[^&]*/gi, `$1${lat}`)
        .replace(/([?&](longitude|lon)=)[^&]*/gi, `$1${lon}`);

    // 智能添加排序参数
    if (enableMap) {
        newUrl = newUrl.includes("sort_by=") ? 
            newUrl.replace(/([?&]sort_by=)[^&]*/, `$1${sort}`) : 
            `${newUrl}${newUrl.includes("?") ? "&" : "?"}sort_by=${sort}`;
    }

    console.log(`✅ 修改成功:\n${decodeURIComponent(newUrl)}`);
    env.done({ url: newUrl });
}

// 启动执行
main();
