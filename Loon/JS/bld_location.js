const env = new Env("bluedlocation");

async function main() {
  try {
    // 获取或设置经纬度信息
    const useCity = $argument.useCity === "true";
    const useCoordinates = $argument.useCoordinates !== "false"; // 默认为true
    const customCity = $argument.customCity || "";
    let latitude = $argument.customLatitude || "";
    let longitude = $argument.customLongitude || "";
    const apiKey = $argument.AK || "gQsCAgCrWsuN99ggSIjGn5nO";
    const sortBy = $argument.sortBy || "nearby";
    const scriptEnabled = $argument.scriptEnabled === "true"; // 确保正确读取scriptEnabled参数
    const mapSearchEnabled = $argument.mapSearchEnabled === "true";

    if (!scriptEnabled) {
      console.log("脚本已禁用");
      return env.done({});
    }

    if (!useCity && !useCoordinates) {
      console.log("默认使用经纬度");
    }

    if (useCity && useCoordinates) {
      console.log("请选择使用城市或经纬度，二者不可同时使用");
      return env.done({});
    }

    let requestUrl = $request.url;
    let coordinatesUpdated = false;

    if (useCity) {
      if (customCity) {
        const coordinates = await getCoordinatesFromCity(customCity, apiKey);
        if (coordinates) {
          longitude = coordinates.longitude;
          latitude = coordinates.latitude;
          coordinatesUpdated = true;
          console.log(`通过 API 获取的经纬度: Longitude: ${longitude}, Latitude: ${latitude}`);
        } else {
          console.log("未找到坐标信息");
          return env.done({});
        }
      } else {
        console.log("未提供自定义城市");
        return env.done({});
      }
    } else if (useCoordinates) {
      if (latitude && longitude) {
        coordinatesUpdated = true;
        console.log(`通过 argument 读取的经纬度: Longitude: ${longitude}, Latitude: ${latitude}`);
      } else {
        console.log("未提供自定义经纬度");
        return env.done({});
      }
    }

    // 修改请求URL
    if (coordinatesUpdated) {
      requestUrl = replaceCoordinatesInUrl(requestUrl, latitude, longitude);
      if (mapSearchEnabled) {
        requestUrl = addSortByParameter(requestUrl, sortBy);
      }
      console.log(`经纬度替换后的 URL: ${requestUrl}`);
    } else {
      console.log("经纬度未更改，返回原始 URL");
    }

    env.done({ url: requestUrl });
  } catch (error) {
    console.error("发生错误:", error);
    env.done({});
  }
}

async function getCoordinatesFromCity(city, apiKey) {
  const encodedCity = encodeURIComponent(city);
  const apiUrl = `https://api.map.baidu.com/geocoder/v2/?address=${encodedCity}&output=json&ak=${apiKey}&callback=showLocation0`;
  const headers = {
    ":authority": "api.map.baidu.com",
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br",
    "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1",
    "accept-language": "zh-CN,zh-Hans;q=0.9",
    "referer": "https://maplocation.sjfkai.com/"
  };

  try {
    const response = await new Promise((resolve, reject) => {
      env.http.get({ url: apiUrl, headers }, (error, response, body) => {
        if (error) reject(error);
        else resolve(body);
      });
    });

    const coordinatesRegex = /"lng":([\d.]+),"lat":([\d.]+)/;
    const coordinatesMatch = response.match(coordinatesRegex);

    return coordinatesMatch ? { longitude: coordinatesMatch[1], latitude: coordinatesMatch[2] } : null;
  } catch (error) {
    console.error("获取坐标时发生错误:", error);
    return null;
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
    // 检查URL中是否已经包含sort_by参数
    if (url.includes("sort_by=")) {
      // 如果已经包含sort_by参数，则替换它
      return url.replace(/sort_by=[^&]*/, `sort_by=${sortBy}`);
    } else {
      // 如果没有包含sort_by参数，则添加它
      return url + `&sort_by=${sortBy}`;
    }
  } else {
    // 如果URL中没有问号，则添加问号和sort_by参数
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
          return this.send.call(this.env, t);
        }
        post(t) {
          return this.send.call(this.env, t, "POST");
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
    isNode() {
      return "undefined" != typeof module && !!module.exports;
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
    initGotEnv(t) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar));
    }
    get(t, e = () => {}) {
      t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": false })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i); })) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
        try {
          if (t.headers["set-cookie"]) {
            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar;
          }
        } catch (t) {
          this.logErr(t);
        }
      }).then(t => {
        const { statusCode: s, statusCode: i, headers: o, body: r } = t;
        e(null, { status: s, statusCode: i, headers: o, body: r }, r);
      }, t => {
        const { message: s, response: i } = t;
        e(s, i, i && i.body);
      }));
    }
    post(t, e = () => {}) {
      if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": false })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i); });
      else if (this.isNode()) {
        this.initGotEnv(t);
        const { url: s, ...i } = t;
        this.got.post(s, i).then(t => {
          const { statusCode: s, statusCode: i, headers: o, body: r } = t;
          e(null, { status: s, statusCode: i, headers: o, body: r }, r);
        }, t => {
          const { message: s, response: i } = t;
          e(s, i, i && i.body);
        });
      }
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
            let e = t.openUrl || t.url || t["open-url"],
              s = t.mediaUrl || t["media-url"];
            return { openUrl: e, mediaUrl: s };
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return { url: e };
          }
        }
      };
      if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, r(o)) : console.log(e, s, i)), !this.isMuteLog) {
        let t = ["", "==============📣系统通知📣=============="];
        t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t);
      }
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator));
    }
    logErr(t, e) {
      const s = !this.isSurge() && !this.isLoon();
      s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t);
    }
    wait(t) {
      return new Promise(e => setTimeout(e, t));
    }
    done(t = {}) {
      const e = (new Date().getTime() - this.startTime) / 1000;
      this.log("", `🔔${this.name}, 结束! 🕛 ${e} 秒`), this.log(), (this.isSurge() || this.isLoon()) && $done(t);
    }
  }(t, e);
}
