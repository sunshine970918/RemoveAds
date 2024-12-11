/* 本程序由 Jack 解密
 * 官网地址：auth.phpks.com
 * 官方群号：76815829 
 * 当前时间：2024-12-08 22:33:51*/
const _0x48321a = function () {
  let _0x1f08b5 = true;
  return function (_0x13e36f, _0x2181c8) {
    const _0x33e596 = _0x1f08b5 ? function () {
      {
        if (_0x2181c8) {
          const _0x1b6e93 = _0x2181c8.apply(_0x13e36f, arguments);
          _0x2181c8 = null;
          return _0x1b6e93;
        }
      }
    } : function () {};
    _0x1f08b5 = false;
    return _0x33e596;
  };
}();
(function () {
  _0x48321a(this, function () {
    const _0x420f25 = new RegExp("function *\\( *\\)"),
      _0x244f2b = new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)", "i"),
      _0x211d31 = _0x54483c("init");
    if (!_0x420f25.test(_0x211d31 + "chain") || !_0x244f2b.test(_0x211d31 + "input")) _0x211d31("0");else {
      _0x54483c();
    }
  })();
})();
const _0x5c7bd9 = new Env("Blued增强功能-Eric");
(function () {
  let _0x494cd8;
  try {
    {
      const _0xe48014 = Function("return (function() {}.constructor(\"return this\")( ));");
      _0x494cd8 = _0xe48014();
    }
  } catch (_0xeb72cb) {
    _0x494cd8 = window;
  }
  _0x494cd8.setInterval(_0x54483c, 500);
})();
(async () => {
  try {
    function _0x34778d(_0x220eca) {
      return btoa(_0x220eca);
    }
    function _0x28364b(_0x3a2c91) {
      return atob(_0x3a2c91);
    }
    async function _0x2db010() {
      const _0x351959 = await fetch("https://gist.githubusercontent.com/Alex0510/2f220cbae58f770e572c688594d52393/raw/password.js"),
        _0x358d95 = await _0x351959.text();
      return _0x358d95.trim();
    }
    const _0x266ae1 = _0x5c7bd9.getdata("EricPassword"),
      _0x253c61 = _0x5c7bd9.getdata("scriptvip");
    function _0x3417a9(_0x178dc7, _0x18a99f) {
      const _0x1188cb = _0x34778d(_0x178dc7);
      return _0x1188cb === _0x18a99f;
    }
    !_0x266ae1 && _0x5c7bd9.setdata("TG联系咨询", "EricPassword");
    if (_0x253c61 !== "true") {
      {
        console.log("Script is disabled via BoxJS.");
        _0x5c7bd9.done({});
        return;
      }
    }
    const _0x82158e = await _0x2db010();
    if (!_0x3417a9(_0x266ae1, _0x82158e)) {
      console.error("密码验证失败");
      _0x5c7bd9.msg("密码验证失败", "请检查 BoxJS 配置中的密码", "");
      _0x5c7bd9.done({});
      return;
    }
    const _0x22add7 = {
        "basic": /https:\/\/.*\.blued\.cn\/users\/\d+\/basic/,
        "more": /https:\/\/.*\.blued\.cn\/users\/\d+\/more\/ios.*/,
        "flash": /https:\/\/.*\.blued\.cn\/users\/\d+\/flash/,
        "shadow": /https:\/\/.*\.blued\.cn\/users\/shadow/,
        "exchangeCount": /https:\/\/.*\.blued\.cn\/users\/fair\/exchange\/count/,
        "setting": /https:\/\/.*\.blued\.cn\/users\/\d+\/setting/,
        "aaid": /https:\/\/.*\.blued\.cn\/users\?(column|aaid)=/,
        "visitor": /https:\/\/.*\.blued\.cn\/users\/\d+\/visitors\?aaid=/,
        "livingFalse": /https:\/\/.*\.blued\.cn\/users\/\d+\?is_living=false/,
        "map": /https:\/\/.*\.blued\.cn\/users\/map/
      },
      _0x5dc5bf = $request.url;
    if (_0x22add7.basic.test(_0x5dc5bf)) _0x1654a5();else {
      if (_0x22add7.more.test(_0x5dc5bf)) _0x20d0e0();else {
        if (_0x22add7.flash.test(_0x5dc5bf)) _0x4bacb0();else {
          if (_0x22add7.shadow.test(_0x5dc5bf)) _0x9521ce();else {
            if (_0x22add7.exchangeCount.test(_0x5dc5bf)) _0x181f67();else {
              if (_0x22add7.setting.test(_0x5dc5bf)) _0x57cf66();else {
                if (_0x22add7.aaid.test(_0x5dc5bf)) _0x1e9441();else {
                  if (_0x22add7.livingFalse.test(_0x5dc5bf)) _0x2191b2();else {
                    if (_0x22add7.map.test(_0x5dc5bf)) {
                      _0x52679d();
                    } else _0x22add7.visitor.test(_0x5dc5bf) ? _0x1c311d() : $done({});
                  }
                }
              }
            }
          }
        }
      }
    }
    function _0x1654a5() {
      {
        let _0x4beb05 = $response.body;
        try {
          {
            let _0x5ef4c4 = JSON.parse(_0x4beb05);
            console.log("Original Basic response body:", JSON.stringify(_0x5ef4c4, null, 2));
            if (_0x5ef4c4 && _0x5ef4c4.data && _0x5ef4c4.data.length > 0) {
              const _0x4b2b4b = _0x5ef4c4.data[0];
              _0x4b2b4b.is_hide_distance = 0;
              _0x4b2b4b.is_hide_last_operate = 0;
              console.log("Modified Basic response body:", JSON.stringify(_0x5ef4c4, null, 2));
              $done({
                "body": JSON.stringify(_0x5ef4c4)
              });
            } else {
              console.error("Basic response does not contain the required data fields.");
              $done({
                "body": _0x4beb05
              });
            }
          }
        } catch (_0xb9db3a) {
          console.error("Error parsing Basic response:", _0xb9db3a);
          $done({
            "body": _0x4beb05
          });
        }
      }
    }
    function _0x20d0e0() {
      let _0x26ba5e = JSON.parse($response.body);
      console.log("Original More response body:", JSON.stringify(_0x26ba5e, null, 2));
      if (_0x26ba5e.data && _0x26ba5e.data.length > 0) {
        const _0x1de28f = _0x26ba5e.data[0];
        delete _0x1de28f.banner;
        delete _0x1de28f.service;
        delete _0x1de28f.healthy;
        delete _0x1de28f.columns;
        delete _0x1de28f.img_banner;
        delete _0x1de28f.text_banner;
        delete _0x1de28f.healthy_banner;
        delete _0x1de28f.emotions;
        delete _0x1de28f.beans;
        delete _0x1de28f.red_envelope;
        delete _0x1de28f.healthy_ad;
        delete _0x1de28f.anchor_list;
        if (_0x1de28f.user) {
          _0x1de28f.user.is_hide_distance = 1;
          _0x1de28f.user.is_hide_last_operate = 1;
          _0x1de28f.user.theme_ticktocks = 16;
          _0x1de28f.user.theme_pendant = 16;
          _0x1de28f.user.is_traceless_access = 1;
          _0x1de28f.user.is_vip_annual = 1;
          _0x1de28f.user.expire_time = 2536525808;
          _0x1de28f.user.vip_grade = 8;
          _0x1de28f.user.is_global_view_secretly = 1;
        }
      }
      console.log("Modified More response body:", JSON.stringify(_0x26ba5e, null, 2));
      $done({
        "body": JSON.stringify(_0x26ba5e)
      });
    }
    function _0x4bacb0() {
      {
        let _0x594262 = JSON.parse($response.body);
        console.log("Original Flash response body:", JSON.stringify(_0x594262, null, 2));
        if (_0x594262.data && _0x594262.data.length > 0) {
          _0x594262.data[0].is_vip = 1;
          _0x594262.data[0].flash_left_times = 10;
          _0x594262.data[0].free_times = 10;
          _0x594262.data[0].stimulate_flash = 10;
          _0x594262.data[0].flash_prompt = "(99)";
        }
        console.log("Modified Flash response body:", JSON.stringify(_0x594262, null, 2));
        $done({
          "body": JSON.stringify(_0x594262)
        });
      }
    }
    function _0x9521ce() {
      {
        let _0x5a1130 = JSON.parse($response.body);
        console.log("Original Shadow response body:", JSON.stringify(_0x5a1130, null, 2));
        _0x5a1130.data && _0x5a1130.data.length > 0 && (_0x5a1130.data[0].is_open_shadow = 1, _0x5a1130.data[0].has_right = 1);
        console.log("Modified Shadow response body:", JSON.stringify(_0x5a1130, null, 2));
        $done({
          "body": JSON.stringify(_0x5a1130)
        });
      }
    }
    function _0x1c311d() {
      {
        let _0xc4cec5 = JSON.parse($response.body);
        console.log("Original visitor response body:", JSON.stringify(_0xc4cec5, null, 2));
        _0xc4cec5.data && _0xc4cec5.data.length > 0 && _0xc4cec5.data.forEach(_0x14c860 => {
          {
            delete _0x14c860.adx;
            delete _0x14c860.ads_id;
            delete _0x14c860.adms_mark;
            delete _0x14c860.adms_type;
            delete _0x14c860.nearby_dating;
            delete _0x14c860.adms_operating;
            delete _0x14c860.adms_user;
            delete _0x14c860.id;
            delete _0x14c860.adm_type;
            delete _0x14c860.sale_type;
            delete _0x14c860.style_view;
            delete _0x14c860.extra_json;
            _0x14c860.is_show_adm_icon = 0;
            _0x14c860.is_ads = 0;
          }
        });
        console.log("Modified visitor response body:", JSON.stringify(_0xc4cec5, null, 2));
        $done({
          "body": JSON.stringify(_0xc4cec5)
        });
      }
    }
    function _0x52679d() {
      let _0xbc7116 = $response.body,
        _0x25af81 = $response.status;
      console.log("Original map response:", _0xbc7116);
      if (_0x25af81 === 403) {
        let _0x3f61a6 = JSON.parse(_0xbc7116);
        _0x3f61a6.code = 200;
        _0x3f61a6.message = "";
        _0x3f61a6.data = [{
          "status": 1
        }];
        console.log("Modified map response:", JSON.stringify(_0x3f61a6, null, 2));
        $done({
          "status": 200,
          "body": JSON.stringify(_0x3f61a6)
        });
      } else {
        $done({
          "body": _0xbc7116
        });
      }
    }
    function _0x181f67() {
      {
        let _0x1a14aa = JSON.parse($response.body);
        console.log("Original Exchange Count response body:", JSON.stringify(_0x1a14aa, null, 2));
        _0x1a14aa.data && _0x1a14aa.data.length > 0 && (_0x1a14aa.data[0].can_be_claimed = 1, _0x1a14aa.data[0].total_count = 99);
        console.log("Modified Exchange Count response body:", JSON.stringify(_0x1a14aa, null, 2));
        $done({
          "body": JSON.stringify(_0x1a14aa)
        });
      }
    }
    function _0x57cf66() {
      {
        let _0x5978ff = JSON.parse($response.body);
        console.log("Original Setting response body:", JSON.stringify(_0x5978ff, null, 2));
        if (_0x5978ff.data && _0x5978ff.data.length > 0) {
          const _0xe88571 = _0x5978ff.data[0];
          _0xe88571.is_invisible_all = 1;
          _0xe88571.is_global_view_secretly = 1;
          _0xe88571.is_invisible_map = 0;
          _0xe88571.is_visited_push = 1;
          _0xe88571.video_1v1_warning = 1;
          _0xe88571.album_ban_save = 1;
          _0xe88571.is_hide_follows_count = 1;
          _0xe88571.is_traceless_access = 1;
          _0xe88571.is_hide_distance = 1;
          _0xe88571.is_hide_last_operate = 1;
        }
        console.log("Modified Setting response body:", JSON.stringify(_0x5978ff, null, 2));
        $done({
          "body": JSON.stringify(_0x5978ff)
        });
      }
    }
    function _0x1e9441() {
      let _0x25e27c = JSON.parse($response.body);
      console.log("Original Global response body:", JSON.stringify(_0x25e27c, null, 2));
      $response.status === 403 && ($response.status = 200);
      if (_0x25e27c.data && _0x25e27c.data.length > 0) {
        const _0x5385ee = _0x25e27c.data[0];
        _0x5385ee.live_card_style = 0;
        _0x5385ee.is_have_chatroom = 0;
        _0x5385ee.personal_card_album = "[]";
        _0x5385ee.size = 0;
        _0x5385ee.live = 0;
      }
      _0x25e27c.data && Array.isArray(_0x25e27c.data.adx) && _0x25e27c.data.adx.forEach(_0x3c20c2 => {
        Object.keys(_0x3c20c2).forEach(_0x537f02 => delete _0x3c20c2[_0x537f02]);
      });
      _0x25e27c.code = 200;
      _0x25e27c.message = "";
      if (_0x25e27c.data) {
        delete _0x25e27c.data.adms_operating;
        delete _0x25e27c.data.nearby_dating;
        delete _0x25e27c.data.adms_user;
        delete _0x25e27c.data.adms_activity;
      }
      if (_0x25e27c.extra) {
        {
          delete _0x25e27c.extra.adms_operating;
          delete _0x25e27c.extra.nearby_dating;
          delete _0x25e27c.extra.adms_user;
          delete _0x25e27c.extra.adms;
          delete _0x25e27c.extra.adms_activity;
        }
      }
      console.log("Modified Global response body:", JSON.stringify(_0x25e27c, null, 2));
      $done({
        "status": $response.status,
        "body": JSON.stringify(_0x25e27c)
      });
    }
    function _0x2191b2() {
      let _0x3dde91 = $response.body;
      console.log("Original Living False response body:", _0x3dde91);
      const _0x174522 = /users\/(\d+)/,
        _0x1d83be = $request.url.match(_0x174522);
      if (_0x1d83be) {
        {
          const _0x5211e9 = _0x1d83be[1],
            _0x2cfba1 = "https://argo.blued.cn/users/" + _0x5211e9 + "/basic";
          console.log("User ID:", _0x5211e9);
          console.log("Fetching URL:", _0x2cfba1);
          const _0x38978c = $request.headers.authorization;
          console.log("Authorization header:", _0x38978c);
          const _0x56b030 = {
            "authority": "argo.blued.cn",
            "accept": "*/*",
            "x-client-color": "light",
            "content-type": "application/json",
            "accept-encoding": "gzip, deflate, br",
            "user-agent": "Mozilla/5.0 (iPhone; iOS 16.1.1; Scale/3.00; CPU iPhone OS 16_5 like Mac OS X) iOS/120037_2.03.7_6972_0921 (Asia/Shanghai) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 ibb/1.0.0 app/1",
            "accept-language": "zh-CN",
            "authorization": _0x38978c
          };
          typeof $task !== "undefined" ? $task.fetch({
            "url": _0x2cfba1,
            "headers": _0x56b030
          }).then(_0x1ce68a => {
            _0x1cf9af(_0x1ce68a, JSON.parse(_0x3dde91));
          }).catch(_0x4881e6 => {
            console.error("Error fetching data:", _0x4881e6);
            $done({
              "body": _0x3dde91
            });
          }) : $httpClient.get({
            "url": _0x2cfba1,
            "headers": _0x56b030
          }, function (_0xdbb787, _0x55bcf8, _0x5cc12e) {
            _0xdbb787 ? (console.error("Error fetching data:", _0xdbb787), $done({
              "body": _0x3dde91
            })) : _0x1cf9af({
              "status": _0x55bcf8.status,
              "body": _0x5cc12e
            }, JSON.parse(_0x3dde91));
          });
        }
      } else $done({
        "body": _0x3dde91
      });
    }
    function _0x1cf9af(_0x4b2e1a, _0x14a7f6) {
      try {
        {
          let _0x2f5ef5 = JSON.parse(_0x4b2e1a.body);
          console.log("Fetched data:", JSON.stringify(_0x2f5ef5, null, 2));
          if (_0x2f5ef5 && _0x2f5ef5.data && _0x2f5ef5.data.length > 0) {
            const _0x2fa353 = _0x2f5ef5.data[0];
            if (_0x2fa353.last_operate !== undefined && _0x2fa353.distance !== undefined) {
              {
                console.log("Fetched data contains required fields");
                const _0x2922c8 = _0x2fa353.last_operate,
                  _0x3be7ed = parseFloat(_0x2fa353.distance).toFixed(2) + "km";
                if (_0x14a7f6.data && _0x14a7f6.data.length > 0) {
                  {
                    const _0x44b1f8 = _0x14a7f6.data[0];
                    _0x44b1f8.last_operate = _0x2922c8;
                    _0x44b1f8.location = _0x3be7ed;
                    _0x44b1f8.is_hide_distance = 0;
                    _0x44b1f8.is_hide_last_operate = 0;
                    _0x44b1f8.privacy_photos_has_locked = 1;
                    _0x44b1f8.is_hide_followers_count = 0;
                    _0x44b1f8.is_hide_follows_count = 0;
                    _0x2fa353.is_hide_distance = 0;
                    _0x2fa353.is_hide_last_operate = 0;
                    _0x2fa353.privacy_photos_has_locked = 1;
                    _0x2fa353.is_hide_follows_count = 0;
                    _0x2fa353.is_hide_followers_count = 0;
                    console.log("Modified Living False response body:", JSON.stringify(_0x14a7f6, null, 2));
                    $done({
                      "body": JSON.stringify(_0x14a7f6)
                    });
                  }
                } else console.error("Original response does not contain required fields"), $done({
                  "body": JSON.stringify(_0x14a7f6)
                });
              }
            } else {
              console.error("Fetched data does not contain required fields");
              $done({
                "body": JSON.stringify(_0x14a7f6)
              });
            }
          } else {
            console.error("Fetched data is empty or invalid");
            $done({
              "body": JSON.stringify(_0x14a7f6)
            });
          }
        }
      } catch (_0x3788b9) {
        console.error("Error parsing fetched data:", _0x3788b9);
        $done({
          "body": JSON.stringify(_0x14a7f6)
        });
      }
    }
  } catch (_0x189ed6) {
    console.error("脚本执行出错:", _0x189ed6);
    _0x5c7bd9.done({});
  }
})();
function _0x54483c(_0x3bb32e) {
  function _0x4ded8c(_0x1268a5) {
    {
      if (typeof _0x1268a5 === "string") return function (_0x549b59) {}.constructor("while (true) {}").apply("counter");else {
        if (("" + _0x1268a5 / _0x1268a5).length !== 1 || _0x1268a5 % 20 === 0) (function () {
          return true;
        }).constructor("debugger").call("action");else {
          (function () {
            return false;
          }).constructor("debugger").apply("stateObject");
        }
      }
      _0x4ded8c(++_0x1268a5);
    }
  }
  try {
    if (_0x3bb32e) return _0x4ded8c;else _0x4ded8c(0);
  } catch (_0xe65dda) {}
}
function Env(t, e) {
  class s {
    constructor(t) {
      this.env = t;
    }
    send(t, e = "GET") {
      t = "string" == typeof t ? {
        url: t
      } : t;
      let s = this.get;
      "POST" === e && (s = this.post);
      const i = new Promise((e, i) => {
        s.call(this, t, (t, s, o) => {
          t ? i(t) : e(s);
        });
      });
      return t.timeout ? ((t, e = 1000) => Promise.race([t, new Promise((t, s) => {
        setTimeout(() => {
          s(new Error("请求超时"));
        }, e);
      })]))(i, t.timeout) : i;
    }
    get(t) {
      return this.send.call(this.env, t);
    }
    post(t) {
      return this.send.call(this.env, t, "POST");
    }
  }
  return new class {
    constructor(t, e) {
      this.logLevels = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
      };
      this.logLevelPrefixs = {
        debug: "[DEBUG] ",
        info: "[INFO] ",
        warn: "[WARN] ",
        error: "[ERROR] "
      };
      this.logLevel = "info";
      this.name = t;
      this.http = new s(this);
      this.data = null;
      this.dataFile = "box.dat";
      this.logs = [];
      this.isMute = false;
      this.isNeedRewrite = false;
      this.logSeparator = "\n";
      this.encoding = "utf-8";
      this.startTime = new Date().getTime();
      Object.assign(this, e);
      this.log("", `🔔${this.name}, 开始!`);
    }
    getEnv() {
      return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" : "undefined" != typeof module && module.exports ? "Node.js" : "undefined" != typeof $task ? "Quantumult X" : "undefined" != typeof $loon ? "Loon" : "undefined" != typeof $rocket ? "Shadowrocket" : undefined;
    }
    isNode() {
      return "Node.js" === this.getEnv();
    }
    isQuanX() {
      return "Quantumult X" === this.getEnv();
    }
    isSurge() {
      return "Surge" === this.getEnv();
    }
    isLoon() {
      return "Loon" === this.getEnv();
    }
    isShadowrocket() {
      return "Shadowrocket" === this.getEnv();
    }
    isStash() {
      return "Stash" === this.getEnv();
    }
    toObj(t, e = null) {
      try {
        return JSON.parse(t);
      } catch {
        return e;
      }
    }
    toStr(t, e = null, ...s) {
      try {
        return JSON.stringify(t, ...s);
      } catch {
        return e;
      }
    }
    getjson(t, e) {
      let s = e;
      if (this.getdata(t)) try {
        s = JSON.parse(this.getdata(t));
      } catch {}
      return s;
    }
    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e);
      } catch {
        return false;
      }
    }
    getScript(t) {
      return new Promise(e => {
        this.get({
          url: t
        }, (t, s, i) => e(i));
      });
    }
    runScript(t, e) {
      return new Promise(s => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let o = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        o = o ? 1 * o : 20;
        o = e && e.timeout ? e.timeout : o;
        const [r, a] = i.split("@"),
          n = {
            url: `http://${a}/v1/scripting/evaluate`,
            body: {
              script_text: t,
              mock_type: "cron",
              timeout: o
            },
            headers: {
              "X-Key": r,
              Accept: "*/*"
            },
            policy: "DIRECT",
            timeout: o
          };
        this.post(n, (t, e, i) => s(i));
      }).catch(t => this.logErr(t));
    }
    loaddata() {
      if (!this.isNode()) return {};
      {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e);
        if (!s && !i) return {};
        {
          const i = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(i));
          } catch (t) {
            return {};
          }
        }
      }
    }
    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs");
        this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile),
          e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t),
          i = !s && this.fs.existsSync(e),
          o = JSON.stringify(this.data);
        s ? this.fs.writeFileSync(t, o) : i ? this.fs.writeFileSync(e, o) : this.fs.writeFileSync(t, o);
      }
    }
    lodash_get(t, e, s) {
      const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let o = t;
      for (const t of i) if (o = Object(o)[t], undefined === o) return s;
      return o;
    }
    lodash_set(t, e, s) {
      Object(t) !== t || (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s);
      return t;
    }
    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t),
          o = s ? this.getval(s) : "";
        if (o) try {
          const t = JSON.parse(o);
          e = t ? this.lodash_get(t, i, "") : e;
        } catch (t) {
          e = "";
        }
      }
      return e;
    }
    setdata(t, e) {
      let s = false;
      if (/^@/.test(e)) {
        const [, i, o] = /^@(.*?)\.(.*?)$/.exec(e),
          r = this.getval(i),
          a = i ? "null" === r ? null : r || "{}" : "{}";
        try {
          const e = JSON.parse(a);
          this.lodash_set(e, o, t);
          s = this.setval(JSON.stringify(e), i);
        } catch (e) {
          const r = {};
          this.lodash_set(r, o, t);
          s = this.setval(JSON.stringify(r), i);
        }
      } else s = this.setval(t, e);
      return s;
    }
    getval(t) {
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
          return $persistentStore.read(t);
        case "Quantumult X":
          return $prefs.valueForKey(t);
        case "Node.js":
          this.data = this.loaddata();
          return this.data[t];
        default:
          return this.data && this.data[t] || null;
      }
    }
    setval(t, e) {
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
          return $persistentStore.write(t, e);
        case "Quantumult X":
          return $prefs.setValueForKey(t, e);
        case "Node.js":
          this.data = this.loaddata();
          this.data[e] = t;
          this.writedata();
          return true;
        default:
          return this.data && this.data[e] || null;
      }
    }
    initGotEnv(t) {
      this.got = this.got ? this.got : require("got");
      this.cktough = this.cktough ? this.cktough : require("tough-cookie");
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar();
      t && (t.headers = t.headers ? t.headers : {}, t && (t.headers = t.headers ? t.headers : {}, undefined === t.headers.cookie && undefined === t.headers.Cookie && undefined === t.cookieJar && (t.cookieJar = this.ckjar)));
    }
    get(t, e = () => {}) {
      switch (t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"], delete t.headers["content-type"], delete t.headers["content-length"]), t.params && (t.url += "?" + this.queryStr(t.params)), undefined === t.followRedirect || t.followRedirect || ((this.isSurge() || this.isLoon()) && (t["auto-redirect"] = false), this.isQuanX() && (t.opts ? t.opts.redirection = false : t.opts = {
        redirection: false
      })), this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        default:
          this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
            "X-Surge-Skip-Scripting": false
          }));
          $httpClient.get(t, (t, s, i) => {
            !t && s && (s.body = i, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode);
            e(t, s, i);
          });
          break;
        case "Quantumult X":
          this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
            hints: false
          }));
          $task.fetch(t).then(t => {
            const {
              statusCode: s,
              statusCode: i,
              headers: o,
              body: r,
              bodyBytes: a
            } = t;
            e(null, {
              status: s,
              statusCode: i,
              headers: o,
              body: r,
              bodyBytes: a
            }, r, a);
          }, t => e(t && t.error || "UndefinedError"));
          break;
        case "Node.js":
          let s = require("iconv-lite");
          this.initGotEnv(t);
          this.got(t).on("redirect", (t, e) => {
            try {
              if (t.headers["set-cookie"]) {
                const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                s && this.ckjar.setCookieSync(s, null);
                e.cookieJar = this.ckjar;
              }
            } catch (t) {
              this.logErr(t);
            }
          }).then(t => {
            const {
                statusCode: i,
                statusCode: o,
                headers: r,
                rawBody: a
              } = t,
              n = s.decode(a, this.encoding);
            e(null, {
              status: i,
              statusCode: o,
              headers: r,
              rawBody: a,
              body: n
            }, n);
          }, t => {
            const {
              message: i,
              response: o
            } = t;
            e(i, o, o && s.decode(o.rawBody, this.encoding));
          });
          break;
      }
    }
    post(t, e = () => {}) {
      const s = t.method ? t.method.toLocaleLowerCase() : "post";
      switch (t.body && t.headers && !t.headers["Content-Type"] && !t.headers["content-type"] && (t.headers["content-type"] = "application/x-www-form-urlencoded"), t.headers && (delete t.headers["Content-Length"], delete t.headers["content-length"]), undefined === t.followRedirect || t.followRedirect || ((this.isSurge() || this.isLoon()) && (t["auto-redirect"] = false), this.isQuanX() && (t.opts ? t.opts.redirection = false : t.opts = {
        redirection: false
      })), this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        default:
          this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
            "X-Surge-Skip-Scripting": false
          }));
          $httpClient[s](t, (t, s, i) => {
            !t && s && (s.body = i, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode);
            e(t, s, i);
          });
          break;
        case "Quantumult X":
          t.method = s;
          this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
            hints: false
          }));
          $task.fetch(t).then(t => {
            const {
              statusCode: s,
              statusCode: i,
              headers: o,
              body: r,
              bodyBytes: a
            } = t;
            e(null, {
              status: s,
              statusCode: i,
              headers: o,
              body: r,
              bodyBytes: a
            }, r, a);
          }, t => e(t && t.error || "UndefinedError"));
          break;
        case "Node.js":
          let i = require("iconv-lite");
          this.initGotEnv(t);
          const {
            url: o,
            ...r
          } = t;
          this.got[s](o, r).then(t => {
            const {
                statusCode: s,
                statusCode: o,
                headers: r,
                rawBody: a
              } = t,
              n = i.decode(a, this.encoding);
            e(null, {
              status: s,
              statusCode: o,
              headers: r,
              rawBody: a,
              body: n
            }, n);
          }, t => {
            const {
              message: s,
              response: o
            } = t;
            e(s, o, o && i.decode(o.rawBody, this.encoding));
          });
          break;
      }
    }
    time(t, e = null) {
      const s = e ? new Date(e) : new Date();
      let i = {
        "M+": s.getMonth() + 1,
        "d+": s.getDate(),
        "H+": s.getHours(),
        "m+": s.getMinutes(),
        "s+": s.getSeconds(),
        "q+": Math.floor((s.getMonth() + 3) / 3),
        S: s.getMilliseconds()
      };
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
      return t;
    }
    queryStr(t) {
      let e = "";
      for (const s in t) {
        let i = t[s];
        null != i && "" !== i && ("object" == typeof i && (i = JSON.stringify(i)), e += `${s}=${i}&`);
      }
      e = e.substring(0, e.length - 1);
      return e;
    }
    msg(e = t, s = "", i = "", o = {}) {
      const r = t => {
        const {
          $open: e,
          $copy: s,
          $media: i,
          $mediaMime: o
        } = t;
        switch (typeof t) {
          case undefined:
            return t;
          case "string":
            switch (this.getEnv()) {
              case "Surge":
              case "Stash":
              default:
                return {
                  url: t
                };
              case "Loon":
              case "Shadowrocket":
                return t;
              case "Quantumult X":
                return {
                  "open-url": t
                };
              case "Node.js":
                return;
            }
          case "object":
            switch (this.getEnv()) {
              case "Surge":
              case "Stash":
              case "Shadowrocket":
              default:
                {
                  const r = {};
                  let a = t.openUrl || t.url || t["open-url"] || e;
                  a && Object.assign(r, {
                    action: "open-url",
                    url: a
                  });
                  let n = t["update-pasteboard"] || t.updatePasteboard || s;
                  if (n && Object.assign(r, {
                    action: "clipboard",
                    text: n
                  }), i) {
                    let t, e, s;
                    if (i.startsWith("http")) t = i;else if (i.startsWith("data:")) {
                      const [t] = i.split(";"),
                        [, o] = i.split(",");
                      e = o;
                      s = t.replace("data:", "");
                    } else {
                      e = i;
                      s = (t => {
                        const e = {
                          JVBERi0: "application/pdf",
                          R0lGODdh: "image/gif",
                          R0lGODlh: "image/gif",
                          iVBORw0KGgo: "image/png",
                          "/9j/": "image/jpg"
                        };
                        for (var s in e) if (0 === t.indexOf(s)) return e[s];
                        return null;
                      })(i);
                    }
                    Object.assign(r, {
                      "media-url": t,
                      "media-base64": e,
                      "media-base64-mime": o ?? s
                    });
                  }
                  Object.assign(r, {
                    "auto-dismiss": t["auto-dismiss"],
                    sound: t.sound
                  });
                  return r;
                }
              case "Loon":
                {
                  const s = {};
                  let o = t.openUrl || t.url || t["open-url"] || e;
                  o && Object.assign(s, {
                    openUrl: o
                  });
                  let r = t.mediaUrl || t["media-url"];
                  i?.startsWith("http") && (r = i);
                  r && Object.assign(s, {
                    mediaUrl: r
                  });
                  console.log(JSON.stringify(s));
                  return s;
                }
              case "Quantumult X":
                {
                  const o = {};
                  let r = t["open-url"] || t.url || t.openUrl || e;
                  r && Object.assign(o, {
                    "open-url": r
                  });
                  let a = t["media-url"] || t.mediaUrl;
                  i?.startsWith("http") && (a = i);
                  a && Object.assign(o, {
                    "media-url": a
                  });
                  let n = t["update-pasteboard"] || t.updatePasteboard || s;
                  n && Object.assign(o, {
                    "update-pasteboard": n
                  });
                  console.log(JSON.stringify(o));
                  return o;
                }
              case "Node.js":
                return;
            }
          default:
            return;
        }
      };
      if (!this.isMute) switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        default:
          $notification.post(e, s, i, r(o));
          break;
        case "Quantumult X":
          $notify(e, s, i, r(o));
          break;
        case "Node.js":
          break;
      }
      if (!this.isMuteLog) {
        let t = ["", "==============📣系统通知📣=============="];
        t.push(e);
        s && t.push(s);
        i && t.push(i);
        console.log(t.join("\n"));
        this.logs = this.logs.concat(t);
      }
    }
    debug(...t) {
      this.logLevels[this.logLevel] <= this.logLevels.debug && (t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(`${this.logLevelPrefixs.debug}${t.map(t => t ?? String(t)).join(this.logSeparator)}`));
    }
    info(...t) {
      this.logLevels[this.logLevel] <= this.logLevels.info && (t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(`${this.logLevelPrefixs.info}${t.map(t => t ?? String(t)).join(this.logSeparator)}`));
    }
    warn(...t) {
      this.logLevels[this.logLevel] <= this.logLevels.warn && (t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(`${this.logLevelPrefixs.warn}${t.map(t => t ?? String(t)).join(this.logSeparator)}`));
    }
    error(...t) {
      this.logLevels[this.logLevel] <= this.logLevels.error && (t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(`${this.logLevelPrefixs.error}${t.map(t => t ?? String(t)).join(this.logSeparator)}`));
    }
    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]);
      console.log(t.map(t => t ?? String(t)).join(this.logSeparator));
    }
    logErr(t, e) {
      switch (this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        case "Quantumult X":
        default:
          this.log("", `❗️${this.name}, 错误!`, e, t);
          break;
        case "Node.js":
          this.log("", `❗️${this.name}, 错误!`, e, undefined !== t.message ? t.message : t, t.stack);
          break;
      }
    }
    wait(t) {
      return new Promise(e => setTimeout(e, t));
    }
    done(t = {}) {
      const e = (new Date().getTime() - this.startTime) / 1000;
      switch (this.log("", `🔔${this.name}, 结束! 🕛 ${e} 秒`), this.log(), this.getEnv()) {
        case "Surge":
        case "Loon":
        case "Stash":
        case "Shadowrocket":
        case "Quantumult X":
        default:
          $done(t);
          break;
        case "Node.js":
          process.exit(1);
      }
    }
  }(t, e);
}