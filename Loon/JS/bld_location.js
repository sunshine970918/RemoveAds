class LocationService {
    constructor(name = "Blued定位服务") {
        this.name = name;
        this.startTime = performance.now();
        console.log(`🚀 ${this.name} 启动`);
    }

    parseArguments() {
        try {
            // 多环境参数类型检测
            if (typeof $argument === "object" && $argument !== null) {
                console.log("📥 参数类型: 结构化对象");
                return this.sanitizeParams($argument);
            }

            const rawArgs = String($argument || "");
            console.log(`📥 原始输入参数: ${JSON.stringify(rawArgs)}`); // 安全字符串化

            // 智能格式检测
            if (rawArgs.startsWith("{") && rawArgs.endsWith("}")) {
                console.log("🔍 解析方式: JSON解析");
                return this.sanitizeParams(JSON.parse(rawArgs));
            }

            console.log("🔍 解析方式: 键值对分解");
            return this.parseKeyValue(rawArgs);
            
        } catch (e) {
            console.error(`⚠️ 参数解析异常: ${e.message}`, e.stack);
            return this.sanitizeParams({});
        }
    }

    parseKeyValue(rawString) {
        return rawString.split("&").reduce((acc, pair) => {
            const [key, val] = pair.split("=").map(s => decodeURIComponent(s.trim()));
            if (key) acc[key] = val || "";
            return acc;
        }, {});
    }

    sanitizeParams(params) {
        // 参数标准化处理
        return {
            lat: params.lat || params.latitude || params.纬度 || "",
            lon: params.lon || params.longitude || params.经度 || "",
            sort: params.sort || params.sort_by || params.排序 || "nearby",
            enableSearch: ["true", "1"].includes(String(params.enableSearch || params.mapSearchEnabled || "false").toLowerCase())
        };
    }

    executeModification() {
        try {
            const { lat, lon, sort, enableSearch } = this.parseArguments();
            console.log("📊 有效参数:", JSON.stringify({ lat, lon, sort, enableSearch }, null, 2));

            // 强制数值验证
            if (!/^-?\d+\.?\d*$/.test(lat) || !/^-?\d+\.?\d*$/.test(lon)) {
                throw new Error(`非法坐标值: lat=${lat} lon=${lon}`);
            }

            let targetUrl = $request.url
                .replace(/([?&](?:lat|latitude)=)[^&]*/gi, `$1${lat}`)
                .replace(/([?&](?:lon|longitude)=)[^&]*/gi, `$1${lon}`);

            if (enableSearch) {
                targetUrl = targetUrl.includes("sort_by=") ? 
                    targetUrl.replace(/([?&]sort_by=)[^&]*/i, `$1${sort}`) : 
                    `${targetUrl}${targetUrl.includes("?") ? "&" : "?"}sort_by=${sort}`;
            }

            console.log("✅ 地理坐标已更新:");
            console.log(targetUrl);
            
            return { url: targetUrl };
            
        } catch (e) {
            console.error(`❌ 修改失败: ${e.message}`);
            return { url: $request.url };
        }
    }

    complete() {
        const duration = performance.now() - this.startTime;
        console.log(`⏱️ 服务耗时: ${duration.toFixed(2)}ms`);
        $done(this.executeModification());
    }
}

// 实例化并执行服务
new LocationService().complete();
