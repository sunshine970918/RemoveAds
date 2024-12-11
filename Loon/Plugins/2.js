// 初始化函数，用于闭包保护
const _0x48321a = (function () {
  let _0x1f08b5 = true;
  return function (_0x13e36f, _0x2181c8) {
    const _0x33e596 = _0x1f08b5 ? function () {
      if (_0x2181c8) {
        const _0x1b6e93 = _0x2181c8.apply(_0x13e36f, arguments);
        _0x2181c8 = null;
        return _0x1b6e93;
      }
    } : function () {};
    _0x1f08b5 = false;
    return _0x33e596;
  };
})();

// 立即执行函数，用于初始化
(function () {
  _0x48321a(this, function () {
    const _0x420f25 = new RegExp("function *\\( *\\)"),
      _0x244f2b = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", "i"),
      _0x211d31 = _0x54483c("init");
    if (!_0x420f25.test(_0x211d31 + "chain") || !_0x244f2b.test(_0x211d31 + "input")) {
      _0x211d31("0");
    } else {
      _0x54483c();
    }
  });
})();

const env = new Env("Blued增强功能-Eric");

(function () {
  let globalScope;
  try {
    const getGlobal = Function("return (function() {}.constructor(\"return this\")( ));");
    globalScope = getGlobal();
  } catch (error) {
    globalScope = window;
  }
  globalScope.setInterval(_0x54483c, 500);
})();

(async function () {
  try {
    // 定义工具函数
    function base64Encode(text) {
      return btoa(text);
    }

    function base64Decode(encodedText) {
      return atob(encodedText);
    }

    async function fetchPassword() {
      console.log("Fetching password...");
      const response = await fetch("https://gist.githubusercontent.com/Alex0510/2f220cbae58f770e572c688594d52393/raw/password.js");
      if (!response.ok) {
        throw new Error(`Failed to fetch password: ${response.statusText}`);
      }
      return (await response.text()).trim();
    }

    function getStoredData(key) {
      console.log(`Fetching data for key ${key}`);
      return env.getdata(key);
    }

    // 获取存储的密码和脚本启用状态
    const userPassword = getStoredData("EricPassword"),
      scriptEnabled = getStoredData("scriptvip");
    
    console.log("User password:", userPassword);
    console.log("Script enabled status:", scriptEnabled);

    // 检查脚本是否启用
    if (scriptEnabled !== "true") {
      console.log("Script is disabled via BoxJS.");
      env.done({});
      return;
    }

    const correctPassword = await fetchPassword();
    console.log("Fetched correct password:", correctPassword);

    function validatePassword(userPass, correctPass) {
      const userPassBase64 = base64Encode(userPass);
      return userPassBase64 === correctPass;
    }

    if (!validatePassword(userPassword, correctPassword)) {
      console.error("密码验证失败");
      env.msg("密码验证失败", "请检查 BoxJS 配置中的密码", "");
      env.done({});
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
    $done({});

    // 修改基本信息响应的函数
    async function modifyBasicResponse() {
      let responseBody = $response.body;
      try {
        let parsedBody = JSON.parse(responseBody);
        console.log("Original Basic response body:", JSON.stringify(parsedBody, null, 2));
        if (parsedBody && parsedBody.data && parsedBody.data.length > 0) {
          parsedBody.data[0].is_hide_distance = 0;
          parsedBody.data[0].is_hide_last_operate = 0;
          console.log("Modified Basic response body:", JSON.stringify(parsedBody, null, 2));
          $done({
            "body": JSON.stringify(parsedBody)
          });
        } else {
          console.error("Basic response does not contain the required data fields.");
          $done({
            "body": responseBody
          });
        }
      } catch (error) {
        console.error("Error parsing Basic response:", error);
        $done({
          "body": responseBody
        });
      }
    }

    // ... 其他函数保持不变 ...

  } catch (error) {
    console.error("脚本执行出错:", error);
    env.done({});
  }
})();

// 其他函数保持不变

function _0x54483c(_0x3bb32e) {
  function _0x4ded8c(_0x1268a5) {
    if (typeof _0x1268a5 === "string") {
      return function (_0x549b59) {}.constructor("while (true) {}").apply("counter");
    } else {
      if (("" + _0x1268a5 / _0x1268a5).length !== 1 || _0x1268a5 % 20 === 0) {
        (function () {
          return true;
        }).constructor("debugger").call("action");
      } else {
        (function () {
          return false;
        }).constructor("debugger").apply("stateObject");
      }
    }
    _0x4ded8c(++_0x1268a5);
  }
  try {
    if (_0x3bb32e) {
      return _0x4ded8c;
    } else {
      _0x4ded8c(0);
    }
  } catch (_0xe65dda) {}
}

// ... 保留其他函数 ...
