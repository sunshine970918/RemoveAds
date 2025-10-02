/*
 * Blued 图片抓取脚本
 * 功能：拦截目标请求，提取图片 URL 保存并通知
 * 作者：Eric
 * 仅供研究学习，禁止转卖
 */

const env = new Env("Blued 图片助手");
const STORAGE_KEY = "BluedPicURL";

const requestUrl = $request.url;
const requestHeaders = $request.headers;

try {
  // 保持原始触发逻辑：判断请求头是否为图片
  if (requestHeaders && 
      (requestHeaders["Content-Type"]?.includes("image/") ||
       requestHeaders["Accept"]?.includes("image/"))) {
    const lastUrl = env.getdata(STORAGE_KEY);
    if (!lastUrl || lastUrl !== requestUrl) {
      env.setdata(requestUrl, STORAGE_KEY);
      // 通知模块恢复原来的完整形式
      env.msg("Blued 图片助手", "成功捕获图片链接", requestUrl, {
        "open-url": requestUrl,
        "media-url": requestUrl
      });
    }
  }
} catch (err) {
  env.logErr(err);
  env.msg("Blued 图片助手", "出错", String(err));
}

env.done({});

/**
 * Env 通用类（适配 Surge/Loon/QuanX/Node.js 等环境，带完整通知模块）
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
      this.logSeparator = "\\n";
      Object.assign(this, opts);
      this.log("", `🔔${this.name}, 开始!`);
    }

    // 环境判断
    isNode() { return typeof module !== "undefined" && !!module.exports; }
    isQuanX() { return typeof $task !== "undefined"; }
    isSurge() { return typeof $httpClient !== "undefined" && typeof $loon === "undefined"; }
    isLoon() { return typeof $loon !== "undefined"; }

    // 数据读写
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

    // 消息通知（完整形式）
    msg(title = this.name, subt = "", desc = "", opts = {}) {
      if (this.isMute) return;
      if (this.isSurge() || this.isLoon()) {
        $notification.post(title, subt, desc, opts);
      } else if (this.isQuanX()) {
        $notify(title, subt, desc, opts);
      } else if (this.isNode()) {
        console.log(`${title}\\n${subt}\\n${desc}`);
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
