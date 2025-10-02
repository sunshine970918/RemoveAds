// ==UserScript==
// @name         Blued 图片助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  捕获 Blued 图片并通知跳转
// @author       Eric
// @match        *://*.blued.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建 Env 实例（原通知模块）
    const env = new Env("Blued图片助手");

    // 主流程
    async function main() {
        try {
            env.log("🔔Blued 图片助手, 开始!");

            // 示例：获取页面图片列表
            const images = document.querySelectorAll('img'); // 可替换为具体选择器
            for (let i = 0; i < images.length; i++) {
                const imgUrl = images[i].src;
                if (imgUrl) {
                    env.log(`捕获到图片链接: ${imgUrl}`);

                    // **原代码通知模块**
                    env.msg("Blued 图片助手", "成功捕获图片链接", imgUrl, {
                        "open-url": imgUrl,
                        "media-url": imgUrl
                    });
                }
            }

            env.log("🔔Blued 图片助手, 完成!");
        } catch (e) {
            env.log("❌捕获图片异常:", e);
        }
    }

    // 执行主流程
    main();

    // 原 Env 类（保留原通知方法）
    function Env(name) {
        this.name = name;
        this.log = function(...args) {
            console.log(`[${this.name}]`, ...args);
        };
        this.msg = function(title, subtitle, body, options = {}) {
            console.log(`[通知] ${title} - ${subtitle}: ${body}`, options);
            // Surge / Loon / Quantumult X 原生跳转支持
            if (typeof $notification !== 'undefined') {
                $notification.post(title, subtitle, body, options);
            }
        };
    }
})();
