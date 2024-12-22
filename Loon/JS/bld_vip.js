// 创建一个 Env 类的实例，传入脚本名称
const environmentInstance = new Env("Blued增强功能-Eric");

// 定义需要跳过的URL
const skipUrls = [
  "https://social.blued.cn/users/58081339/flash"
];

// 确保兼容性
function getHttpClient() {
  return typeof $httpClient !== "undefined" ? $httpClient : 
         typeof $task !== "undefined" ? $task : 
         console.error("No HTTP client available");
}

function sendRequest(request, method, callback) {
  const client = getHttpClient();
  if (client) {
    client[method.toLowerCase()](request, callback);
  } else {
    console.error("Failed to send request due to unsupported environment");
  }
}

// 异步自执行函数：处理请求和响应
(async () => {
  try {
    // 定义 URL 模式匹配的正则表达式，使用 Map 替代 Object
    const urlPatterns = new Map([
      ["basicInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\/basic/],
      ["moreInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\/more\/ios.*/],
      ["flashInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\/flash/],
      ["shadowInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/shadow/],
      ["settingsInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\/setting/],
      ["aaidInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\?(column|aaid)=/],
      ["notLivingInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\?is_living=false/],
      ["mapInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/map/],
      ["visitorInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\/visitors\?aaid=/]
    ]);

    // 获取当前请求的 URL
    const currentUrl = $request.url;

    // 如果当前 URL 匹配需要跳过的 URL，则直接返回
    if (skipUrls.includes(currentUrl)) {
      return $done({ "body": $response.body });
    }

    // 定义处理函数映射，使用 Map 替代 Object
    const handlerMap = new Map([
      ["basicInfo", handleBasicInfoResponse],
      ["moreInfo", handleMoreInfoResponse],
      ["flashInfo", handleFlashInfoResponse],
      ["shadowInfo", handleShadowInfoResponse],
      ["settingsInfo", handleSettingsResponse],
      ["aaidInfo", handleAaidResponse],
      ["notLivingInfo", handleNotLivingResponse],
      ["mapInfo", handleMapResponse],
      ["visitorInfo", handleVisitorResponse]
    ]);

    // 解析响应体
    const responseBody = JSON.parse($response.body);

    // 遍历 URL 模式，找到匹配的模式并执行相应的处理函数
    for (const [key, pattern] of urlPatterns) {
      if (pattern.test(currentUrl)) {
        await handlerMap.get(key)(responseBody);
        return;
      }
    }

    // 如果没有匹配的 URL 模式，直接返回
    $done({ "body": JSON.stringify(responseBody) });
  } catch (scriptError) {
    handleError(scriptError, {});
  }
})();

// 通用错误处理函数
function handleError(error, data) {
  console.error("脚本执行出错:", error);
  environmentInstance.done(data);
}

// 处理基本信息响应
function handleBasicInfoResponse(responseBody) {
  try {
    if (responseBody.data && responseBody.data.length > 0) {
      $done({ "body": JSON.stringify(responseBody) });
    } else {
      $done({ "body": JSON.stringify(responseBody) });
    }
  } catch (parseError) {
    handleError(parseError, { "body": JSON.stringify(responseBody) });
  }
}

// 处理更多信息响应
function handleMoreInfoResponse(responseBody) {
  if (responseBody.data && responseBody.data.length > 0) {
    const userData = responseBody.data[0];
    const fieldsToDelete = [
      "banner", "service", "healthy", "columns", "img_banner", "text_banner",
      "healthy_banner", "emotions", "beans", "red_envelope", "healthy_ad", "anchor_list"
    ];
    fieldsToDelete.forEach(field => delete userData[field]);

    if (userData.user) {
      Object.assign(userData.user, {
        theme_ticktocks: 16,
        theme_pendant: 16,
        is_traceless_access: 1,
        is_vip_annual: 1,
        expire_time: 2536525808,
        vip_grade: 8,
        is_global_view_secretly: 1
      });
    }
  }
  $done({ "body": JSON.stringify(responseBody) });
}

// 处理闪照信息响应
function handleFlashInfoResponse(responseBody) {
  if (responseBody.data && responseBody.data.length > 0) {
    Object.assign(responseBody.data[0], {
      is_vip: 1
    });
  }
  $done({ "body": JSON.stringify(responseBody) });
}

// 处理影子信息响应
function handleShadowInfoResponse(responseBody) {
  if (responseBody.data && responseBody.data.length > 0) {
    Object.assign(responseBody.data[0], {
      is_open_shadow: 1,
      has_right: 1
    });
  }
  $done({ "body": JSON.stringify(responseBody) });
}

// 处理访问者信息响应
function handleVisitorResponse(responseBody) {
  if (responseBody.data && responseBody.data.length > 0) {
    const fieldsToDelete = [
      "adx", "ads_id", "adms_mark", "adms_type", "nearby_dating",
      "adms_operating", "adms_user", "id", "adm_type", "sale_type",
      "style_view", "extra_json"
    ];
    responseBody.data.forEach(visitorData => {
      fieldsToDelete.forEach(field => delete visitorData[field]);
      Object.assign(visitorData, {
        is_show_adm_icon: 0,
        is_ads: 0
      });
    });
  }
  $done({ "body": JSON.stringify(responseBody) });
}

// 处理设置信息响应
function handleSettingsResponse(responseBody) {
  if (responseBody.data && responseBody.data.length > 0) {
    Object.assign(responseBody.data[0], {
      is_invisible_all: 1,
      is_global_view_secretly: 1,
      is_invisible_map: 0,
      is_visited_push: 1,
      video_1v1_warning: 1,
      album_ban_save: 1,
      is_hide_follows_count: 1,
      is_traceless_access: 1
    });
  }
  $done({ "body": JSON.stringify(responseBody) });
}

// 处理 aaid 信息响应
function handleAaidResponse(responseBody) {
  if ($response.status === 403) {
    $response.status = 200;
  }
  if (responseBody.data && responseBody.data.length > 0) {
    const userData = responseBody.data[0];
    Object.assign(userData, {
      live_card_style: 0,
      is_have_chatroom: 0,
      personal_card_album: "[]",
      size: 0,
      live: 0
    });
  }
  if (responseBody.data && Array.isArray(responseBody.data.adx)) {
    responseBody.data.adx.forEach(adxData => {
      Object.keys(adxData).forEach(key => delete adxData[key]);
    });
  }
  Object.assign(responseBody, {
    code: 200,
    message: ""
  });
  const fieldsToDelete = [
    "adms_operating", "nearby_dating", "adms_user", "adms_activity"
  ];
  if (responseBody.data) {
    fieldsToDelete.forEach(field => delete responseBody.data[field]);
  }
  if (responseBody.extra) {
    fieldsToDelete.concat(["adms"]).forEach(field => delete responseBody.extra[field]);
  }
  $done({
    "status": $response.status,
    "body": JSON.stringify(responseBody)
  });
}

// 处理非在线用户响应
async function handleNotLivingResponse(responseBody) {
  const userPattern = /users\/(\d+)/;
  const matchedData = $request.url.match(userPattern);
  if (!matchedData) {
    return $done({ "body": JSON.stringify(responseBody) });
  }

  const userId = matchedData[1];
  const fetchUrl = `https://argo.blued.cn/users/${userId}/basic`;
  const authHeader = $request.headers.authorization;
  const requestHeaders = {
    "authority": "argo.blued.cn",
    "accept": "*/*",
    "x-client-color": "light",
    "content-type": "application/json",
    "accept-encoding": "gzip, deflate, br",
    "user-agent": "Mozilla/5.0 (iPhone; iOS 16.1.1; Scale/3.00; CPU iPhone OS 16_5 like Mac OS X) iOS/120037_2.03.7_6972_0921 (Asia/Shanghai) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 ibb/1.0.0 app/1",
    "accept-language": "zh-CN",
    "authorization": authHeader
  };

  try {
    const fetchedData = await fetchData(fetchUrl, requestHeaders);
    handleFetchedData(fetchedData, responseBody);
  } catch (fetchError) {
    handleError(fetchError, { "body": JSON.stringify(responseBody) });
  }
}

// 异步获取数据
async function fetchData(url, headers) {
  return new Promise((resolve, reject) => {
    sendRequest({ url, headers }, "GET", (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve({ status: response.status, body });
      }
    });
  });
}

// 处理获取到的数据
function handleFetchedData(fetchedData, originalData) {
  try {
    const parsedData = JSON.parse(fetchedData.body);
    if (parsedData?.data?.length > 0) {
      const userData = parsedData.data[0];
      if (userData.last_operate !== undefined && userData.distance !== undefined) {
        const lastOperationTime = userData.last_operate;
        const formattedDistance = parseFloat(userData.distance).toFixed(2) + "km";
        if (originalData?.data?.length > 0) {
          const originalUserData = originalData.data[0];
          Object.assign(originalUserData, {
            last_operate: lastOperationTime,
            location: formattedDistance,
            privacy_photos_has_locked: 1,
            is_hide_followers_count: 0,
            is_hide_follows_count: 0
          });
          Object.assign(userData, {
            privacy_photos_has_locked: 1,
            is_hide_follows_count: 0,
            is_hide_followers_count: 0
          });
          $done({ "body": JSON.stringify(originalData) });
        }
      }
    }
    $done({ "body": JSON.stringify(originalData) });
  } catch (error) {
    handleError(error, { "body": JSON.stringify(originalData) });
  }
}

// 处理地图信息响应
function handleMapResponse(responseBody) {
  if ($response.status === 403) {
    Object.assign(responseBody, {
      code: 200,
      message: "",
      data: [{ "status": 1 }]
    });
    $done({
      "status": 200,
      "body": JSON.stringify(responseBody)
    });
  } else {
    $done({ "body": JSON.stringify(responseBody) });
  }
}

// Env 类定义
function Env(name) {
  return new class {
    constructor(name) {
      this.name = name;
      this.logs = [];
      this.isMute = false;
      this.isNeedRewrite = false;
      if (!['Surge', 'Loon'].includes(this.getEnv())) {
        console.log("This script is only compatible with Surge and Loon");
        return;
      }
      // 其他初始化代码
    }

    // 获取当前运行环境
    getEnv() {
      return typeof $environment !== "undefined" && $environment["surge-version"] ? "Surge"
        : typeof $environment !== "undefined" && $environment["stash-version"] ? "Stash"
        : typeof $loon !== "undefined" ? "Loon"
        : undefined;
    }

    // 判断是否为 Surge 环境
    isSurge() {
      return this.getEnv() === "Surge";
    }

    // 判断是否为 Loon 环境
    isLoon() {
      return this.getEnv() === "Loon";
    }

    // 发送请求
    send(request, method = "GET", callback = () => {}) {
      if (this.isSurge() || this.isLoon()) {
        sendRequest(request, method, callback);
      }
    }

    // GET 请求
    get(request, callback) {
      this.send(request, "GET", callback);
    }

    // POST 请求
    post(request, callback) {
      this.send(request, "POST", callback);
    }

    // 完成脚本执行
    done(data = {}) {
      const elapsedTime = (new Date().getTime() - this.startTime) / 1000;
      this.log("", `🔔${this.name}, 结束! 🕛 ${elapsedTime} 秒`);
      if (this.isSurge() || this.isLoon()) {
        $done(data);
      }
    }

    // 记录日志
    log(...args) {
      if (!this.isMute) {
        console.log(...args);
      }
      this.logs = this.logs.concat(args);
    }

    // 记录错误日志
    logErr(error) {
      this.log("", `❗️${this.name}, 错误!`, error);
    }
  }(name);
}
