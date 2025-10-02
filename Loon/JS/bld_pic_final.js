/* 以下为脚本核心代码（注解已整合至上方文档） */
const $ = new Env("GOGOGOGO");
let url = $request.url, headers = $request.headers;

if (headers["User-Agent"].indexOf("Blued") !== -1 || headers["user-agent"].indexOf("Blued") !== -1) {
    try {
        // 检查是否为 Quantumult X、Loon 或 Shadowrocket 环境
        if ('undefined' !== typeof $task || 'undefined' !== typeof $loon) {
            const notify = $.getdata("pngUrl");
            if (!notify || notify !== url) {
                // 如果不存在通知或者当前链接与之前存储的链接不同，则发送通知
                $.setdata(url, "pngUrl");
                $.msg("PNG链接捕获成功", "点击此通知查看PNG", "", { 'media-url': url });
            }
        } else {
                $.msg("PNG链接捕获成功", "", "点击此通知查看PNG", url);
        }
    } catch (e) {
        console.error("错误:", e);
    }
}

$.done({});

/**
 * Env 通用类（适配多工具，核心支持通知跳转）
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

    // 通知方法：适配多工具跳转（字符串链接优先）
    msg(title, subtitle, content, url) {
      if (this.isMute) return;
      if (this.isSurge() || this.isLoon()) {
        $notification.post(title, subtitle, content, url);
      } else if (this.isQuanX()) {
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
