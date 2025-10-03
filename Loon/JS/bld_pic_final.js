// 核心配置：脚本名、存储键（用于去重）、目标URL匹配正则
const SCRIPT_NAME = 'Blued 图片助手';
const STORAGE_KEY = 'blued_pic_url_store'; // 存储已捕获链接，避免重复通知
// 精准匹配Blued资源URL（覆盖子域名、路径、后缀+签名参数）
const BLUED_RESOURCE_REG = /^https:\/\/(www|burn-chatfiles|.*burnchatfiles.*)\.bldimg\.(com|cn)\/(ingfiles|burn_chatfiles\/(videos|users))\/.*?\.(jpg|png|mp4)(\?.*)?$/;

// 初始化Env环境（处理存储、通知、工具适配，核心功能依赖）
const bluedHelperEnv = new Env(SCRIPT_NAME);

// 主逻辑：拦截请求→判断是否为目标资源→去重→发送通知
try {
  // 1. 获取当前拦截的请求URL和请求头
  const requestUrl = $request.url;
  const requestHeaders = $request.headers || {};

  // 2. 判断是否为Blued图片/视频（两种条件满足其一即可）
  // 条件1：请求头含图片标识（Content-Type包含image/）
  const isImageFromHeader = requestHeaders['Content-Type'] 
    ? requestHeaders['Content-Type'].indexOf('image/') !== -1 
    : false;
  // 条件2：URL匹配Blued资源正则（含签名参数也能匹配）
  const isTargetResource = isImageFromHeader || BLUED_RESOURCE_REG.test(requestUrl);

  if (isTargetResource) {
    // 3. 去重判断：读取已存储的链接，不同则更新存储并通知
    const storedUrl = bluedHelperEnv.getdata(STORAGE_KEY);
    if (!storedUrl || storedUrl !== requestUrl) {
      // 存储新链接（下次相同链接会被忽略）
      bluedHelperEnv.setdata(requestUrl, STORAGE_KEY);
      console.log(`[${SCRIPT_NAME}] 捕获新链接：`, requestUrl);

      // 4. 发送系统通知（支持点击跳转，QuanX可预览图片）
      bluedHelperEnv.msg(
        SCRIPT_NAME,          // 通知标题
        '成功捕获图片/视频',   // 通知副标题
        requestUrl,           // 通知内容（显示完整链接）
        {                     // 通知选项：跳转+预览配置
          'open-url': requestUrl,  // 点击通知跳转的链接
          'media-url': requestUrl  // QuanX预览图片的链接
        }
      );
    } else {
      // 重复链接：仅打日志，不发通知
      console.log(`[${SCRIPT_NAME}] 重复链接已忽略：`, requestUrl);
    }
  }
} catch (error) {
  // 错误处理：打印日志+发送错误通知
  console.error(`[${SCRIPT_NAME}] 运行出错：`, error.message);
  bluedHelperEnv.msg(
    SCRIPT_NAME, 
    '脚本出错', 
    `错误原因：${error.message}`
  );
} finally {
  // 脚本结束（必须调用，避免工具报错）
  bluedHelperEnv.done({});
}

// Env通用类（精简核心功能：存储、通知、工具适配，无多余逻辑）
function Env(scriptName) {
  // Http辅助类：仅保留必要请求能力（主逻辑暂未用到，预留扩展）
  class HttpHelper {
    constructor(env) { this.env = env; }
    send(requestOpts, method = 'GET') {
      return new Promise((resolve) => {
        this[method.toLowerCase()](requestOpts, (_, response) => resolve(response));
      });
    }
    get(requestOpts, callback) { $httpClient.get(requestOpts, callback); }
    post(requestOpts, callback) { $httpClient.post(requestOpts, callback); }
  }

  // 核心功能实现
  return new class {
    constructor(name) {
      this.scriptName = name;
      this.http = new HttpHelper(this);
      this.startTime = Date.now(); // 用于计算运行时间
    }

    // 识别当前工具环境（Surge/Loon/Quantumult X）
    getCurrentEnv() {
      if (typeof $task !== 'undefined') return 'Quantumult X';
      if (typeof $loon !== 'undefined') return 'Loon';
      if (typeof $httpClient !== 'undefined') return 'Surge';
      return 'Node.js'; // 预留Node环境，主逻辑暂用不到
    }

    // 读取存储（适配不同工具的存储API）
    getdata(storageKey) {
      switch (this.getCurrentEnv()) {
        case 'Surge':
        case 'Loon':
          return $persistentStore.read(storageKey);
        case 'Quantumult X':
          return $prefs.valueForKey(storageKey);
        default:
          return null;
      }
    }

    // 写入存储（适配不同工具的存储API）
    setdata(storageValue, storageKey) {
      switch (this.getCurrentEnv()) {
        case 'Surge':
        case 'Loon':
          return $persistentStore.write(storageValue, storageKey);
        case 'Quantumult X':
          return $prefs.setValueForKey(storageValue, storageKey);
        default:
          return false;
      }
    }

    // 发送系统通知（适配不同工具的通知API，支持跳转和预览）
    msg(title, subtitle, content, notifyOpts = {}) {
      // 格式化通知选项：统一不同工具的参数格式
      const formattedOpts = () => {
        const jumpUrl = notifyOpts['open-url'] || notifyOpts.url;
        const previewUrl = notifyOpts['media-url'] || jumpUrl;
        return this.getCurrentEnv() === 'Quantumult X'
          ? { 'open-url': jumpUrl, 'media-url': previewUrl }
          : { url: jumpUrl, mediaUrl: previewUrl };
      };

      // 调用对应工具的通知API
      switch (this.getCurrentEnv()) {
        case 'Surge':
        case 'Loon':
          $notification.post(title, subtitle, content, formattedOpts());
          break;
        case 'Quantumult X':
          $notify(title, subtitle, content, formattedOpts());
          break;
      }
    }

    // 脚本结束处理（打印运行时间，调用工具的done方法）
    done(result = {}) {
      const runTime = (Date.now() - this.startTime) / 1000;
      console.log(`[${this.scriptName}] 运行结束，耗时：${runTime}秒`);
      if (typeof $done !== 'undefined') $done(result);
    }
  }(scriptName);
}
