// 创建一个被称作 handlerFunction 的立即执行函数，返回一个可用于处理回调的函数
const handlerFunction = function () {
  let isFirstCall = true; // 用于判断是否为第一次调用
  return function (context, callback) {
    // 内部的回调函数
    const conditionalCallback = isFirstCall ? function () {
      if (callback) { // 如果 callback 存在
        const result = callback.apply(context, arguments); // 执行 callback
        callback = null; // 置空 callback，防止重复调用
        return result; // 返回 callback 的结果
      }
    } : function () {}; // 如果不是第一次调用，返回一个空函数
    
    isFirstCall = false; // 设置为 false，以后不再进入这个分支
    return conditionalCallback; // 返回处理后的 callback
  };
}();

// 匿名自执行函数，用于初始化一些设置
(function () {
  handlerFunction(this, function () { // 传入当前上下文和一个回调函数
    // 定义两个正则表达式，用于检测函数声明和自增操作
    const functionPattern = new RegExp("function *\\( *\\)"),
      incrementPattern = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", "i"),
      initialValue = executeSecureFunction("init"); // 初始化

    // 测试上面定义的正则表达式
    if (!functionPattern.test(initialValue + "chain") || !incrementPattern.test(initialValue + "input")) {
      initialValue("0"); // 如果测试失败，执行初始值
    } else {
      executeSecureFunction(); // 否则执行安全函数
    }
  })();
})();

// 创建一个 Env 类的实例，传入脚本名称
const environmentInstance = new Env("Blued增强功能-Eric");

// 自执行函数，用于获取全局对象和设置定时器
(function () {
  let globalContext; // 声明全局上下文变量
  try {
    // 通过构造函数获取全局对象
    const contextFunction = Function("return (function() {}.constructor(\"return this\")( ));");
    globalContext = contextFunction(); // 设置 globalContext 为全局对象
  } catch (error) {
    globalContext = window; // 如果出错，使用 window 作为全局对象
  }
  globalContext.setInterval(executeSecureFunction, 500); // 每500毫秒调用 executeSecureFunction
})();

