const env = new Env("bluedlocation");

async function main() {
    try {
        const useCoordinates = $argument.useCoordinates !== "false"; // 默认为true
        let latitude = $argument.customLatitude || "";
        let longitude = $argument.customLongitude || "";
        const sortBy = $argument.sortBy || "nearby";
        const mapSearchEnabled = $argument.mapSearchEnabled === "true";

        if (!useCoordinates) {
            console.log("默认使用经纬度");
        }

        const requestUrl = $request.url;

        if (useCoordinates) {
            if (latitude && longitude) {
                const updatedUrl = replaceCoordinatesInUrl(requestUrl, latitude, longitude);
                if (mapSearchEnabled) {
                    const finalUrl = addSortByParameter(updatedUrl, sortBy);
                    console.log(`经纬度替换并添加排序后的 URL: ${finalUrl}`);
                    env.done({ url: finalUrl });
                } else {
                    console.log(`经纬度替换后的 URL: ${updatedUrl}`);
                    env.done({ url: updatedUrl });
                }
            } else {
                console.log("未提供自定义经纬度");
                return env.done({});
            }
        } else {
            console.log("经纬度未更改，返回原始 URL");
            env.done({ url: requestUrl });
        }
    } catch (error) {
        console.error("发生错误:", error);
        env.done({});
    }
}

function replaceCoordinatesInUrl(url, latitude, longitude) {
    return url.replace(/(lot|longitude|lon)=\d+\.\d+|(lat|latitude)=\d+\.\d+/g, function(match, p1, p2) {
        if (p1 === "lot" || p1 === "longitude" || p1 === "lon") return `${p1}=${longitude}`;
        if (p2 === "lat" || p2 === "latitude") return `${p2}=${latitude}`;
        return match;
    });
}

function addSortByParameter(url, sortBy) {
    if (url.includes("?")) {
        if (url.includes("sort_by=")) {
            return url.replace(/sort_by=[^&]*/, `sort_by=${sortBy}`);
        } else {
            return url + `&sort_by=${sortBy}`;
        }
    } else {
        return url + `?sort_by=${sortBy}`;
    }
}

main();

function Env(t, e) {
    "use strict";
    return new class {
        constructor(t, e) {
            this.name = t;
            this.http = new class {
                constructor(t) {
                    this.env = t;
                }
                send(t, e = "GET") {
                    t = "string" == typeof t ? { url: t } : t;
                    let s = this.get;
                    "POST" === e && (s = this.post);
                    return new Promise((e, i) => {
                        s.call(this, t, (t, s, o) => {
                            t ? i(t) : e(s);
                        });
                    });
                }
                get(t) {
                    return new Promise((resolve, reject) => {
                        $httpClient.get(t, (error, response, body) => {
                            if (error) {
                                console.error("HTTP GET请求失败:", error);
                                reject(error);
                            } else {
                                resolve({ status: response.status, body: body });
                            }
                        });
                    });
                }
                post(t) {
                    return new Promise((resolve, reject) => {
                        $httpClient.post(t, (error, response, body) => {
                            if (error) {
                                console.error("HTTP POST请求失败:", error);
                                reject(error);
                            } else {
                                resolve({ status: response.status, body: body });
                            }
                        });
                    });
                }
            }(this);
            this.logs = [];
            this.isMute = false;
            this.isNeedRewrite = false;
            this.logSeparator = "\n";
            this.encoding = "utf-8";
            this.startTime = new Date().getTime();
            Object.assign(this, e);
            this.log("", `🔔${this.name}, 开始!`);
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon;
        }
        isLoon() {
            return "undefined" != typeof $loon;
        }
        toObj(t, e = null) {
            try {
                return JSON.parse(t);
            } catch {
                return e;
            }
        }
        toStr(t, e = null) {
            try {
                return JSON.stringify(t);
            } catch {
                return e;
            }
        }
        get(t, e = () => {}) {
            $httpClient.get(t, (t, s, i) => {
                if (t) {
                    console.error("GET请求失败:", t);
                    e(t, null, null);
                } else {
                    console.log("GET请求成功，响应数据:", i);
                    e(null, s, i);
                }
            });
        }
        post(t, e = () => {}) {
            $httpClient.post(t, (t, s, i) => {
                if (t) {
                    console.error("POST请求失败:", t);
                    e(t, null, null);
                } else {
                    console.log("POST请求成功，响应数据:", i);
                    e(null, s, i);
                }
            });
        }
        time(t, e = null) {
            const s = e ? new Date(e) : new Date();
            let i = {
                "M+": s.getMonth() + 1,
                "d+": s.getDate(),
                "H+": s.getHours(),
                "m+": s.getMinutes(),
                "s+": s.getSeconds(),
                "q+": Math.floor((s.getMonth() + 3) / 3),
                S: s.getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
            return t;
        }
        msg(e = t, s = "", i = "", o) {
            const r = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isSurge() ? { url: t } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"];
                        let s = t.mediaUrl || t["media-url"];
                        return { openUrl: e, mediaUrl: s };
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return { url: e };
                    }
                }
            };
            if (!this.isMute && (this.isSurge() || this.isLoon())) {
                const params = r(o);
                if (this.isSurge()) {
                    $notification.post(e, s, i, params && params.url ? params.url : "");
                } else if (this.isLoon()) {
                    $notification.post(e, s, i, params);
                }
            }
            if (!this.isMuteLog) {
                let t = ["", "==============📣系统通知📣=============="];
                t.push(e), s && t.push(s), i && t.push(i);
                console.log(t.join("\n"));
                this.logs = this.logs.concat(t);
            }
        }
        log(...t) {
            if (t.length > 0) {
                this.logs = [...this.logs, ...t];
            }
            console.log(t.join(this.logSeparator));
        }
        logErr(t, e) {
            const s = !this.isSurge() && !this.isLoon();
            if (s) {
                this.log("", `❗️${this.name}, 错误!`, t.stack);
            } else {
                this.log("", `❗️${this.name}, 错误!`, t);
            }
        }
        wait(t) {
            return new Promise(e => setTimeout(e, t));
        }
        done(t = {}) {
            const e = (new Date().getTime() - this.startTime) / 1000;
            this.log("", `🔔${this.name}, 结束! 🕛 ${e} 秒`);
            this.log();
            if (this.isSurge() || this.isLoon()) {
                $done(t);
            }
        }
    }(t, e);
}
