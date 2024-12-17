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

// Env 类定义只保留 Surge 和 Loon 环境的部分
function Env(name) {
  return new class {
    constructor(name) {
      this.name = name; // 保存名称
      this.logs = []; // 日志数组
      this.isMute = false; // 是否静音
      this.isNeedRewrite = false; // 是否需要重写
    }

    // 获取运行环境
    getEnv() {
      return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" 
        : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" 
        : "undefined" != typeof $loon ? "Loon" 
        : undefined;
    }

    // 判断是否为 Surge 环境
    isSurge() {
      return "Surge" === this.getEnv();
    }

    // 判断是否为 Loon 环境
    isLoon() {
      return "Loon" === this.getEnv();
    }

    // 发送 HTTP 请求
    send(request, method = "GET", callback = () => {}) {
      if (this.isSurge() || this.isLoon()) {
        $httpClient[method.toLowerCase()](request, callback);
      }
    }

    // 发送 GET 请求
    get(request, callback) {
      this.send(request, "GET", callback);
    }

    // 发送 POST 请求
    post(request, callback) {
      this.send(request, "POST", callback);
    }

    // 完成处理
    done(data = {}) {
      const elapsedTime = (new Date().getTime() - this.startTime) / 1000; // 计算耗时
      this.log("", `🔔${this.name}, 结束! 🕛 ${elapsedTime} 秒`);
      if (this.isSurge() || this.isLoon()) {
        $done(data);
      }
    }

    // 日志
    log(...args) {
      if (!this.isMute) {
        console.log(...args);
      }
      this.logs = this.logs.concat(args);
    }

    // 错误日志
    logErr(error) {
      this.log("", `❗️${this.name}, 错误!`, error);
    }
  }(name);
}