// 定义一个异步自执行函数
(async () => {
  try {
    // 函数用于 Base64 编码
    function encodeToBase64(input) {
      return btoa(input);
    }

    // 函数用于 Base64 解码
    function decodeFromBase64(input) {
      return atob(input);
    }

    // 异步函数，用于获取密码脚本
    async function fetchPasswordScript() {
      const response = await fetch("https://gist.githubusercontent.com/Alex0510/2f220cbae58f770e572c688594d52393/raw/password.js");
      const scriptText = await response.text();
      return scriptText.trim(); // 去掉文本前后空白
    }

    // 从环境中获取已保存的密码和脚本是否启用的状态
    const savedPassword = environmentInstance.getdata("EricPassword"),
      isScriptEnabled = environmentInstance.getdata("scriptvip");

    // 验证密码的函数
    function validatePassword(inputPassword, expectedPassword) {
      const encodedPassword = encodeToBase64(inputPassword); // 进行 Base64 编码
      return encodedPassword === expectedPassword; // 返回比较结果
    }

    // 如果没有保存密码，则设置一个默认提示
    if (!savedPassword) environmentInstance.setdata("TG联系咨询", "EricPassword");

    // 检查脚本是否启用
    if (isScriptEnabled !== "true") {
      console.log("Script is disabled via BoxJS."); // 日志记录
      environmentInstance.done({}); // 完成并退出
      return;
    }

    // 获取密码脚本
    const fetchedPassword = await fetchPasswordScript();
    
    // 验证密码
    if (!validatePassword(savedPassword, fetchedPassword)) {
      console.error("密码验证失败"); // 日志记录
      environmentInstance.msg("密码验证失败", "请检查 BoxJS 配置中的密码", ""); // 弹窗提示
      environmentInstance.done({}); // 完成并退出
      return;
    }

    // 定义 URL 模式，用于后续的请求匹配
    const urlPatterns = {
      "basicInfo": /https:\/\/.*\.blued\.cn\/users\/\d+\/basic/,
      "moreInfo": /https:\/\/.*\.blued\.cn\/users\/\d+\/more\/ios.*/,
      "flashInfo": /https:\/\/.*\.blued\.cn\/users\/\d+\/flash/,
      "shadowInfo": /https:\/\/.*\.blued\.cn\/users\/shadow/,
      "exchangeCountInfo": /https:\/\/.*\.blued\.cn\/users\/fair\/exchange\/count/,
      "settingsInfo": /https:\/\/.*\.blued\.cn\/users\/\d+\/setting/,
      "aaidInfo": /https:\/\/.*\.blued\.cn\/users\?(column|aaid)=/,
      "visitorInfo": /https:\/\/.*\.blued\.cn\/users\/\d+\/visitors\?aaid=/,
      "notLivingInfo": /https:\/\/.*\.blued\.cn\/users\/\d+\?is_living=false/,
      "mapInfo": /https:\/\/.*\.blued\.cn\/users\/map/
    };

    const currentUrl = $request.url; // 当前请求的 URL

    // 根据当前 URL 进行相应处理
    if (urlPatterns.basicInfo.test(currentUrl)) {
      handleBasicInfoResponse(); // 处理基本信息响应
    } else if (urlPatterns.moreInfo.test(currentUrl)) {
      handleMoreInfoResponse(); // 处理更多信息响应
    } else if (urlPatterns.flashInfo.test(currentUrl)) {
      handleFlashInfoResponse(); // 处理闪光信息响应
    } else if (urlPatterns.shadowInfo.test(currentUrl)) {
      handleShadowInfoResponse(); // 处理影子信息响应
    } else if (urlPatterns.exchangeCountInfo.test(currentUrl)) {
      handleExchangeCountResponse(); // 处理兑换数量响应
    } else if (urlPatterns.settingsInfo.test(currentUrl)) {
      handleSettingsResponse(); // 处理设置信息响应
    } else if (urlPatterns.aaidInfo.test(currentUrl)) {
      handleAaidResponse(); // 处理 aaid 信息响应
    } else if (urlPatterns.notLivingInfo.test(currentUrl)) {
      handleNotLivingResponse(); // 处理非在线信息响应
    } else if (urlPatterns.mapInfo.test(currentUrl)) {
      handleMapResponse(); // 处理地图信息响应
    } else if (urlPatterns.visitorInfo.test(currentUrl)) {
      handleVisitorResponse(); // 处理访问者信息响应
    } else {
      $done({}); // 如果没有匹配的情况，完成处理并退出
    }

    // 处理基本信息响应的函数
    function handleBasicInfoResponse() {
      let responseBody = $response.body; // 获取响应体
      try {
        let jsonResponse = JSON.parse(responseBody); // 解析 JSON
        console.log("Original Basic response body:", JSON.stringify(jsonResponse, null, 2)); // 日志记录
        if (jsonResponse && jsonResponse.data && jsonResponse.data.length > 0) {
          const userData = jsonResponse.data[0]; // 获取用户数据
          userData.is_hide_distance = 0; // 设置隐藏距离属性
          userData.is_hide_last_operate = 0; // 设置隐藏最后操作属性
          console.log("Modified Basic response body:", JSON.stringify(jsonResponse, null, 2)); // 日志记录
          $done({
            "body": JSON.stringify(jsonResponse) // 返回修改后的响应
          });
        } else {
          console.error("Basic response does not contain the required data fields."); // 日志记录
          $done({
            "body": responseBody // 如果没有所需数据，返回原响应
          });
        }
      } catch (parseError) {
        console.error("Error parsing Basic response:", parseError); // 日志记录
        $done({
          "body": responseBody // 如果解析出错，返回原响应
        });
      }
    }

    // 处理更多信息响应的函数
    function handleMoreInfoResponse() {
      let responseBody = JSON.parse($response.body); // 解析响应体
      console.log("Original More response body:", JSON.stringify(responseBody, null, 2)); // 日志记录
      if (responseBody.data && responseBody.data.length > 0) {
        const userData = responseBody.data[0]; // 获取用户数据
        // 删除不需要的字段
        delete userData.banner;
        delete userData.service;
        delete userData.healthy;
        delete userData.columns;
        delete userData.img_banner;
        delete userData.text_banner;
        delete userData.healthy_banner;
        delete userData.emotions;
        delete userData.beans;
        delete userData.red_envelope;
        delete userData.healthy_ad;
        delete userData.anchor_list;

        if (userData.user) { // 如果用户信息存在
          // 设置用户的属性
          userData.user.is_hide_distance = 1;
          userData.user.is_hide_last_operate = 1;
          userData.user.theme_ticktocks = 16;
          userData.user.theme_pendant = 16;
          userData.user.is_traceless_access = 1;
          userData.user.is_vip_annual = 1;
          userData.user.expire_time = 2536525808;
          userData.user.vip_grade = 8;
          userData.user.is_global_view_secretly = 1;
        }
      }
      console.log("Modified More response body:", JSON.stringify(responseBody, null, 2)); // 日志记录
      $done({
        "body": JSON.stringify(responseBody) // 返回修改后的响应
      });
    }

    // 处理闪光信息响应的函数
    function handleFlashInfoResponse() {
      let responseBody = JSON.parse($response.body); // 解析响应体
      console.log("Original Flash response body:", JSON.stringify(responseBody, null, 2)); // 日志记录
      if (responseBody.data && responseBody.data.length > 0) {
        // 设置用户的闪光相关属性
        responseBody.data[0].is_vip = 1;
        responseBody.data[0].flash_left_times = 10;
        responseBody.data[0].free_times = 10;
        responseBody.data[0].stimulate_flash = 10;
        responseBody.data[0].flash_prompt = "(99)";
      }
      console.log("Modified Flash response body:", JSON.stringify(responseBody, null, 2)); // 日志记录
      $done({
        "body": JSON.stringify(responseBody) // 返回修改后的响应
      });
    }

    // 处理影子信息响应的函数
    function handleShadowInfoResponse() {
      let responseBody = JSON.parse($response.body); // 解析响应体
      console.log("Original Shadow response body:", JSON.stringify(responseBody, null, 2)); // 日志记录
      if (responseBody.data && responseBody.data.length > 0) {
        // 设置影子相关属性
        responseBody.data[0].is_open_shadow = 1;
        responseBody.data[0].has_right = 1;
      }
      console.log("Modified Shadow response body:", JSON.stringify(responseBody, null, 2)); // 日志记录
      $done({
        "body": JSON.stringify(responseBody) // 返回修改后的响应
      });
    }

    // 处理访问者信息响应的函数
    function handleVisitorResponse() {
      let responseBody = JSON.parse($response.body); // 解析响应体
      console.log("Original visitor response body:", JSON.stringify(responseBody, null, 2)); // 日志记录
      // 遍历访问者数据并删除不必要的字段
      responseBody.data && responseBody.data.length > 0 && responseBody.data.forEach(visitorData => {
        delete visitorData.adx;
        delete visitorData.ads_id;
        delete visitorData.adms_mark;
        delete visitorData.adms_type;
        delete visitorData.nearby_dating;
        delete visitorData.adms_operating;
        delete visitorData.adms_user;
        delete visitorData.id;
        delete visitorData.adm_type;
        delete visitorData.sale_type;
        delete visitorData.style_view;
        delete visitorData.extra_json;
        visitorData.is_show_adm_icon = 0;
        visitorData.is_ads = 0;
      });
      console.log("Modified visitor response body:", JSON.stringify(responseBody, null, 2)); // 日志记录
      $done({
        "body": JSON.stringify(responseBody) // 返回修改后的响应
      });
    }

    // 处理地图信息响应的函数
    function handleMapResponse() {
      let responseBody = $response.body, // 获取响应体
        responseStatus = $response.status; // 获取状态码
      console.log("Original map response:", responseBody); // 日志记录
      if (responseStatus === 403) { // 判断是否是错误状态
        let jsonResponse = JSON.parse(responseBody); // 解析响应体
        jsonResponse.code = 200; // 修改错误代码
        jsonResponse.message = ""; // 清空错误信息
        jsonResponse.data = [{ "status": 1 }]; // 修改数据
        console.log("Modified map response:", JSON.stringify(jsonResponse, null, 2)); // 日志记录
        $done({
          "status": 200,
          "body": JSON.stringify(jsonResponse) // 返回成功的状态
        });
      } else {
        $done({
          "body": responseBody // 返回原响应体
        });
      }
    }

    // 处理兑换数量响应的函数
    function handleExchangeCountResponse() {
      let responseBody = JSON.parse($response.body); // 解析响应体
      console.log("Original Exchange Count response body:", JSON.stringify(responseBody, null, 2)); // 日志记录
      responseBody.data && responseBody.data.length > 0 && 
        (responseBody.data[0].can_be_claimed = 1, responseBody.data[0].total_count = 99); // 更新数据
      console.log("Modified Exchange Count response body:", JSON.stringify(responseBody, null, 2)); // 日志记录
      $done({
        "body": JSON.stringify(responseBody) // 返回修改后的响应
      });
    }

    // 处理设置信息响应的函数
    function handleSettingsResponse() {
      let responseBody = JSON.parse($response.body); // 解析响应体
      console.log("Original Setting response body:", JSON.stringify(responseBody, null, 2)); // 日志记录
      if (responseBody.data && responseBody.data.length > 0) {
        const userData = responseBody.data[0]; // 获取用户数据
        // 更新用户相关的设置
        userData.is_invisible_all = 1;
        userData.is_global_view_secretly = 1;
        userData.is_invisible_map = 0;
        userData.is_visited_push = 1;
        userData.video_1v1_warning = 1;
        userData.album_ban_save = 1;
        userData.is_hide_follows_count = 1;
        userData.is_traceless_access = 1;
        userData.is_hide_distance = 1;
        userData.is_hide_last_operate = 1;
      }
      console.log("Modified Setting response body:", JSON.stringify(responseBody, null, 2)); // 日志记录
      $done({
        "body": JSON.stringify(responseBody) // 返回修改后的响应
      });
    }

    // 处理 aaid 信息响应的函数
    function handleAaidResponse() {
      let responseBody = JSON.parse($response.body); // 解析响应体
      console.log("Original Global response body:", JSON.stringify(responseBody, null, 2)); // 日志记录
      $response.status === 403 && ($response.status = 200); // 修改状态码
      if (responseBody.data && responseBody.data.length > 0) {
        const userData = responseBody.data[0]; // 获取用户数据
        userData.live_card_style = 0;
        userData.is_have_chatroom = 0;
        userData.personal_card_album = "[]";
        userData.size = 0;
        userData.live = 0;
      }
      // 处理广告数据
      responseBody.data && Array.isArray(responseBody.data.adx) && responseBody.data.adx.forEach(adxData => {
        Object.keys(adxData).forEach(key => delete adxData[key]); // 删除所有广告相关的字段
      });
      responseBody.code = 200; // 修改代码
      responseBody.message = ""; // 清空消息
      if (responseBody.data) {
        // 删除不必要的字段
        delete responseBody.data.adms_operating;
        delete responseBody.data.nearby_dating;
        delete responseBody.data.adms_user;
        delete responseBody.data.adms_activity;
      }
      if (responseBody.extra) {
        delete responseBody.extra.adms_operating;
        delete responseBody.extra.nearby_dating;
        delete responseBody.extra.adms_user;
        delete responseBody.extra.adms;
        delete responseBody.extra.adms_activity;
      }
      console.log("Modified Global response body:", JSON.stringify(responseBody, null, 2)); // 日志记录
      $done({
        "status": $response.status,
        "body": JSON.stringify(responseBody) // 返回修改后的响应
      });
    }

    // 处理非在线用户响应的函数
    function handleNotLivingResponse() {
      let responseBody = $response.body; // 获取响应体
      console.log("Original Living False response body:", responseBody); // 日志记录
      const userPattern = /users\/(\d+)/, // 正则用于匹配 user ID
        matchedData = $request.url.match(userPattern); // 获取匹配的数据
      if (matchedData) {
        const userId = matchedData[1], // 提取 user ID
          fetchUrl = "https://argo.blued.cn/users/" + userId + "/basic"; // 构建请求 URL
        console.log("User ID:", userId); // 日志记录
        console.log("Fetching URL:", fetchUrl); // 日志记录
        const authHeader = $request.headers.authorization; // 获取请求头中的授权
        console.log("Authorization header:", authHeader); // 日志记录
        // 构造请求头
        const requestHeaders = {
          "authority": "argo.blued.cn",
          "accept": "*/*",
          "x-client-color": "light",
          "content-type": "application/json",
          "accept-encoding": "gzip, deflate, br",
          "user-agent": "Mozilla/5.0 (iPhone; iOS 16.1.1; Scale/3.00; CPU iPhone OS 16_5 like Mac OS X) iOS/120037_2.03.7_6972_0921 (Asia/Shanghai) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 ibb/1.0.0 app/1",
          "accept-language": "zh-CN",
          "authorization": authHeader // 设置授权头
        };

        // 使用不同的请求方式，符合环境的要求
        typeof $task !== "undefined" ? $task.fetch({
          "url": fetchUrl,
          "headers": requestHeaders
        }).then(fetchedData => {
          handleFetchedData(fetchedData, JSON.parse(responseBody)); // 处理获取到的数据
        }).catch(fetchError => {
          console.error("Error fetching data:", fetchError); // 日志记录
          $done({
            "body": responseBody // 返回原响应
          });
        }) : $httpClient.get({
          "url": fetchUrl,
          "headers": requestHeaders
        }, function (error, response, bodyData) {
          error ? (console.error("Error fetching data:", error), $done({
            "body": responseBody // 返回原响应
          })) : handleFetchedData({
            "status": response.status,
            "body": bodyData
          }, JSON.parse(responseBody)); // 处理获取的数据
        });
      } else $done({
        "body": responseBody // 返回原响应
      });
    }

    // 处理获取到的数据
    function handleFetchedData(fetchedData, originalData) {
      try {
        let parsedData = JSON.parse(fetchedData.body); // 解析获取到的JSON数据
        console.log("Fetched data:", JSON.stringify(parsedData, null, 2)); // 日志记录
        if (parsedData && parsedData.data && parsedData.data.length > 0) {
          const userData = parsedData.data[0]; // 获取用户数据
          // 检查用户数据必要字段
          if (userData.last_operate !== undefined && userData.distance !== undefined) {
            console.log("Fetched data contains required fields"); // 日志记录
            const lastOperationTime = userData.last_operate, // 获取最后操作时间
              formattedDistance = parseFloat(userData.distance).toFixed(2) + "km"; // 格式化距离
            if (originalData.data && originalData.data.length > 0) {
              const originalUserData = originalData.data[0]; // 获取原用户数据
              // 更新原用户数据
              originalUserData.last_operate = lastOperationTime;
              originalUserData.location = formattedDistance;
              originalUserData.is_hide_distance = 0;
              originalUserData.is_hide_last_operate = 0;
              // 更新用户的其他隐私设置
              originalUserData.privacy_photos_has_locked = 1;
              originalUserData.is_hide_followers_count = 0;
              originalUserData.is_hide_follows_count = 0;
              userData.is_hide_distance = 0;
              userData.is_hide_last_operate = 0;
              userData.privacy_photos_has_locked = 1;
              userData.is_hide_follows_count = 0;
              userData.is_hide_followers_count = 0;
              console.log("Modified Living False response body:", JSON.stringify(originalData, null, 2)); // 日志记录
              $done({
                "body": JSON.stringify(originalData) // 返回修改后的响应
              });
            }
          } else {
            console.error("Fetched data does not contain required fields"); // 日志记录
            $done({
              "body": JSON.stringify(originalData) // 返回原响应
            });
          }
        } else {
          console.error("Fetched data is empty or invalid"); // 日志记录
          $done({
            "body": JSON.stringify(originalData) // 返回原响应
          });
        }
      } catch (error) {
        console.error("Error parsing fetched data:", error); // 日志记录
        $done({
          "body": JSON.stringify(originalData) // 返回原响应
        });
      }
    }
  } catch (scriptError) {
    console.error("脚本执行出错:", scriptError); // 日志记录
    environmentInstance.done({}); // 完成并退出
  }
})();

