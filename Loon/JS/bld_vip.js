// 创建 Env 实例
const environmentInstance = new Env("Blued增强功能-Eric");

// 跳过 URL 列表
const skipUrls = ["https://social.blued.cn/users/58081339/flash"];

// 非在线用户缓存
const basicInfoCache = new Map();

// HTTP 客户端兼容
function getHttpClient() {
  return typeof $httpClient !== "undefined" ? $httpClient :
         typeof $task !== "undefined" ? $task :
         console.error("No HTTP client available");
}

function sendRequest(request, method, callback) {
  const client = getHttpClient();
  if (client) client[method.toLowerCase()](request, callback);
  else console.error("HTTP client unavailable");
}

// 异步主函数
(async () => {
  try {
    const urlPatterns = new Map([
      ["basicInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\/basic/],
      ["moreInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\/more\/ios.*/],
      ["visitorInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\/visitors\?aaid=/],
      ["settingsInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\/setting/],
      ["aaidInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\?(column|aaid)=/],
      ["notLivingInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/\d+\?is_living=false/],
      ["mapInfo", /https?:\/\/(?:social|argo)\.blued\.cn\/users\/map/]
    ]);

    const handlerMap = new Map([
      ["basicInfo", handleBasicInfoResponse],
      ["moreInfo", handleMoreInfoResponse],
      ["visitorInfo", handleVisitorResponse],
      ["settingsInfo", handleSettingsResponse],
      ["aaidInfo", handleAaidResponse],
      ["notLivingInfo", handleNotLivingBatchResponse],
      ["mapInfo", handleMapResponse]
    ]);

    const currentUrl = $request.url;
    if (skipUrls.includes(currentUrl)) return $done({ "body": $response.body });

    const responseBody = JSON.parse($response.body);

    for (const [key, pattern] of urlPatterns) {
      if (pattern.test(currentUrl)) {
        await handlerMap.get(key)(responseBody);
        return;
      }
    }

    $done({ "body": JSON.stringify(responseBody) });
  } catch (err) {
    handleError(err, {});
  }
})();

// 错误处理
function handleError(error, data) {
  console.error("脚本执行错误:", error);
  environmentInstance.done(data);
}

// 基本信息处理
function handleBasicInfoResponse(responseBody) { $done({ "body": JSON.stringify(responseBody) }); }

// 更多信息处理
function handleMoreInfoResponse(responseBody) {
  if (responseBody.data?.length) {
    const userData = responseBody.data[0];
    ["banner","service","healthy","columns","img_banner","text_banner",
     "healthy_banner","emotions","beans","red_envelope","healthy_ad","anchor_list"]
    .forEach(f => delete userData[f]);
    if (userData.user) Object.assign(userData.user, {
      is_traceless_access:1, is_vip_annual:1, is_global_view_secretly:1
    });
  }
  $done({ "body": JSON.stringify(responseBody) });
}

// 访问者信息
function handleVisitorResponse(responseBody) {
  responseBody.data?.forEach(visitor => {
    ["adx","ads_id","adms_mark","adms_type","adms_operating","adms_user","adm_type","sale_type"]
    .forEach(f => delete visitor[f]);
    Object.assign(visitor, { is_show_adm_icon:0, is_ads:0 });
  });
  $done({ "body": JSON.stringify(responseBody) });
}

// 设置
function handleSettingsResponse(responseBody) {
  if (responseBody.data?.length) Object.assign(responseBody.data[0], {
    is_invisible_all:1, is_global_view_secretly:1, is_invisible_map:0, is_visited_push:1,
    video_1v1_warning:1, album_ban_save:1, is_hide_follows_count:1, is_traceless_access:1
  });
  $done({ "body": JSON.stringify(responseBody) });
}

// aaid 信息
function handleAaidResponse(responseBody) {
  if ($response.status === 403) $response.status=200;
  if (responseBody.data?.length) {
    const userData = responseBody.data[0];
    Object.assign(userData, { live_card_style:0, is_have_chatroom:0, personal_card_album:"[]", size:0, live:0 });
    if (Array.isArray(responseBody.data.adx)) responseBody.data.adx.forEach(adx => Object.keys(adx).forEach(f=>delete adx[f]));
    ["adms_operating","nearby_dating","adms_user","adms_activity"].forEach(f=>delete userData[f]);
  }
  if (responseBody.extra) ["adms_operating","nearby_dating","adms_user","adms_activity","adms"].forEach(f=>delete responseBody.extra[f]);
  Object.assign(responseBody, { code:200, message:"" });
  $done({ status:$response.status, body:JSON.stringify(responseBody) });
}

// 批量非在线用户处理（并行多用户）
async function handleNotLivingBatchResponse(responseBody) {
  // 假设支持多个 userId，实际可从请求或传入数组获取
  const userIds = [$request.url.match(/users\/(\d+)/)?.[1]].filter(Boolean);

  // 并行请求未缓存用户
  const fetchPromises = userIds.map(userId => {
    if (basicInfoCache.has(userId)) {
      responseBody.data[0].privacy_photos_has_locked = 1;
      return Promise.resolve(basicInfoCache.get(userId));
    }

    const fetchUrl = `https://argo.blued.cn/users/${userId}/basic`;
    const headers = {
      "authority":"argo.blued.cn","accept":"*/*","x-client-color":"light",
      "content-type":"application/json","accept-encoding":"gzip, deflate, br",
      "user-agent":navigator.userAgent,"accept-language":"zh-CN",
      "authorization":$request.headers.authorization
    };

    return fetchData(fetchUrl, headers)
      .then(fetchedData => {
        const parsed = JSON.parse(fetchedData.body);
        if (parsed?.data?.length && responseBody?.data?.length) {
          responseBody.data[0].privacy_photos_has_locked = 1;
        }
        basicInfoCache.set(userId, responseBody);
        return responseBody;
      })
      .catch(err => {
        console.error(`用户 ${userId} 请求失败:`, err);
        return responseBody;
      });
  });

  const results = await Promise.all(fetchPromises);
  $done({ "body": JSON.stringify(results[0]) }); // 返回第一个结果示例
}

// 请求封装
async function fetchData(url, headers) {
  return new Promise((resolve,reject)=>sendRequest({url,headers},"GET",(err,res,body)=>err?reject(err):resolve({status:res.status,body})));
}

// 地图处理
function handleMapResponse(responseBody) {
  if ($response.status===403) Object.assign(responseBody,{code:200,message:"",data:[{status:1}]});
  $done({status:$response.status===403?200:$response.status, body:JSON.stringify(responseBody)});
}

// Env 类
function Env(name) {
  return new class{
    constructor(name){this.name=name;this.startTime=Date.now();console.log(`脚本 ${this.name} 开始执行`);}
    getEnv(){return typeof $environment!=='undefined'?($environment['surge-version']?'Surge':$loon?'Loon':undefined):undefined;}
    async sendRequest(request, method='GET'){const client=getHttpClient();if(client)return new Promise((res,rej)=>client[method.toLowerCase()](request,(err,r,b)=>err?rej(err):res({status:r.status,body:b})));throw new Error("No HTTP client available");}
    done(data={}){console.log(`脚本 ${this.name} 处理完毕，耗时 ${(Date.now()-this.startTime)/1000} 秒`);if(['Surge','Loon'].includes(this.getEnv()))$done(data);}
  }(name);
}
