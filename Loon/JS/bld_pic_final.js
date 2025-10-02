/***********************************************
 * Blued 图片助手
 * 作者：sunshine970918（改良版）
 * 功能：捕获并通知可点击跳转的图片/视频链接
 ***********************************************/

const env = new Env("Blued 图片助手");

(async () => {
  try {
    let requestUrl = "";
    if (typeof $request !== "undefined" && $request.url) {
      requestUrl = $request.url;
      env.log(`捕获到请求: ${requestUrl}`);
    }

    if (requestUrl) {
      env.msg(
        "Blued 图片助手",
        "成功捕获图片/视频链接",
        requestUrl,
        {
          "open-url": requestUrl,   // Surge / Loon
          "media-url": requestUrl,  // Surge / Loon 通知缩略图
          "url": requestUrl         // QuanX 点击跳转
        }
      );
    } else {
      env.log("未捕获到有效链接");
    }
  } catch (e) {
    env.log(`脚本出错: ${e}`);
  } finally {
    env.done();
  }
})();

/***********************************************
 * Env 框架 - 通用跨平台通知 & 日志
 ***********************************************/
function Env(name) {
  this.name = name;
  this.startTime = new Date().getTime();
  this.isNode = () => typeof module !== "undefined" && !!module.exports;
  this.isQuanX = () => typeof $task !== "undefined";
  this.isSurge = () => typeof $httpClient !== "undefined" && typeof $loon === "undefined";
  this.isLoon = () => typeof $loon !== "undefined";
  this.isMute = false;

  this.log = (...args) => console.log(`[${this.name}]`, ...args);

  this.msg = (title = this.name, subt = "", desc = "", opts = {}) => {
    if (this.isMute) return;
    if (this.isSurge() || this.isLoon()) {
      $notification.post(title, subt, desc, opts);
    } else if (this.isQuanX()) {
      if (opts["open-url"]) opts["url"] = opts["open-url"];
      $notify(title, subt, desc, opts);
    } else if (this.isNode()) {
      this.log(`${title}\n${subt}\n${desc}\n${JSON.stringify(opts)}`);
    }
  };

  this.done = (value = {}) => {
    const endTime = new Date().getTime();
    const cost = ((endTime - this.startTime) / 1000).toFixed(2);
    this.log(`🔔${this.name}, 结束! ⏱ ${cost} 秒`);
    if (this.isQuanX() || this.isSurge() || this.isLoon()) $done(value);
  };
}