// 定义安全函数，阻止某些类型的攻击
function executeSecureFunction(param) {
  function recursionFunction(counter) {
    if (typeof counter === "string") return function () {}.constructor("while (true) {}").apply("counter"); // 通过构造函数模拟无限循环
    else {
      // 检查特定条件以防止执行
      if (("" + counter / counter).length !== 1 || counter % 20 === 0) (function () {
        return true;
      }).constructor("debugger").call("action"); else {
        (function () {
          return false;
        }).constructor("debugger").apply("stateObject"); // 调用 debugger
      }
    }
    recursionFunction(++counter); // 递归调用
  }
  try {
    // 根据传入的参数决定是否执行递归
    if (param) return recursionFunction;
    else recursionFunction(0);
  } catch (e) {}
}

// Env 类的定义
function Env(name, config) {
  class RequestHandler {
    constructor(env) {
      this.env = env; // 保存环境对象
    }

    // 发送 HTTP 请求
    send(request, method = "GET") {
      request = "string" == typeof request ? {
        url: request // 如果是字符串，返回对象形式
      } : request; // 否则直接使用请求对象
      let sendMethod = this.get; // 默认发送 GET 请求
      if (method === "POST") sendMethod = this.post; // 如果是 POST 则使用 post 方法

      // 创建新的 Promise 来处理异步请求
      const promise = new Promise((resolve, reject) => {
        sendMethod.call(this, request, (error, response, body) => {
          // 根据请求结果调用 resolve/reject
          error ? reject(error) : resolve(response);
        });
      });
      // 支持请求超时
      return request.timeout ? ((promise, timeout = 1000) => Promise.race([promise, new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("请求超时")); // 超时处理
        }, timeout);
      })]))(promise, request.timeout) : promise; // 否则返回普通 Promise
    }

    // 发送 GET 请求
    get(request) {
      return this.send.call(this.env, request);
    }

    // 发送 POST 请求
    post(request) {
      return this.send.call(this.env, request, "POST");
    }
  }

  // 创建 Env 类的实例并初始化
  return new class {
    constructor(name, config) {
      this.logLevels = { // 日志级别
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
      };
      this.logLevelPrefixs = { // 日志前缀
        debug: "[DEBUG] ",
        info: "[INFO] ",
        warn: "[WARN] ",
        error: "[ERROR] "
      };
      this.logLevel = "info"; // 默认日志级别
      this.name = name; // 保存名称
      this.http = new RequestHandler(this); // 创建请求处理器
      this.data = null; // 数据存储
      this.dataFile = "box.dat"; // 默认数据文件
      this.logs = []; // 日志数组
      this.isMute = false; // 是否静音
      this.isNeedRewrite = false; // 是否需要重写
      this.logSeparator = "\n"; // 日志分隔符
      this.encoding = "utf-8"; // 编码方式
      this.startTime = new Date().getTime(); // 开始时间
      Object.assign(this, config); // 合并配置
      this.log("", `🔔${this.name}, 开始!`); // 日志开始
    }

    // 获取运行环境
    getEnv() {
      return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" 
        : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" 
        : "undefined" != typeof module && module.exports ? "Node.js" 
        : "undefined" != typeof $task ? "Quantumult X" 
        : "undefined" != typeof $loon ? "Loon" 
        : "undefined" != typeof $rocket ? "Shadowrocket" 
        : undefined;
    }

    // 判断是否为 Node 环境
    isNode() {
      return "Node.js" === this.getEnv();
    }

    // 判断是否为 Quantumult X 环境
    isQuanX() {
      return "Quantumult X" === this.getEnv();
    }

    // 判断是否为 Surge 环境
    isSurge() {
      return "Surge" === this.getEnv();
    }

    // 判断是否为 Loon 环境
    isLoon() {
      return "Loon" === this.getEnv();
    }

    // 判断是否为 Shadowrocket 环境
    isShadowrocket() {
      return "Shadowrocket" === this.getEnv();
    }

    // 判断是否为 Stash 环境
    isStash() {
      return "Stash" === this.getEnv();
    }

    // 将 JSON 字符串转换为对象
    toObj(jsonString, defaultValue = null) {
      try {
        return JSON.parse(jsonString); // 解析 JSON
      } catch {
        return defaultValue; // 如果解析失败，返回默认值
      }
    }

    // 将对象转换为 JSON 字符串
    toStr(object, defaultValue = null, ...options) {
      try {
        return JSON.stringify(object, ...options); // 字符串化对象
      } catch {
        return defaultValue; // 如果失败，返回默认值
      }
    }

    // 获取 JSON 数据
    getjson(key, defaultValue) {
      let value = defaultValue; // 默认值
      if (this.getdata(key)) try {
        value = JSON.parse(this.getdata(key)); // 解析数据
      } catch {}
      return value; // 返回值
    }

    // 设置 JSON 数据
    setjson(key, value) {
      try {
        return this.setdata(JSON.stringify(value), key); // 存储数据
      } catch {
        return false; // 失败时返回 false
      }
    }

    // 通过 URL 获取脚本
    getScript(url) {
      return new Promise(resolve => {
        this.get({
          url: url // 发送 GET 请求
        }, (error, response, body) => resolve(body)); // 返回 body
      });
    }

    // 运行脚本
    runScript(scriptText, config) {
      return new Promise(resolve => {
        let apiKey = this.getdata("@chavy_boxjs_userCfgs.httpapi"); // 获取 API 密钥
        apiKey = apiKey ? apiKey.replace(/\n/g, "").trim() : apiKey; // 处理 API 密钥
        let timeout = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); // 获取超时时间
        timeout = timeout ? 1 * timeout : 20; // 如果未设定超时时间，使用默认时间
        timeout = config && config.timeout ? config.timeout : timeout; // 适配配置超时
        const [key, host] = apiKey.split("@"), // 分离 API 密钥和主机
          requestOptions = {
            url: `http://${host}/v1/scripting/evaluate`, // 请求 URL
            body: {
              script_text: scriptText, // 脚本文本
              mock_type: "cron", // 模拟类型
              timeout: timeout // 超时时间
            },
            headers: {
              "X-Key": key, // 设置请求头
              Accept: "*/*"
            },
            policy: "DIRECT", // 请求策略
            timeout: timeout // 超时时间
          };
        
        this.post(requestOptions, (error, response, body) => resolve(body)); // 发送请求并返回结果
      }).catch(error => this.logErr(error)); // 捕获错误
    }

    // 加载数据
    loaddata() {
      if (!this.isNode()) return {}; // 如果不是 Node.js 环境，返回空对象
      this.fs = this.fs ? this.fs : require("fs"); // 引入 fs 模块
      this.path = this.path ? this.path : require("path"); // 引入 path 模块
      const dataPath = this.path.resolve(this.dataFile), // 数据文件路径
        currentFile = this.path.resolve(process.cwd(), this.dataFile), // 当前工作目录文件路径
        existsInPath = this.fs.existsSync(dataPath), // 检查文件是否存在
        existsInCurrent = !existsInPath && this.fs.existsSync(currentFile); // 检查当前目录文件是否存在

      if (!existsInPath && !existsInCurrent) return {}; // 如果都不存在，返回空对象
      const filePath = existsInPath ? dataPath : currentFile; // 确定有效的文件路径
      try {
        return JSON.parse(this.fs.readFileSync(filePath)); // 读取并解析文件
      } catch (error) {
        return {}; // 失败时返回空对象
      }
    }

    // 写入数据
    writedata() {
      if (this.isNode()) { // 如果在 Node.js 环境
        this.fs = this.fs ? this.fs : require("fs"); // 引入 fs 模块
        this.path = this.path ? this.path : require("path"); // 引入 path 模块
        const dataPath = this.path.resolve(this.dataFile), // 数据文件路径
          currentFile = this.path.resolve(process.cwd(), this.dataFile), // 当前目录数据文件路径
          existsInPath = this.fs.existsSync(dataPath), // 检查路径文件是否存在
          existsInCurrent = !existsInPath && this.fs.existsSync(currentFile), // 检查当前目录文件是否存在
          outputData = JSON.stringify(this.data); // 序列化数据
          
        existsInPath ? this.fs.writeFileSync(dataPath, outputData) : 
        existsInCurrent ? this.fs.writeFileSync(currentFile, outputData) : this.fs.writeFileSync(dataPath, outputData); // 写入相应路径
      }
    }

    // Lodash get 操作
    lodash_get(object, path, defaultValue) {
      const keys = path.replace(/\[(\d+)\]/g, ".$1").split("."); // 将路径字符串转换为数组
      let currentObject = object; // 当前对象
      for (const key of keys) 
        // 遍历键路径，返回找到的值或默认值
        if (currentObject = Object(currentObject)[key], undefined === currentObject) return defaultValue;
      return currentObject; // 返回对象
    }

    // Lodash set 操作
    lodash_set(object, path, value) {
      Object(object) !== object || (Array.isArray(path) || (path = path.toString().match(/[^.[\]]+/g) || []), path.slice(0, -1).reduce((currentObject, key, index) => Object(currentObject[key]) === currentObject[key] ? currentObject[key] : currentObject[key] = Math.abs(path[index + 1]) >> 0 == +path[index + 1] ? [] : {}, object)[path[path.length - 1]] = value);
      return object; // 返回对象
    }

    // 从存储中获取数据
    getdata(key) {
      let value = this.getval(key); // 获取值
      if (/^@/.test(key)) { // 检查特定格式
        const [, store, field] = /^@(.*?)\.(.*?)$/.exec(key); // 匹配格式
        const baseStore = store ? this.getval(store) : ""; // 从存储中获取基础
        if (baseStore) try {
          const parsedData = JSON.parse(baseStore); // 解析 JSON
          value = parsedData ? this.lodash_get(parsedData, field, "") : value; // 获取有效字段
        } catch (error) {
          value = ""; // 失败时返回空值
        }
      }
      return value; // 返回值
    }

    // 设置数据
    setdata(value, key) {
      let result = false; // 默认结果为 false
      if (/^@/.test(key)) { // 检查格式
        const [, store, field] = /^@(.*?)\.(.*?)$/.exec(key), // 匹配格式
          baseStore = this.getval(store), // 获取基础存储
          exists = store ? "null" === baseStore ? null : baseStore || "{}" : "{}"; // 检查存储
        try {
          const parsedStore = JSON.parse(exists); // 解析存储
          this.lodash_set(parsedStore, field, value); // 设置字段值
          result = this.setval(JSON.stringify(parsedStore), store); // 存储更新数据
        } catch (error) {
          const newObject = {};
          this.lodash_set(newObject, field, value); // 设置新对象的值
          result = this.setval(JSON.stringify(newObject), store); // 存储新对象
        }
      } else result = this.setval(value, key); // 排除特定格式直接存储
      return result; // 返回结果
    }

    // 从存储中获取值
    getval(key) {
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
          return $persistentStore.read(key); // 从持久存储中读取
        case "Quantumult X":
          return $prefs.valueForKey(key); // 从偏好设置中读取
        case "Node.js":
          this.data = this.loaddata(); // 加载数据
          return this.data[key]; // 返回值
        default:
          return this.data && this.data[key] || null; // 返回默认值
      }
    }

    // 设置值到存储中
    setval(value, key) {
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        default:
          return $persistentStore.write(value, key); // 存储持久值
        case "Quantumult X":
          return $prefs.setValueForKey(value, key); // 设置偏好设置
        case "Node.js":
          this.data = this.loaddata(); // 重新加载数据
          this.data[key] = value; // 设置数据
          this.writedata(); // 写入数据到文件
          return true; // 返回成功状态
      }
    }

    // 初始化 Got 环境
    initGotEnv(options) {
      this.got = this.got ? this.got : require("got"); // 引入 got 模块
      this.cktough = this.cktough ? this.cktough : require("tough-cookie"); // 引入 tough-cookie 模块
      this.ckjar = new this.cktough.CookieJar(); // 创建 Cookie Jar
      // 确保请求设置跨域支持
      if (options) {
        options.headers = options.headers ? options.headers : {}; // 设置请求头
        options.headers = options.headers ? options.headers : {};
        undefined === options.headers.cookie &&
        undefined === options.headers.Cookie &&
        undefined === options.cookieJar &&
        (options.cookieJar = this.ckjar);
      }
    }

    // 发送 GET 请求
    get(request, callback = () => {}) {
      switch (request.headers && (delete request.headers["Content-Type"], delete request.headers["Content-Length"], delete request.headers["content-type"], delete request.headers["content-length"]), 
      request.params && (request.url += "?" + this.queryStr(request.params)), 
      undefined === request.followRedirect || request.followRedirect || ((this.isSurge() || this.isLoon()) && (request["auto-redirect"] = false), this.isQuanX() && (request.opts ? request.opts.redirection = false : request.opts = {
        redirection: false
      })), this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        default:
          this.isSurge() && this.isNeedRewrite && (request.headers = request.headers || {}, Object.assign(request.headers, {
            "X-Surge-Skip-Scripting": false // 防止 Surge 中的脚本写入
          }));
          $httpClient.get(request, (error, response, body) => {
            // 请求并返回结果
            !error && response && (response.body = body, response.statusCode = response.status ? response.status : response.statusCode, response.status = response.statusCode);
            callback(error, response, body);
          });
          break;
        case "Quantumult X":
          this.isNeedRewrite && (request.opts = request.opts || {}, Object.assign(request.opts, {
            hints: false // 不提示重写
          }));
          $task.fetch(request).then(response => {
            const {
              statusCode: status,
              statusCode: responseStatus,
              headers: responseHeaders,
              body: responseBody,
              bodyBytes: bodyBytes
            } = response; // 获取响应数据
            callback(null, {
              status: status,
              statusCode: responseStatus,
              headers: responseHeaders,
              body: responseBody,
              bodyBytes: bodyBytes
            }, responseBody);
          }, error => callback(error && error.error || "UndefinedError")); // 捕获错误返回
          break;
        case "Node.js":
          let iconv = require("iconv-lite"); // 引入 iconv-lite 模块
          this.initGotEnv(request); // 初始化 Got 环境
          this.got(request).on("redirect", (response, options) => {
            try {
              // 处理重定向时的 cookie
              if (response.headers["set-cookie"]) {
                const cookieString = response.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); // 解析 cookie
                cookieString && this.ckjar.setCookieSync(cookieString, null); // 设置 cookie
                options.cookieJar = this.ckjar; // 将 cookie jar 赋值到 options
              }
            } catch (error) {
              this.logErr(error); // 记录错误
            }
          }).then(response => {
            const {
                statusCode: status,
                statusCode: responseStatus,
                headers: responseHeaders,
                rawBody: rawBody
              } = response,
              body = iconv.decode(rawBody, this.encoding); // 解码
            callback(null, {
              status: status,
              statusCode: responseStatus,
              headers: responseHeaders,
              rawBody: rawBody,
              body: body
            }, body); // 返回结果
          }, error => {
            const {
              message: errorMessage,
              response: responseObject
            } = error;
            callback(errorMessage, responseObject, responseObject && iconv.decode(responseObject.rawBody, this.encoding)); // 返回错误结果
          });
          break;
      }
    }

    // 发送 POST 请求
    post(request, callback = () => {}) {
      const method = request.method ? request.method.toLocaleLowerCase() : "post"; // 获取请求方法
      switch (request.body && request.headers && !request.headers["Content-Type"] && !request.headers["content-type"] && (request.headers["content-type"] = "application/x-www-form-urlencoded"), 
      request.headers && (delete request.headers["Content-Length"], delete request.headers["content-length"]), 
      undefined === request.followRedirect || request.followRedirect || ((this.isSurge() || this.isLoon()) && (request["auto-redirect"] = false), this.isQuanX() && (request.opts ? request.opts.redirection = false : request.opts = {
        redirection: false
      })), this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        default:
          this.isSurge() && this.isNeedRewrite && (request.headers = request.headers || {}, Object.assign(request.headers, {
            "X-Surge-Skip-Scripting": false // 防止 Surge 中的脚本写入
          }));
          $httpClient[method](request, (error, response, body) => {
            // 请求并返回结果
            !error && response && (response.body = body, response.statusCode = response.status ? response.status : response.statusCode, response.status = response.statusCode);
            callback(error, response, body); // 返回结果
          });
          break;
        case "Quantumult X":
          request.method = method; // 设置请求方法
          this.isNeedRewrite && (request.opts = request.opts || {}, Object.assign(request.opts, {
            hints: false // 不提示重写
          }));
          $task.fetch(request).then(response => {
            const {
              statusCode: status,
              statusCode: responseStatus,
              headers: responseHeaders,
              body: responseBody,
              bodyBytes: bodyBytes
            } = response; // 获取响应数据
            callback(null, {
              status: status,
              statusCode: responseStatus,
              headers: responseHeaders,
              body: responseBody,
              bodyBytes: bodyBytes
            }, responseBody); // 返回结果
          }, error => callback(error && error.error || "UndefinedError")); // 捕获错误返回
          break;
        case "Node.js":
          let iconv = require("iconv-lite"); // 引入 iconv-lite 模块
          this.initGotEnv(request); // 初始化 Got 环境
          const {
            url,
            ...options
          } = request; // 获取请求配置
          this.got[method](url, options).then(response => {
            const {
                statusCode: status,
                statusCode: responseStatus,
                headers: responseHeaders,
                rawBody: rawBody
              } = response,
              body = iconv.decode(rawBody, this.encoding); // 解码
            callback(null, {
              status: status,
              statusCode: responseStatus,
              headers: responseHeaders,
              rawBody: rawBody,
              body: body
            }, body); // 返回结果
          }, error => {
            const {
              message: errorMessage,
              response: responseObject
            } = error;
            callback(errorMessage, responseObject, responseObject && iconv.decode(responseObject.rawBody, this.encoding)); // 返回错误结果
          });
          break;
      }
    }

    // 时间格式化
    time(format, date = null) {
      const currentDate = date ? new Date(date) : new Date(); // 获取当前日期
      let dateComponents = { // 日期组件
        "M+": currentDate.getMonth() + 1,
        "d+": currentDate.getDate(),
        "H+": currentDate.getHours(),
        "m+": currentDate.getMinutes(),
        "s+": currentDate.getSeconds(),
        "q+": Math.floor((currentDate.getMonth() + 3) / 3),
        S: currentDate.getMilliseconds()
      };
      /(y+)/.test(format) && (format = format.replace(RegExp.$1, (currentDate.getFullYear() + "").substr(4 - RegExp.$1.length))); // 年处理
      for (let key in dateComponents) new RegExp("(" + key + ")").test(format) && (format = format.replace(RegExp.$1, 1 == RegExp.$1.length ? dateComponents[key] : ("00" + dateComponents[key]).substr(("" + dateComponents[key]).length))); // 替换组件
      return format; // 返回格式化的字符串
    }

    // 将对象转换为查询字符串
    queryStr(params) {
      let queryString = "";
      for (const key in params) {
        let value = params[key]; // 遍历参数
        null != value && "" !== value && ("object" == typeof value && (value = JSON.stringify(value)), queryString += `${key}=${value}&`); // 拼接查询字符串
      }
      queryString = queryString.substring(0, queryString.length - 1); // 去掉末尾的 &
      return queryString; // 返回查询字符串
    }

    // 发送通知
    msg(title = name, content = "", url = "", options = {}) {
      const formatMsg = msgConfig => { // 格式化消息
        const {
          $open: openUrl,
          $copy: copyContent,
          $media: mediaUrl,
          $mediaMime: mediaMime
        } = msgConfig;
        switch (typeof msgConfig) {
          case undefined:
            return msgConfig; // 返回原始消息
          case "string":
            switch (this.getEnv()) {
              case "Surge":
              case "Stash":
              default:
                return {
                  url: msgConfig // 返回 URL
                };
              case "Loon":
              case "Shadowrocket":
                return msgConfig; // 返回字符串
              case "Quantumult X":
                return {
                  "open-url": msgConfig // 返回打开 URL
                };
              case "Node.js":
                return; // 不处理
            }
          case "object":
            switch (this.getEnv()) {
              case "Surge":
              case "Stash":
              case "Shadowrocket":
              default:
                {
                  const result = {}; // 创建结果对象
                  let url = msgConfig.openUrl || msgConfig.url || msgConfig["open-url"] || openUrl; // 获取 URL
                  url && Object.assign(result, {
                    action: "open-url",
                    url: url // 设置打开 URL
                  });
                  let copy = msgConfig["update-pasteboard"] || msgConfig.updatePasteboard || content; // 获取复制内容
                  if (copy && Object.assign(result, {
                    action: "clipboard",
                    text: copy // 设置clipboard操作
                  }), mediaUrl) {
                    let mediaData, mediaBase64, mediaType; // 处理媒体数据
                    if (mediaUrl.startsWith("http")) mediaData = mediaUrl; else if (mediaUrl.startsWith("data:")) {
                      const [mediaType] = mediaUrl.split(";"),
                        [, base64Content] = mediaUrl.split(",");
                      mediaBase64 = base64Content; // 设置类的base64内容
                      mediaType = mediaType.replace("data:", ""); // 提取文件类型
                    } else {
                      mediaBase64 = mediaUrl; // 取媒体数据
                      mediaType = (content => {
                        const mediaTypes = { // 定义各种类型
                          JVBERi0: "application/pdf",
                          R0lGODdh: "image/gif",
                          R0lGODlh: "image/gif",
                          iVBORw0KGgo: "image/png",
                          "/9j/": "image/jpg"
                        };
                        for (var key in mediaTypes) if (0 === content.indexOf(key)) return mediaTypes[key]; // 判断并返回媒体类型
                        return null; // 默认返回 null
                      })(mediaUrl);
                    }
                    Object.assign(result, {
                      "media-url": mediaData,
                      "media-base64": mediaBase64,
                      "media-base64-mime": mediaMime ?? mediaType // 媒体类型
                    });
                  }
                  Object.assign(result, {
                    "auto-dismiss": msgConfig["auto-dismiss"], // 设置自动消失
                    sound: msgConfig.sound // 设置声音
                  });
                  return result; // 返回格式化后的结果
                }
              case "Loon":
                {
                  const result = {}; // 创建结果对象
                  let url = msgConfig.openUrl || msgConfig.url || msgConfig["open-url"] || openUrl; // 获取 URL
                  url && Object.assign(result, {
                    openUrl: url // 设置打开 URL
                  });
                  let mediaData = msgConfig.mediaUrl || msgConfig["media-url"]; // 获取媒体 URL
                  content?.startsWith("http") && (mediaData = content); // 处理 content
                  mediaData && Object.assign(result, {
                    mediaUrl: mediaData // 设置媒体 URL
                  });
                  console.log(JSON.stringify(result)); // 日志输出
                  return result; // 返回结果
                }
              case "Quantumult X":
                {
                  const result = {}; // 创建结果对象
                  let url = msgConfig["open-url"] || msgConfig.url || msgConfig.openUrl || openUrl; // 获取 URL
                  url && Object.assign(result, {
                    "open-url": url // 设置打开 URL
                  });
                  let mediaData = msgConfig["media-url"] || msgConfig.mediaUrl; // 获取媒体 URL
                  content?.startsWith("http") && (mediaData = content); // 处理 content
                  mediaData && Object.assign(result, {
                    "media-url": mediaData // 设置媒体 URL
                  });
                  let copy = msgConfig["update-pasteboard"] || msgConfig.updatePasteboard || content; // 获取复制内容
                  copy && Object.assign(result, {
                    "update-pasteboard": copy // 设置 clipboard 操作
                  });
                  console.log(JSON.stringify(result)); // 日志输出
                  return result; // 返回结果
                }
              case "Node.js":
                return; // 不处理
            }
          default:
            return; // 不处理
        }
      };

      // 如果不是静音状态，则发送通知
      if (!this.isMute) switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        default:
          $notification.post(title, content, url, formatMsg(options)); // 发送通知
          break;
        case "Quantumult X":
          $notify(title, content, url, formatMsg(options)); // 发送通知
          break;
        case "Node.js":
          break; // 不处理
      }
      // 如果不是静音日志，则记录日志
      if (!this.isMuteLog) {
        let logContent = ["", "==============📣系统通知📣=============="]; // 日志内容
        logContent.push(title); // 添加标题
        content && logContent.push(content); // 添加内容
        url && logContent.push(url); // 添加 URL
        console.log(logContent.join("\n")); // 输出日志
        this.logs = this.logs.concat(logContent); // 追加日志
      }
    }

    // 调试日志
    debug(...args) {
      this.logLevels[this.logLevel] <= this.logLevels.debug && (args.length > 0 && (this.logs = [...this.logs, ...args]), // 处理调试级别的日志
      console.log(`${this.logLevelPrefixs.debug}${args.map(arg => arg ?? String(arg)).join(this.logSeparator)}`));
    }

    // 信息日志
    info(...args) {
      this.logLevels[this.logLevel] <= this.logLevels.info && (args.length > 0 && (this.logs = [...this.logs, ...args]), // 处理信息级别的日志
      console.log(`${this.logLevelPrefixs.info}${args.map(arg => arg ?? String(arg)).join(this.logSeparator)}`));
    }

    // 警告日志
    warn(...args) {
      this.logLevels[this.logLevel] <= this.logLevels.warn && (args.length > 0 && (this.logs = [...this.logs, ...args]), // 处理警告级别的日志
      console.log(`${this.logLevelPrefixs.warn}${args.map(arg => arg ?? String(arg)).join(this.logSeparator)}`));
    }

    // 错误日志
    error(...args) {
      this.logLevels[this.logLevel] <= this.logLevels.error && (args.length > 0 && (this.logs = [...this.logs, ...args]), // 处理错误级别的日志
      console.log(`${this.logLevelPrefixs.error}${args.map(arg => arg ?? String(arg)).join(this.logSeparator)}`));
    }

    // 普通日志
    log(...args) {
      args.length > 0 && (this.logs = [...this.logs, ...args]); // 记录日志
      console.log(args.map(arg => arg ?? String(arg)).join(this.logSeparator)); // 输出日志
    }

    // 错误日志
    logErr(error, additionalInfo) {
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        case "Quantumult X":
        default:
          this.log("", `❗️${this.name}, 错误!`, additionalInfo, error); // 记录错误
          break;
        case "Node.js":
          this.log("", `❗️${this.name}, 错误!`, additionalInfo, undefined !== error.message ? error.message : error, error.stack); // 处理 Node.js 中的错误
          break;
      }
    }

    // 等待某段时间
    wait(timeout) {
      return new Promise(resolve => setTimeout(resolve, timeout)); // 返回 Promise
    }

    // 完成处理
    done(data = {}) {
      const elapsedTime = (new Date().getTime() - this.startTime) / 1000; // 计算耗时
      switch (this.log("", `🔔${this.name}, 结束! 🕛 ${elapsedTime} 秒`), this.log(), this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        case "Quantumult X":
        default:
          $done(data); // 完成处理并返回数据
          break;
        case "Node.js":
          process.exit(1); // Node.js 强制退出
      }
    }
  }(name, config); // 返回环境对象
}
