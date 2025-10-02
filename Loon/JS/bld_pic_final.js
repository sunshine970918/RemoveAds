/*
 * Blued 图片助手
 * 功能：拦截目标请求，提取图片/视频 URL 保存并通知
 * 作者：Eric (改写版)
 * 仅供研究学习，禁止转卖
 */

const env = new Env("Blued 图片助手");
const STORAGE_KEY = "BluedPicURL";

const requestUrl = $request.url;
const requestHeaders = $request.headers;

try {
  // 判断请求头或者直接通过 URL 后缀匹配图片/视频
  if (
    (requestHeaders &&
      (requestHeaders["Content-Type"]?.includes("image/") ||
       requestHeaders["Accept"]?.includes("image/"))) ||
    /\.(jpg|png|mp4)$/.test(requestUrl)
  ) {
    const lastUrl = env.getdata(STORAGE_KEY);
    // 额外校验：确保是完整http/https链接（原代码可能隐含此逻辑）
    const validUrl = requestUrl.startsWith("http") ? requestUrl : "";
    if (validUrl && (!lastUrl || lastUrl !== validUrl)) {
      env.setdata(validUrl, STORAGE_KEY);
      env.log("成功捕获图片/视频链接:", validUrl);

      // 【原代码核心写法】直接传链接字符串，而非对象（兼容性最强）
      // 不同工具对字符串参数的处理：
      // - Surge/Loon：自动识别为跳转链接
      // - QuanX：自动映射为open-url
      env.msg("Blued 图片助手", "成功捕获链接", validUrl, validUrl);
    } else {
      env.log("重复/无效 URL，已忽略:", requestUrl);
    }
  } else {
    env.log("未匹配到图片/视频:", requestUrl);
  }
} catch (err) {
  env.logErr(err);
  env.msg("Blued 图片助手", "出错", String(err));
}

env.done({});

/**
 * Env 通用类（完全对齐原代码的通知逻辑）
 */
function Env(name, opts) {
  class Http {
    constructor(env) { this.env = env; }
    send(req, method = "GET") {
      req = typeof req === "string" ? { url: req } : req;
      let sender = this.get;
      if (method === "POST") sender = this.post;
      return new Promise((resolve, reject) => {
        sender.call(this, req, (err, resp, body) => {
          if (err) reject(err);
          else resolve(resp);
        });
      });
    }
    get(req, cb) { return this.sendRequest(req, "GET", cb); }
    post(req, cb) { return this.sendRequest(req, "POST", cb); }
    sendRequest(req, method, cb) {
      switch (true) {
        case this.env.isSurge() || this.env.isLoon():
          $httpClient[method.toLowerCase()](req, (err, resp, body) => {
            if (resp) resp.body = body;
            cb(err, resp, body);
          });
          break;
        case this.env.isQuanX():
          req.method = method;
          $task.fetch(req).then(
            (resp) => cb(null, { ...resp, body: resp.body }, resp.body),
            (err) => cb(err)
          );
          break;
        case this.env.isNode():
          const request = require("request");
          request[method.toLowerCase()](req, (err, resp, body) => {
            cb(err, resp, body);
          });
          break;
      }
    }
  }

  return new (class {
    constructor(name, opts) {
      this.name = name;
      this.http = new Http(this);
      this.data = null;
      this.logs = [];
      this.isMute = false;
      this.isNeedRewrite = false;
      this.logSeparator = "\n";
      Object.assign(this, opts);
      this.log("", `🔔${this.name}, 开始!`);
    }

    // 环境判断（原代码标准写法）
    isNode() { return typeof module !== "undefined" && !!module.exports; }
    isQuanX() { return typeof $task !== "undefined"; }
    isSurge() { return typeof $httpClient !== "undefined" && typeof $loon === "undefined"; }
    isLoon() { return typeof $loon !== "undefined"; }

    // 数据读写（原代码逻辑）
    getdata(key) {
      if (this.isSurge() || this.isLoon()) return $persistentStore.read(key);
      if (this.isQuanX()) return $prefs.valueForKey(key);
      if (this.isNode()) {
        this.data = this.data || {};
        return this.data[key];
      }
      return null;
    }
    setdata(val, key) {
      if (this.isSurge() || this.isLoon()) return $persistentStore.write(val, key);
      if (this.isQuanX()) return $prefs.setValueForKey(val, key);
      if (this.isNode()) {
        this.data = this.data || {};
        this.data[key] = val;
        return true;
      }
      return false;
    }

    // 【关键】通知方法：完全对齐原代码的参数处理（支持字符串链接）
    msg(title, subtitle, content, url) {
      if (this.isMute) return;
      // 原代码核心逻辑：优先用字符串url，而非对象
      if (this.isSurge() || this.isLoon()) {
        // Surge/Loon 对字符串url的兼容性最好，直接传第四个参数
        $notification.post(title, subtitle, content, url);
      } else if (this.isQuanX()) {
        // QuanX 字符串url会自动转为open-url，额外加media-url支持预览
        $notify(title, subtitle, content, {
          "open-url": url,
          "media-url": url
        });
      } else if (this.isNode()) {
        console.log(`${title}\n${subtitle}\n${content}\n链接: ${url}`);
      }
    }

    log(...msg) { console.log(msg.join(this.logSeparator)); }
    logErr(err) { console.error(err); }
    done(val = {}) {
      if (this.isNode()) process.exit(0);
      else if (typeof $done !== "undefined") $done(val);
    }
  })(name, opts);
}
