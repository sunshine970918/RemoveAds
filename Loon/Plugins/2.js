(async function() {
  // 初始化日志
  console.log("Initializing with param:", $persistentStore.read("param") || 0);

  function getStoredData(key) {
    try {
      console.log(`Trying to parse $argument: ${JSON.stringify($argument)}`);
      const args = typeof $argument === 'string' ? JSON.parse($argument) : $argument;
      console.log(`Parsed argument: ${JSON.stringify(args)}`);
      if (args && key in args) {
        console.log(`Returning value for key ${key}:`, args[key]);
        return args[key];
      } else {
        console.error(`Key ${key} not found in arguments`);
        return null;
      }
    } catch (error) {
      console.error("Failed to parse arguments:", error);
      return null;
    }
  }

  async function fetchPassword() {
    try {
      console.log("Fetching password...");
      const response = await fetch("https://gist.githubusercontent.com/Alex0510/2f220cbae58f770e572c688594d52393/raw/password.js");
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch password: ${response.statusText}`);
      }
      const password = await response.text().then(text => text.trim());
      console.log("Fetched correct password:", password);
      return password;
    } catch (error) {
      console.error("Failed to fetch password:", error);
      throw error;
    }
  }

  function verifyPassword(password, correctPassword) {
    console.log("Verifying password:", password, "against:", correctPassword);
    const result = btoa(password) === correctPassword;
    console.log("Verification result:", result);
    return result;
  }

  function sendMessage(title, subtitle, body) {
    $notification.post(title, subtitle, body);
  }

  try {
    const userPassword = getStoredData("EricPassword");
    console.log("User password:", userPassword);
    
    const scriptEnabled = getStoredData("scriptvip");
    console.log("Script enabled status:", scriptEnabled);

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

    console.log("Current URL:", $request.url);

    // 请求模式匹配
    const requestPatterns = {
      "basic": /https:\/\/.*\.blued\.cn\/users\/\d+\/basic/,
      "more": /https:\/\/.*\.blued\.cn\/users\/\d+\/more\/ios.*/,
      // 其他模式...
    };

    let matchFound = false;
    for (let mode in requestPatterns) {
      if (requestPatterns[mode].test($request.url)) {
        console.log(`Matched request pattern: ${mode}`);
        matchFound = true;
        break;
      }
    }
    if (!matchFound) {
      console.log("No request pattern matched.");
      scriptDone({});
      return;
    }

    // 继续处理请求逻辑...
    // 这里可以添加你的请求处理代码

    // 例如，如果请求是basic模式，你可以修改响应数据
    if (requestPatterns["basic"].test($request.url)) {
      console.log("Processing basic request...");
      let body = JSON.parse($response.body);
      body.vip = true;
      body.expire_time = "2099-01-01";
      $done({body: JSON.stringify(body)});
    } else {
      // 其他请求模式的处理逻辑
      $done({});
    }

  } catch (error) {
    console.error("脚本执行出错:", error);
    scriptDone({});
  }
})();
