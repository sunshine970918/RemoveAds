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
    if (!lastUrl || lastUrl !== requestUrl) {
      env.setdata(requestUrl, STORAGE_KEY);
      env.log("成功捕获图片/视频链接:", requestUrl);

      // 触发通知：自动适配不同环境的参数
      env.msg(
        "Blued 图片助手", 
        "成功捕获图片/视频链接", 
        requestUrl, 
        requestUrl // 直接传链接，让msg方法内部适配参数
      );
    } else {
      env.log("重复 URL，已忽略:", requestUrl);
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
 * Env 通用类（修复通知适配问题）
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

    // 【核心修复】消息通知：自动适配不同环境的跳转/预览参数
    msg(title = this.name, subt = "", desc = "", link = "") {
      if (this.isMute) return;
      let notifyOpts = {};

      // 1. 适配跳转参数
      if (link) {
        if (this.isSurge() || this.isLoon()) {
          notifyOpts.url = link; // Surge/Loon 跳转用 url
        } else if (this.isQuanX()) {
          notifyOpts["open-url"] = link; // QuanX 跳转用 open-url
          notifyOpts["media-url"] = link; // QuanX 预览用 media-url
        }
      }

      // 2. 发送通知（匹配对应环境的API）
      switch (true) {
        case this.isSurge() || this.isLoon():
          $notification.post(title, subt, desc, notifyOpts);
          break;
        case this.isQuanX():
          $notify(title, subt, desc, notifyOpts);
          break;
        case this.isNode():
          console.log(`${title}\n${subt}\n${desc}\n链接: ${link}`);
          break;
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
