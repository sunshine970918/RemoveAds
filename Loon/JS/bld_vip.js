// 全局计时
const startTime = Date.now();
// 日志工具
function log(content) {
  console.log(content);
}
// 打印用时并结束脚本
function finishScript(data = {}) {
  const duration = (Date.now() - startTime) / 1000;
  log(`脚本运行成功，用时${duration.toFixed(3)}s`);
  $done(data); // 强制结束脚本，避免挂起
}

// 网络请求工具
function sendRequest(request, method, callback) {
  $httpClient[method.toLowerCase()](request, (error, response, body) => {
    // 网络错误直接返回，避免阻塞
    if (error) {
      log(`请求错误:${error.message}`);
      finishScript({ "body": $response.body || "{}" });
      return;
    }
    callback(response, body);
  });
}

// 异步自执行函数：核心入口（简化逻辑）
(async () => {
  log("脚本开始");
  try {
    // 仅保留2个核心功能的URL规则（避免多余匹配）
    const urlRules = [
      {
        key: "aaidInfo",
        pattern: /https?:\/\/(?:social|argo)\.blued\.cn\/users\?(column|aaid)=/,
        handler: handleAaid
      },
      {
        key: "userinfo",
        pattern: /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\?is_living=false/,
        handler: handleUserInfo
      }
    ];

    const currentUrl = $request.url;
    let matchedRule = null;
    // 匹配URL（找到即终止，避免循环冗余）
    for (const rule of urlRules) {
      if (rule.pattern.test(currentUrl)) {
        matchedRule = rule;
        break;
      }
    }

    // 1. 无匹配核心URL：直接结束
    if (!matchedRule) {
      finishScript({ "body": $response.body || "{}" });
      return;
    }

    // 2. 匹配到URL：执行对应处理
    log(`匹配url:${currentUrl}`);
    // 解析响应体（单独try/catch，避免解析失败阻塞）
    let responseBody = {};
    try {
      responseBody = $response.body ? JSON.parse($response.body) : {};
    } catch (parseErr) {
      log(`响应体解析失败:${parseErr.message}`);
      finishScript({ "body": $response.body || "{}" });
      return;
    }
    // 执行处理函数（确保处理后必结束）
    await matchedRule.handler(responseBody);
  } catch (globalErr) {
    // 全局异常兜底：必结束脚本
    log(`脚本异常:${globalErr.message}`);
    finishScript({ "body": $response.body || "{}" });
  }
})();

// 1. 处理AAID接口（403修复）
async function handleAaid(body) {
  try {
    // 修复403状态
    if ($response.status === 403) $response.status = 200;
    // 补全必要字段（避免APP崩溃）
    if (body.data?.length > 0) {
      Object.assign(body.data[0], {
        live_card_style: 0,
        is_have_chatroom: 0,
        personal_card_album: "[]",
        size: 0,
        live: 0
      });
    }
    // 清空错误消息
    Object.assign(body, { code: 200, message: "" });
    // 结束脚本
    finishScript({
      "status": $response.status,
      "body": JSON.stringify(body)
    });
  } catch (err) {
    log(`403处理失败:${err.message}`);
    finishScript({ "body": JSON.stringify(body) });
  }
}

// 2. 处理用户信息页（隐私相册解锁）
async function handleUserInfo(body) {
  try {
    log("正在解锁隐私相册");
    // 提取用户ID（单独校验，失败即结束）
    const userMatch = $request.url.match(/users\/(\d+)/);
    if (!userMatch || !userMatch[1]) {
      log("未提取到用户ID");
      finishScript({ "body": JSON.stringify(body) });
      return;
    }
    const userId = userMatch[1];

    // 拉取用户基础数据（用Promise确保异步完成）
    const fetchResult = await new Promise((resolve) => {
      sendRequest({
        url: `https://argo.blued.cn/users/${userId}/basic`,
        headers: {
          "authority": "argo.blued.cn",
          "accept": "*/*",
          "content-type": "application/json",
          "user-agent": navigator.userAgent,
          "accept-language": "zh-CN",
          "authorization": $request.headers.authorization || "" // 兼容无授权场景
        }
      }, "GET", (response, resBody) => {
        resolve({ status: response.status, body: resBody });
      });
    });

    // 处理拉取到的数据（解锁相册）
    let fetchedData = {};
    try {
      fetchedData = fetchResult.body ? JSON.parse(fetchResult.body) : {};
    } catch (parseErr) {
      log(`拉取数据解析失败:${parseErr.message}`);
      finishScript({ "body": JSON.stringify(body) });
      return;
    }

    // 验证数据并解锁相册
    if (fetchedData?.data?.length > 0 && body?.data?.length > 0) {
      const baseData = fetchedData.data[0];
      if (baseData.last_operate !== undefined && baseData.distance !== undefined) {
        body.data[0].privacy_photos_has_locked = 1;
        log("隐私相册解锁成功");
      } else {
        log("用户数据不完整，无法解锁");
      }
    } else {
      log("拉取的用户数据无效");
    }

    // 最终结束脚本
    finishScript({ "body": JSON.stringify(body) });
  } catch (err) {
    log(`隐私相册解锁失败:${err.message}`);
    finishScript({ "body": JSON.stringify(body) });
  }
}
