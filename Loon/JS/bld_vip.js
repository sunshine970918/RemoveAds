// 全局计时
const startTime = Date.now();

// 日志工具
function log(msg) {
  console.log(`[Blued+] ${msg}`);
}

// 安全 JSON 解析
function safeParse(json, fallback = {}) {
  try {
    return json ? JSON.parse(json) : fallback;
  } catch (e) {
    log(`JSON解析失败: ${e.message}`);
    return fallback;
  }
}

// 统一结束脚本
function finishScript(data = {}) {
  const duration = ((Date.now() - startTime) / 1000).toFixed(3);
  log(`脚本运行完成，用时 ${duration}s`);
  $done({
    status: data.status || $response.status,
    body: data.body || $response.body || "{}"
  });
}

// 网络请求 → Promise 化
function sendRequest(request, method = "GET") {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](request, (error, response, body) => {
      if (error) {
        log(`请求失败: ${error.message}`);
        return resolve({ status: 500, body: "{}" });
      }
      resolve({ status: response.status, body });
    });
  });
}

// 路由表
const urlRules = [
  {
    name: "aaidInfo",
    pattern: /https?:\/\/(?:social|argo)\.blued\.cn\/users\?(column|aaid)=/,
    handler: handleAaid
  },
  {
    name: "userinfo",
    pattern: /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\?is_living=false/,
    handler: handleUserInfo
  }
];

// 核心入口
(async () => {
  log("脚本开始");
  try {
    const currentUrl = $request.url;
    const rule = urlRules.find(r => r.pattern.test(currentUrl));

    if (!rule) return finishScript();

    log(`匹配到规则: ${rule.name}`);
    const responseBody = safeParse($response.body);
    await rule.handler(responseBody);
  } catch (e) {
    log(`全局异常: ${e.message}`);
    finishScript();
  }
})();

// 1. 处理AAID接口（403修复）
function handleAaid(body) {
  if ($response.status === 403) $response.status = 200;

  if (body.data?.length) {
    Object.assign(body.data[0], {
      live_card_style: 0,
      is_have_chatroom: 0,
      personal_card_album: "[]",
      size: 0,
      live: 0
    });
  }

  Object.assign(body, { code: 200, message: "" });
  finishScript({ status: $response.status, body: JSON.stringify(body) });
}

// 2. 处理用户信息页（隐私相册解锁）
async function handleUserInfo(body) {
  log("尝试解锁隐私相册");

  const userId = ($request.url.match(/users\/(\d+)/) || [])[1];
  if (!userId) return finishScript({ body: JSON.stringify(body) });

  const fetchResult = await sendRequest({
    url: `https://argo.blued.cn/users/${userId}/basic`,
    headers: {
      "accept": "*/*",
      "content-type": "application/json",
      "user-agent": navigator.userAgent,
      "authorization": $request.headers.authorization || ""
    }
  });

  const baseData = safeParse(fetchResult.body)?.data?.[0];
  if (baseData && body?.data?.length) {
    if ("last_operate" in baseData && "distance" in baseData) {
      body.data[0].privacy_photos_has_locked = 1;
      log("隐私相册解锁成功");
    } else {
      log("基础数据不完整，无法解锁");
    }
  } else {
    log("未获取到有效基础数据");
  }

  finishScript({ body: JSON.stringify(body) });
}
