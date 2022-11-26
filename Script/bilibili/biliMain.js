// 2022-11-26 14:25

var url = $request.url;
var body = $response.body;

if (!body) {
  $done({});
}

// 去除强制设置的皮肤
if (url.includes('app.bilibili.com/x/resource/show/skin?')) {
  let obj = JSON.parse(body);
  if (obj && obj.hasOwnProperty('data')) obj['data']['common_equip'] = {};
  body = JSON.stringify(obj);
}

// 标签页处理，如去除会员购等等
if (url.includes('app.bilibili.com/x/resource/show/tab')) {
  // 39直播 40推荐 41热门 545追番 151影视 442动画, 99直播 100推荐 101热门 554动画
  // 442开始为概念版id，适配港澳台代理模式
  const tabList = new Set([39, 40, 41, 151]);
  // 尝试使用tab name直观修改
  // const tabNameList = new Set(['直播', '推荐', '热门', '影视']);
  // if (obj['data']['tab']) {
  //   let tab = obj['data']['tab'].filter((e) => {
  //     return tabNameList.has(e.name) || tabList.has(e.id);
  //   });
  //   obj['data']['tab'] = tab;
  // }
  // 222游戏中心 107概念版游戏中心 176消息中心
  const topList = new Set([176]);
  // 标准版
  // 177首页 178频道 179动态 181我的
  // 概念版
  // 102首页 103频道 104动态 106我的
  // 港澳台
  // 486首页 487频道 488动态 490我的
  // 102开始为概念版id
  const bottomList = new Set([177, 179, 181]);
  let obj = JSON.parse(body);
  if (obj['data']['tab']) {
    let tab = obj['data']['tab'].filter((e) => {
      return tabList.has(e.id);
    });
    obj['data']['tab'] = tab;
  }
  if (obj['data']['top']) {
    let top = obj['data']['top'].filter((e) => {
      return topList.has(e.id);
    });
    obj['data']['top'] = top;
  }
  if (obj['data']['bottom']) {
    let bottom = obj['data']['bottom'].filter((e) => {
      return bottomList.has(e.id);
    });
    obj['data']['bottom'] = bottom;
  }
  body = JSON.stringify(obj);
}

// 去除右上角活动入口
if (url.includes('app.bilibili.com/x/resource/top/activity?')) {
  let obj = JSON.parse(body);
  if (obj.data && obj.data.hash && obj.data.online.icon) {
    obj.data.hash = '';
    obj.data.online.icon = '';
  }
  body = JSON.stringify(obj);
}

// 我的页面处理，去除一些推广按钮
if (url.includes('app.bilibili.com/x/v2/account/mine?')) {
  let obj = JSON.parse(body);
  // 标准版：
  // 396离线缓存 397历史记录 398我的收藏 399稍后再看 171个性装扮 172我的钱包 407联系客服 410设置
  // 港澳台：
  // 534离线缓存 8历史记录 4我的收藏 428稍后再看
  // 352离线缓存 1历史记录 405我的收藏 402个性装扮 404我的钱包 544创作中心
  // 概念版：
  // 425离线缓存 426历史记录 427我的收藏 428稍后再看 171创作中心 430我的钱包 431联系客服 432设置
  // 国际版：
  // 494离线缓存 495历史记录 496我的收藏 497稍后再看 741我的钱包 742稿件管理 500联系客服 501设置
  // 622为会员购中心 425开始为概念版id
  const itemList = new Set([396, 397, 398, 399]);
  obj['data']['sections_v2']?.forEach((element, index) => {
    let items = element['items'].filter((e) => {
      return itemList.has(e.id);
    });
    obj["data"]["sections_v2"][index].button = {};
    delete obj['data']['sections_v2'][index].be_up_title;
    delete obj['data']['sections_v2'][index].tip_icon;
    delete obj['data']['sections_v2'][index].tip_title;
    for (let i = 0; i < obj["data"]["sections_v2"].length; i++) {
      if (obj.data.sections_v2[i].title === '推荐服务') {
        delete obj.data.sections_v2[i].title;
        delete obj.data.sections_v2[i].type;
      }      
      if (obj.data.sections_v2[i].title === '更多服务') {
        delete obj.data.sections_v2[i].title;
        delete obj.data.sections_v2[i].type;
      }
      if (obj.data.sections_v2[i].title === '创作中心') {
        delete obj.data.sections_v2[i].title;
        delete obj.data.sections_v2[i].type;
      }
    }
    obj['data']['sections_v2'][index]['items'] = items;
    // 开启本地会员标识 2022-03-05 add by ddgksf2013
    delete obj.data.vip_section_v2;
    delete obj.data.vip_section;
    if (obj.data.hasOwnProperty('live_tip')) obj["data"]["live_tip"] = {};
    if (obj.data.hasOwnProperty('answer')) obj["data"]["answer"] = {};
    obj['data']['vip_type'] = 2;
    obj['data']['vip']['type'] = 2;
    obj['data']['vip']['status'] = 1;
    obj['data']['vip']['vip_pay_type'] = 1;
    obj['data']['vip']['due_date'] = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
  });
  body = JSON.stringify(obj);
}

// 解锁1080p高码率 2022-03-05 add by ddgksf2013
if (url.includes('app.bilibili.com/x/v2/account/myinfo?')) {
  let obj = JSON.parse(body);
  obj['data']['vip']['type'] = 2;
  obj['data']['vip']['status'] = 1;
  obj['data']['vip']['vip_pay_type'] = 1;
  obj['data']['vip']['due_date'] = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
  body = JSON.stringify(obj);
}

// 推荐广告处理 最后问号不能去掉 以免匹配到story模式
if (url.includes('app.bilibili.com/x/v2/feed/index?')) {
  let obj = JSON.parse(body);
  let items = [];
  for (let item of obj["data"]["items"]) {
    if (item.hasOwnProperty("banner_item")) {
      continue;
    } else if (!item.hasOwnProperty("ad_info") && item.card_goto.indexOf("ad") === -1 && (item["card_type"] === "small_cover_v2" || item["card_type"] === "large_cover_v1")) {
      items.push(item);
    }
  }
  obj["data"]["items"] = items;
  body = JSON.stringify(obj);
}

// 开屏广告处理
if (url.includes('app.bilibili.com/x/v2/splash/list?')) {
  let obj = JSON.parse(body);
  if (obj.data && obj.data.show) delete obj.data.show;
  body = JSON.stringify(obj);
}

// 热搜去广告
if (url.includes('app.bilibili.com/x/v2/search/square?')) {
  let obj = JSON.parse(body);
  if (obj.data) delete obj.data;
  body = JSON.stringify(obj);
}

// 观影页去广告
if (url.includes('api.bilibili.com/pgc/page/cinema/tab?')) {
  let obj = JSON.parse(body);
  obj.result.modules?.forEach((module) => {
    // 头部banner
    if (module.style.startsWith('banner')) {
      module.items = module.items.filter((i) => !(i.source_content && i.source_content.ad_content));
    }
  });
  body = JSON.stringify(obj);
}

// 直播去广告
if (url.includes('api.live.bilibili.com/xlive/app-room/v1/index/getInfoByRoom')) {
  let obj = JSON.parse(body);
  if (obj.data.activity_banner_info) obj["data"]["activity_banner_info"] = null;
  body = JSON.stringify(obj);
}

$done({body});
