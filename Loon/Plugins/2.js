// 环境检测函数
const checkEnvironment = (function() {
  let isFirstRun = true;
  return function(context, checkFunction) {
    const executor = isFirstRun ? function() {
      if (checkFunction) {
        const result = checkFunction.apply(context, arguments);
        checkFunction = null;
        return result;
      }
    } : function() {};
    isFirstRun = false;
    return executor;
  };
})();

// 初始化和环境检测
(function() {
  checkEnvironment(this, function() {
    const functionPattern = new RegExp("function *\\( *\\)");
    const incrementPattern = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", "i");
    const initFunction = getInitFunction("init");

    if (typeof initFunction === 'function') {
      if (!functionPattern.test(initFunction + "chain") || !incrementPattern.test(initFunction + "input")) {
        initFunction("0"); // 确保initFunction是一个函数再调用
      } else {
        getInitFunction();
      }
    } else {
      console.error("initFunction is not defined or is not a function");
    }
  })();
})();

// 设置定时器
(function() {
  let globalObject;
  try {
    const getGlobal = Function("return (function() {}.constructor(\"return this\")( ));");
    globalObject = getGlobal();
  } catch (error) {
    globalObject = window;
  }
  globalObject.setInterval(getInitFunction, 500);
})();

// 环境变量
const env = new Env("Blued增强功能-Eric");

// 辅助函数
function getInitFunction(key) {
  // 这里需要确保返回一个函数
  const initFunctions = {
    init: function(param) {
      // 初始化逻辑
      console.log(`Initializing with param: ${param}`);
    }
  };

  if (key in initFunctions) {
    return initFunctions[key];
  } else {
    console.error(`No function found for key: ${key}`);
    return function() {}; // 返回一个空函数，避免调用时报错
  }
}

// 密码和状态管理
// 修改为从Loon的$argument获取参数
function getStoredData(key) {
  try {
    const args = JSON.parse($argument);
    return args[key];
  } catch (error) {
    console.error("Failed to parse arguments:", error);
    return null;
  }
}

function setStoredData(key, value) {
  // 这里可以添加对Loon的支持，但由于Loon不支持持久化存储，这里留空
}

function verifyPassword(password, correctPassword) {
  return btoa(password) === correctPassword;
}

// 密码获取
async function fetchPassword() {
  const response = await fetch("https://gist.githubusercontent.com/Alex0510/2f220cbae58f770e572c688594d52393/raw/password.js");
  return await response.text().then(text => text.trim());
}

// 请求处理
(async function() {
  try {
    const userPassword = getStoredData("EricPassword");
    const scriptEnabled = getStoredData("scriptvip");

    if (scriptEnabled !== "true") {
      console.log("Script is disabled.");
      scriptDone({});
      return;
    }

    const correctPassword = await fetchPassword();
    if (!verifyPassword(userPassword, correctPassword)) {
      console.error("密码验证失败");
      sendMessage("密码验证失败", "请检查参数配置中的密码", "");
      scriptDone({});
      return;
    }

    // 请求模式匹配
    const requestPatterns = {
      "basic": /https:\/\/.*\.blued\.cn\/users\/\d+\/basic/,
      "more": /https:\/\/.*\.blued\.cn\/users\/\d+\/more\/ios.*/,
      // 其他模式...
    };

    const currentUrl = $request.url;

    if (requestPatterns.basic.test(currentUrl)) {
      handleBasicRequest();
    } else if (requestPatterns.more.test(currentUrl)) {
      handleMoreRequest();
    }
    // 处理其他请求...

    function handleBasicRequest() {
      let responseBody = $response.body;
      try {
        let responseData = JSON.parse(responseBody);
        console.log("Original Basic response body:", JSON.stringify(responseData, null, 2));

        if (responseData && responseData.data && responseData.data.length > 0) {
          const user = responseData.data[0];
          user.is_hide_distance = 0;
          user.is_hide_last_operate = 0;
          
          console.log("Modified Basic response body:", JSON.stringify(responseData, null, 2));
          scriptDone({
            "body": JSON.stringify(responseData)
          });
        } else {
          console.error("Basic response does not contain the required data fields.");
          scriptDone({
            "body": responseBody
          });
        }
      } catch (error) {
        console.error("Error parsing Basic response:", error);
        scriptDone({
          "body": responseBody
        });
      }
    }

    // 其他处理函数...

  } catch (error) {
    console.error("脚本执行出错:", error);
    scriptDone({});
  }
})();

// 结束脚本
function scriptDone(result) {
  env.done(result);
}

// 发送通知
function sendMessage(title, subtitle, body) {
  env.msg(title, subtitle, body);
}

// Env类定义
function Env(name, opts) {
  // 这里省略了Env类的详细实现
  // 你可以在这里定义Env类的所有方法和属性
}
