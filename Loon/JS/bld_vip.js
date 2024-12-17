// 创建一个 Env 类的实例，传入脚本名称
const environmentInstance = new Env("Blued增强功能-Eric");

// 异步自执行函数：处理请求和响应
(async () => {
  try {
    environmentInstance.log("脚本开始执行");
    environmentInstance.log("脚本版本号: v1.0");
    const currentUrl = $request.url;
    environmentInstance.log("处理请求 URL: " + currentUrl);

    // URL 模式匹配
    const urlPatterns = {
      "basicInfo": /https:\/\/.*\.blued\.cn\/users\/\d+\/basic/,
      "moreInfo": /https:\/\/.*\.blued\.cn\/users\/\d+\/more\/ios.*/,
      "flashInfo": /https:\/\/.*\.blued\.cn\/users\/\d+\/flash/,
      "shadowInfo": /https:\/\/.*\.blued\.cn\/users\/shadow/,
      "settingsInfo": /https:\/\/.*\.blued\.cn\/users\/\d+\/setting/,
      "aaidInfo": /https:\/\/.*\.blued\.cn\/users\?(column|aaid)=/,
      "notLivingInfo": /https:\/\/.*\.blued\.cn\/users\/\d+\?is_living=false/,
      "mapInfo": /https:\/\/.*\.blued\.cn\/users\/map/,
      "visitorInfo": /https:\/\/.*\.blued\.cn\/users\/\d+\/visitors\?aaid=/
    };

    // 根据 URL 模式进行处理
    if (urlPatterns.basicInfo.test(currentUrl)) {
      handleBasicInfoResponse();
    } else if (urlPatterns.moreInfo.test(currentUrl)) {
      handleMoreInfoResponse();
    } else if (urlPatterns.flashInfo.test(currentUrl)) {
      handleFlashInfoResponse();
    } else if (urlPatterns.shadowInfo.test(currentUrl)) {
      handleShadowInfoResponse();
    } else if (urlPatterns.settingsInfo.test(currentUrl)) {
      handleSettingsResponse();
    } else if (urlPatterns.aaidInfo.test(currentUrl)) {
      handleAaidResponse();
    } else if (urlPatterns.notLivingInfo.test(currentUrl)) {
      handleNotLivingResponse();
    } else if (urlPatterns.mapInfo.test(currentUrl)) {
      handleMapResponse();
    } else if (urlPatterns.visitorInfo.test(currentUrl)) {
      handleVisitorResponse();
    } else {
      $done({});
    }

    // 处理基本信息响应的函数
    function handleBasicInfoResponse() {
      environmentInstance.log("正在处理基本信息请求");
      let responseBody = $response.body;
      try {
        let jsonResponse = JSON.parse(responseBody);
        if (jsonResponse && jsonResponse.data && jsonResponse.data.length > 0) {
          const userData = jsonResponse.data[0];
          $done({
            "body": JSON.stringify(jsonResponse)
          });
        } else {
          $done({
            "body": responseBody
          });
        }
      } catch (parseError) {
        environmentInstance.logErr("解析基本信息响应出错:", parseError);
        $done({
          "body": responseBody
        });
      }
    }

    // 处理更多信息响应的函数
    function handleMoreInfoResponse() {
      environmentInstance.log("正在处理更多信息请求");
      let responseBody = JSON.parse($response.body);
      if (responseBody.data && responseBody.data.length > 0) {
        const userData = responseBody.data[0];
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

        if (userData.user) {
          userData.user.theme_ticktocks = 16;
          userData.user.theme_pendant = 16;
          userData.user.is_traceless_access = 1;
          userData.user.is_vip_annual = 1;
          userData.user.expire_time = 2536525808;
          userData.user.vip_grade = 8;
          userData.user.is_global_view_secretly = 1;
        }
      }
      $done({
        "body": JSON.stringify(responseBody)
      });
    }

    // 处理闪照信息响应的函数
    function handleFlashInfoResponse() {
      environmentInstance.log("正在处理闪照信息请求");
      let responseBody = JSON.parse($response.body);
      if (responseBody.data && responseBody.data.length > 0) {
        responseBody.data[0].is_vip = 1;
        responseBody.data[0].flash_left_times = 10;
        responseBody.data[0].free_times = 10;
        responseBody.data[0].stimulate_flash = 10;
      }
      $done({
        "body": JSON.stringify(responseBody)
      });
    }

    // 处理影子信息响应的函数
    function handleShadowInfoResponse() {
      environmentInstance.log("正在处理影子信息请求");
      let responseBody = JSON.parse($response.body);
      if (responseBody.data && responseBody.data.length > 0) {
        responseBody.data[0].is_open_shadow = 1;
        responseBody.data[0].has_right = 1;
      }
      $done({
        "body": JSON.stringify(responseBody)
      });
    }

    // 处理访问者信息响应的函数
    function handleVisitorResponse() {
      environmentInstance.log("正在处理访问者信息请求");
      let responseBody = JSON.parse($response.body);
      if (responseBody.data && responseBody.data.length > 0) {
        responseBody.data.forEach(visitorData => {
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
      }
      $done({
        "body": JSON.stringify(responseBody)
      });
    }

    // 处理设置信息响应的函数
    function handleSettingsResponse() {
      environmentInstance.log("正在处理设置信息请求");
      let responseBody = JSON.parse($response.body);
      if (responseBody.data && responseBody.data.length > 0) {
        const userData = responseBody.data[0];
        userData.is_invisible_all = 1;
        userData.is_global_view_secretly = 1;
        userData.is_invisible_map = 0;
        userData.is_visited_push = 1;
        userData.video_1v1_warning = 1;
        userData.album_ban_save = 1;
        userData.is_hide_follows_count = 1;
        userData.is_traceless_access = 1;
      }
      $done({
        "body": JSON.stringify(responseBody)
      });
    }

    // 处理 aaid 信息响应的函数
    function handleAaidResponse() {
      environmentInstance.log("正在处理 aaid 信息请求");
      let responseBody = JSON.parse($response.body);
      if ($response.status === 403) {
        $response.status = 200;
      }
      if (responseBody.data && responseBody.data.length > 0) {
        const userData = responseBody.data[0];
        userData.live_card_style = 0;
        userData.is_have_chatroom = 0;
        userData.personal_card_album = "[]";
        userData.size = 0;
        userData.live = 0;
      }
      if (responseBody.data && Array.isArray(responseBody.data.adx)) {
        responseBody.data.adx.forEach(adxData => {
          Object.keys(adxData).forEach(key => delete adxData[key]);
        });
      }
      responseBody.code = 200;
      responseBody.message = "";
      if (responseBody.data) {
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
      $done({
        "status": $response.status,
        "body": JSON.stringify(responseBody)
      });
    }

    // 处理非在线用户响应的函数
    function handleNotLivingResponse() {
      environmentInstance.log("正在处理非在线用户请求");
      let responseBody = $response.body;
      const userPattern = /users\/(\d+)/;
      const matchedData = $request.url.match(userPattern);
      if (matchedData) {
        const userId = matchedData[1];
        const fetchUrl = "https://argo.blued.cn/users/" + userId + "/basic";
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

        $httpClient.get({
          "url": fetchUrl,
          "headers": requestHeaders
        }, function (error, response, bodyData) {
          if (error) {
            environmentInstance.logErr("获取用户基本信息失败:", error);
            $done({
              "body": responseBody
            });
          } else {
            handleFetchedData({
              "status": response.status,
              "body": bodyData
            }, JSON.parse(responseBody));
          }
        });
      } else {
        $done({
          "body": responseBody
        });
      }
    }

    // 处理获取到的数据
    function handleFetchedData(fetchedData, originalData) {
      try {
        let parsedData = JSON.parse(fetchedData.body);
        if (parsedData && parsedData.data && parsedData.data.length > 0) {
          const userData = parsedData.data[0];
          if (userData.last_operate !== undefined && userData.distance !== undefined) {
            const lastOperationTime = userData.last_operate;
            const formattedDistance = parseFloat(userData.distance).toFixed(2) + "km";
            if (originalData.data && originalData.data.length > 0) {
              const originalUserData = originalData.data[0];
              originalUserData.last_operate = lastOperationTime;
              originalUserData.location = formattedDistance;
              originalUserData.privacy_photos_has_locked = 1;
              originalUserData.is_hide_followers_count = 0;
              originalUserData.is_hide_follows_count = 0;
              userData.privacy_photos_has_locked = 1;
              userData.is_hide_follows_count = 0;
              userData.is_hide_followers_count = 0;
              $done({
                "body": JSON.stringify(originalData)
              });
            }
          } else {
            $done({
              "body": JSON.stringify(originalData)
            });
          }
        } else {
          $done({
            "body": JSON.stringify(originalData)
          });
        }
      } catch (error) {
        environmentInstance.logErr("解析获取到的数据出错:", error);
        $done({
          "body": JSON.stringify(originalData)
        });
      }
    }

    // 处理地图信息响应的函数
    function handleMapResponse() {
      environmentInstance.log("正在处理地图信息请求");
      let responseBody = $response.body;
      let responseStatus = $response.status;
      if (responseStatus === 403) {
        let jsonResponse = JSON.parse(responseBody);
        jsonResponse.code = 200;
        jsonResponse.message = "";
        jsonResponse.data = [{ "status": 1 }];
        $done({
          "status": 200,
          "body": JSON.stringify(jsonResponse)
        });
      } else {
        $done({
          "body": responseBody
        });
      }
    }
  } catch (scriptError) {
    environmentInstance.logErr("脚本执行出错:", scriptError);
    environmentInstance.done({});
  }
})();

// Env 类定义
function Env(name) {
  return new class {
    constructor(name) {
      this.name = name;
      this.logs = [];
      this.isMute = false;
      this.isNeedRewrite = false;
      this.startTime = new Date().getTime();
    }

    getEnv() {
      return "undefined" != typeof $loon ? "Loon" : undefined;
    }

    isLoon() {
      return "Loon" === this.getEnv();
    }

    send(request, method = "GET", callback = () => {}) {
      if (this.isLoon()) {
        $httpClient[method.toLowerCase()](request, callback);
      }
    }

    get(request, callback) {
      this.send(request, "GET", callback);
    }

    post(request, callback) {
      this.send(request, "POST", callback);
    }

    done(data = {}) {
      const elapsedTime = (new Date().getTime() - this.startTime) / 1000;
      this.log("", `🔔${this.name}, 结束! 🕛 ${elapsedTime} 秒`);
      if (this.isLoon()) {
        if (data.log) {
          this.log(data.log);
        }
        $done(data);
      }
    }

    log(...args) {
      if (!this.isMute) {
        console.log(...args);
      }
      this.logs = this.logs.concat(args);
    }

    logErr(error) {
      this.log("", `❗️${this.name}, 错误!`, error);
    }
  }(name);
}
