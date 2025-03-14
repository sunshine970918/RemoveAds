// 创建一个 Env 类的实例，传入脚本名称
const environmentInstance = new Env("Blued增强功能-Eric");

// 定义需要跳过的URL
const skipUrls = [
  "https://social.blued.cn/users/58081339/flash", // 跳过特定用户的闪照页面
  // 可以在这里添加更多的URL
];

// 确保兼容性
function getHttpClient() {
  return typeof $httpClient !== "undefined" ? $httpClient :
         typeof $task !== "undefined" ? $task :
         console.error("No HTTP client available"); // 若没有可用的 HTTP 客户端，记录错误信息
}

function sendRequest(request, method, callback) {
  const client = getHttpClient(); // 获取合适的 HTTP 客户端
  if (client) {
    client[method.toLowerCase()](request, callback); // 发送请求
  } else {
    console.error("Failed to send request due to unsupported environment"); // 环境不支持，记录错误
  }
}

// 异步自执行函数：处理请求和响应
(async () => {
  try {
    // 定义 URL 模式匹配的正则表达式，使用 Map 替代 Object
    const urlPatterns = new Map([
      ["basicInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\/basic/], // 基本信息匹配
      ["moreInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\/more\/ios.*/], // 更多信息匹配
      ["visitorInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\/visitors\?aaid=/], // 访问者信息匹配
      ["settingsInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\/setting/], // 设置匹配
      ["aaidInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\?(column|aaid)=/], // aaid 信息匹配
      ["notLivingInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\?is_living=false/], // 非在线用户匹配
      ["mapInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/map/] // 地图信息匹配
    ]);

    // 获取当前请求的 URL
    const currentUrl = $request.url;

    // 如果当前 URL 匹配需要跳过的 URL，则直接返回
    if (skipUrls.includes(currentUrl)) {
      return $done({ "body": $response.body }); // 跳过处理，直接返回响应
    }

    // 定义处理函数映射，使用 Map 替代 Object
    const handlerMap = new Map([
      ["basicInfo", handleBasicInfoResponse],
      ["moreInfo", handleMoreInfoResponse],
      ["visitorInfo", handleVisitorResponse],
      ["settingsInfo", handleSettingsResponse],
      ["aaidInfo", handleAaidResponse],
      ["notLivingInfo", handleNotLivingResponse],
      ["mapInfo", handleMapResponse]
    ]);

    // 解析响应体
    const responseBody = JSON.parse($response.body);

    // 遍历 URL 模式，找到匹配的模式并执行相应的处理函数
    for (const [key, pattern] of urlPatterns) {
      if (pattern.test(currentUrl)) {
        await handlerMap.get(key)(responseBody); // 调用对应的处理函数
        return; // 结束处理
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
  console.error("脚本执行出错:", error); // 记录错误信息
  environmentInstance.done(data); // 完成执行，传入相应数据
}

// 处理基本信息响应
function handleBasicInfoResponse(responseBody) {
  try {
    // 如果有数据则直接返回原响应
    $done({ "body": JSON.stringify(responseBody) });
  } catch (parseError) {
    handleError(parseError, { "body": JSON.stringify(responseBody) });
  }
}

// 处理更多信息响应
function handleMoreInfoResponse(responseBody) {
  if (responseBody.data && responseBody.data.length > 0) {
    const userData = responseBody.data[0]; // 获取用户数据
    const fieldsToDelete = [
      "banner", // 广告横幅
      "service", // 服务信息
      "healthy", // 健康信息
      "columns", // 栏目信息
      "img_banner", // 图片横幅
      "text_banner", // 文本横幅
      "healthy_banner", // 健康横幅
      "emotions", // 情绪状态
      "beans", // 金币信息
      "red_envelope", // 红 envelopes
      "healthy_ad", // 健康广告
      "anchor_list" // 直播主列表
    ];

    // 删除不需要的字段
    fieldsToDelete.forEach(field => delete userData[field]);

    if (userData.user) {
      // 添加或覆盖特定字段
      Object.assign(userData.user, {
        is_traceless_access: 1, // 无痕访问状态
        is_vip_annual: 1, // 年度 VIP 状态
        is_global_view_secretly: 1 // 全局隐身状态
      });
    }
  }
  $done({ "body": JSON.stringify(responseBody) });
}

// 处理访问者信息响应
function handleVisitorResponse(responseBody) {
  if (responseBody.data && responseBody.data.length > 0) {
    const fieldsToDelete = [
      "adx", // 广告数据
      "ads_id", // 广告 ID
      "adms_mark", // 广告标记
      "adms_type", // 广告类型
      "adms_operating", // 广告操作
      "adms_user", // 广告用户信息
      "adm_type", // 广告类型
      "sale_type" // 销售类型
    ];

    responseBody.data.forEach(visitorData => {
      // 删除不需要的字段
      fieldsToDelete.forEach(field => {
        if (visitorData[field] !== undefined) {
          delete visitorData[field];
        }
      });

      // 添加或更新广告相关字段
      Object.assign(visitorData, {
        is_show_adm_icon: 0, // 是否显示广告图标
        is_ads: 0 // 是否显示广告
      });
    });
  }
  $done({ "body": JSON.stringify(responseBody) });
}

// 处理设置信息响应
function handleSettingsResponse(responseBody) {
  if (responseBody.data && responseBody.data.length > 0) {
    const settings = {
      is_invisible_all: 1, // 全部隐身
      is_global_view_secretly: 1, // 全局隐身查看
      is_invisible_map: 0, // 地图隐身状态
      is_visited_push: 1, // 是否接收访问通知
      video_1v1_warning: 1, // 视频一对一警告
      album_ban_save: 1, // 防止保存相册
      is_hide_follows_count: 1, // 隐藏关注计数
      is_traceless_access: 1 // 无痕访问
    };

    // 添加或覆盖设置字段
    Object.assign(responseBody.data[0], settings);
  }
  $done({ "body": JSON.stringify(responseBody) });
}

// 处理 aaid 信息响应
function handleAaidResponse(responseBody) {
  if ($response.status === 403) {
    $response.status = 200; // 如果响应为403，改为200
  }

  if (responseBody.data && responseBody.data.length > 0) {
    const userData = responseBody.data[0]; // 获取用户数据
    const fieldsToAdd = {
      live_card_style: 0, // 用户直播卡片样式
      is_have_chatroom: 0, // 是否有聊天室
      personal_card_album: "[]", // 用户相册
      size: 0, // 用户信息大小
      live: 0 // 用户是否直播
    };

    // 添加或覆盖字段
    Object.assign(userData, fieldsToAdd);

    // 删除广告数据
    if (Array.isArray(responseBody.data.adx)) {
      responseBody.data.adx.forEach(adxData => {
        deleteFields(adxData, Object.keys(adxData)); // 删除所有 adx 数据
      });
    }
  }

  // 删除用户数据和额外数据中的字段
  if (responseBody.data) {
    const fieldsToDelete = [
      "adms_operating", // 广告操作
      "nearby_dating", // 附近约会信息
      "adms_user", // 广告用户信息
      "adms_activity" // 广告活动信息
    ];
    deleteFields(responseBody.data, fieldsToDelete);
  }

  if (responseBody.extra) {
    const fieldsToDelete = [
      "adms_operating", // 广告操作
      "nearby_dating", // 附近约会信息
      "adms_user", // 广告用户信息
      "adms_activity", // 广告活动信息
      "adms" // 广告信息
    ];
    deleteFields(responseBody.extra, fieldsToDelete);
  }

  // 清空消息
  Object.assign(responseBody, {
    code: 200,
    message: ""
  });

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
    return $done({ "body": JSON.stringify(responseBody) }); // 无用户 ID，直接返回
  }

  const userId = matchedData[1]; // 用户 ID
  const fetchUrl = `https://argo.blued.cn/users/${userId}/basic`; // 获取用户基本信息的 URL
  const headers = {
    "authority": "argo.blued.cn",
    "accept": "*/*",
    "x-client-color": "light",
    "content-type": "application/json",
    "accept-encoding": "gzip, deflate, br",
    "user-agent": navigator.userAgent,
    "accept-language": "zh-CN",
    "authorization": $request.headers.authorization
  };

  try {
    const fetchedData = await fetchData(fetchUrl, headers); // 发送请求获取基础信息
    handleFetchedData(fetchedData, responseBody); // 处理获取到的数据
  } catch (fetchError) {
    handleError(fetchError, { "body": JSON.stringify(responseBody) });
  }
}

// 异步获取数据
async function fetchData(url, headers) {
  return new Promise((resolve, reject) => {
    sendRequest({ url, headers }, "GET", (error, response, body) => {
      error ? reject(error) : resolve({ status: response.status, body });
    });
  });
}

// 处理获取到的数据，保留隐私照片锁定状态
function handleFetchedData(fetchedData, originalData) {
  try {
    const parsedData = JSON.parse(fetchedData.body); // 解析获取的数据
    if (parsedData?.data?.length > 0 && originalData?.data?.length > 0) {
      const userData = parsedData.data[0]; // 获取用户数据
      if (userData.last_operate !== undefined && userData.distance !== undefined) {
        const originalUserData = originalData.data[0];
        Object.assign(originalUserData, {
          privacy_photos_has_locked: 1 // 隐私照片锁定状态
        });
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
      code: 200, // 如果响应为403，改变为200
      message: "",
      data: [{ "status": 1 }] // 返回地图可用状态
    });
    $done({
      "status": 200,
      "body": JSON.stringify(responseBody)
    });
  } else {
    $done({ "body": JSON.stringify(responseBody) }); // 其他情况直接返回
  }
}

// 辅助函数：删除指定的对象字段
function deleteFields(obj, fields) {
  fields.forEach(field => {
    if (obj[field] !== undefined) {
      delete obj[field];
    }
  });
}

// 辅助函数：添加或覆盖对象字段
function addFields(obj, fields) {
  Object.assign(obj, fields);
}

// Env 类定义
function Env(name) {
  return new class {
    constructor(name) {
      this.name = name; // 脚本名称
      this.startTime = Date.now(); // 记录脚本开始时间
      console.log(`脚本 ${this.name} 开始执行`); // 输出开始日志
    }

    // 获取当前运行环境
    getEnv() {
      return typeof $environment !== 'undefined' ?
        ($environment['surge-version'] ? 'Surge' : $loon ? 'Loon' : undefined) : undefined;
    }

    // 发送请求
    async sendRequest(request, method = 'GET') {
      const client = getHttpClient();
      if (client) {
        return new Promise((resolve, reject) => {
          client[method.toLowerCase()](request, (error, response, body) => {
            error ? reject(error) : resolve({ status: response.status, body });
          });
        });
      }
      throw new Error("No HTTP client available"); // 没有可用的 HTTP 客户端
    }

    // 完成脚本执行
    done(data = {}) {
      const endTime = Date.now();
      const duration = (endTime - this.startTime) / 1000; // 计算执行时间
      console.log(`脚本 ${this.name} 处理完毕，耗时 ${duration.toFixed(3)} 秒`);
      if (['Surge', 'Loon'].includes(this.getEnv())) {
        $done(data); // 在支持的环境中完成脚本执行
      }
    }
  }(name);
}
