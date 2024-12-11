// 初始化Loon对象
const Loon = {
  notify: function(title, subtitle, message) {
    $notification.post(title, subtitle, message);
  },
  getVal: function(key) {
    return $persistentStore.read(key);
  },
  setVal: function(key, val) {
    $persistentStore.write(val, key);
  },
  done: function(obj) {
    $done(obj);
  }
};

// 使用Loon对象来模拟Env
const _0x5c7bd9 = {
  msg: Loon.notify,
  getdata: Loon.getVal,
  setdata: Loon.setVal,
  done: Loon.done,
  name: "Blued增强功能-Eric"
};

(async function() {
  try {
    // 工具函数
    function base64Encode(text) {
      return btoa(text);
    }

    function base64Decode(encodedText) {
      return atob(encodedText);
    }

    async function fetchPassword() {
      const response = await fetch("https://gist.githubusercontent.com/Alex0510/2f220cbae58f770e572c688594d52393/raw/password.js");
      if (!response.ok) {
        throw new Error(`Failed to fetch password: ${response.statusText}`);
      }
      return (await response.text()).trim();
    }

    // 获取存储的密码和脚本启用状态
    const userPassword = _0x5c7bd9.getdata("EricPassword"),
          scriptEnabled = _0x5c7bd9.getdata("scriptvip");

    console.log("User password:", userPassword);
    console.log("Script enabled status:", scriptEnabled);

    if (scriptEnabled !== "true") {
      console.log("Script is disabled via Loon.");
      _0x5c7bd9.done({});
      return;
    }

    const correctPassword = await fetchPassword();
    console.log("Fetched correct password:", correctPassword);

    function validatePassword(userPass, correctPass) {
      return base64Encode(userPass) === correctPass;
    }

    if (!validatePassword(userPassword, correctPassword)) {
      console.error("密码验证失败");
      _0x5c7bd9.msg("密码验证失败", "请检查 Loon 配置中的密码", "");
      _0x5c7bd9.done({});
      return;
    }

    // 定义正则表达式匹配不同类型的请求
    const urlPatterns = {
      "basic": /https:\/\/.*\.blued\.cn\/users\/\d+\/basic/,
      "more": /https:\/\/.*\.blued\.cn\/users\/\d+\/more\/ios.*/,
      // ... 其他模式 ...
    };

    const requestUrl = $request.url;

    // 根据请求URL执行相应的处理函数
    for (let [patternName, pattern] of Object.entries(urlPatterns)) {
      if (pattern.test(requestUrl)) {
        switch (patternName) {
          case "basic":
            await modifyBasicResponse();
            break;
          case "more":
            await modifyMoreResponse();
            break;
          // ... 其他情况 ...
        }
        return;
      }
    }

    // 如果没有匹配的URL，则直接结束
    _0x5c7bd9.done({});

    // 修改基本信息响应的函数
    async function modifyBasicResponse() {
      let responseBody = $response.body;
      try {
        let parsedBody = JSON.parse(responseBody);
        if (parsedBody && parsedBody.data && parsedBody.data.length > 0) {
          parsedBody.data[0].is_hide_distance = 0;
          parsedBody.data[0].is_hide_last_operate = 0;
          console.log("Modified Basic response body:", JSON.stringify(parsedBody, null, 2));
          _0x5c7bd9.done({
            "body": JSON.stringify(parsedBody)
          });
        } else {
          console.error("Basic response does not contain the required data fields.");
          _0x5c7bd9.done({
            "body": responseBody
          });
        }
      } catch (error) {
        console.error("Error parsing Basic response:", error);
        _0x5c7bd9.done({
          "body": responseBody
        });
      }
    }

    // 修改更多信息响应的函数
    async function modifyMoreResponse() {
      let responseBody = $response.body;
      try {
        let parsedBody = JSON.parse(responseBody);
        if (parsedBody && parsedBody.data) {
          parsedBody.data.is_hide_online_status = 0;
          parsedBody.data.is_hide_last_online = 0;
          console.log("Modified More response body:", JSON.stringify(parsedBody, null, 2));
          _0x5c7bd9.done({
            "body": JSON.stringify(parsedBody)
          });
        } else {
          console.error("More response does not contain the required data fields.");
          _0x5c7bd9.done({
            "body": responseBody
          });
        }
      } catch (error) {
        console.error("Error parsing More response:", error);
        _0x5c7bd9.done({
          "body": responseBody
        });
      }
    }

  } catch (error) {
    console.error("脚本执行出错:", error);
    _0x5c7bd9.done({});
  }
})();
