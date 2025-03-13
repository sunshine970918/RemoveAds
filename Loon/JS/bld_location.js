class Env {
    constructor(name) {
        this.name = name;
        this.startTime = Date.now();
        console.log(`🔔 ${name} 服务启动`);
    }

    done(result) {
        console.log(`🕒 耗时: ${((Date.now() - this.startTime)/1000).toFixed(3)}秒`);
        $done(result);
    }
}

const env = new Env("Blued精准定位修改器");

// Loon 专用参数解析
function parseLoonArguments() {
    const params = {};
    try {
        // 方法1：从请求URL直接提取参数
        const urlObj = new URL($request.url);
        urlObj.searchParams.forEach((value, key) => {
            params[key] = decodeURIComponent(value);
        });

        // 方法2：兼容Loon的$argument对象
        if (typeof $argument !== "undefined") {
            Object.entries($argument).forEach(([k, v]) => {
                params[k] = decodeURIComponent(v);
            });
        }

        console.log("⚙️ Loon环境参数:", JSON.stringify(params, null, 2));
        return params;
    } catch (e) {
        console.log("⚠️ 参数解析失败:", e.message);
        return {};
    }
}

async function main() {
    try {
        const args = parseLoonArguments();
        
        // 参数优先级：用户指定参数 > URL自带参数 > 默认值
        const lat = args.customLatitude || args.lat || args.latitude || "23.1193";
        const lon = args.customLongitude || args.lon || args.longitude || "113.3668";
        const enableMapSearch = args.mapSearchEnabled === "true";
        const sortBy = args.sortBy || "nearby";

        console.log("🔍 最终参数决策:");
        console.log(`   Latitude来源: ${lat} [${args.customLatitude ? '用户指定' : '自动提取'}]`);
        console.log(`   Longitude来源: ${lon} [${args.customLongitude ? '用户指定' : '自动提取'}]`);

        // 坐标有效性验证
        const isValid = (v) => /^-?\d{1,3}\.\d{4,}$/.test(v);
        if (!isValid(lat) || !isValid(lon)) {
            console.log(`❌ 非法坐标格式:
   当前纬度: ${lat} (${typeof lat})
   当前经度: ${lon} (${typeof lon})
   要求格式: 小数点后至少4位，示例 23.1193`);
            return env.done({});
        }

        // URL重写引擎
        const modifiedUrl = $request.url
            .replace(/([?&](latitude|lat))=([^&]*)/gi, `$1=${lat}`)
            .replace(/([?&](longitude|lon))=([^&]*)/gi, `$1=${lon}`)
            .replace(/([?&]sort_by)=([^&]*)/gi, `$1=${sortBy}`);

        console.log(`✅ 修改验证通过:\n${modifiedUrl}`);
        env.done({ url: modifiedUrl });

    } catch (error) {
        console.error(`❗ 致命错误:\n${error.stack || error}`);
        env.done({});
    }
}

main();
