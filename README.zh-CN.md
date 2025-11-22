简体中文 | [English](./README.md)

<div align="center">
<h1>site-status</h1>
<p>一个基于 UptimeRobot API 的在线站点状态面板</p>
<br />
<img src="https://img.shields.io/github/last-commit/inswan/site-status" alt="最后提交"/>
<img src="https://img.shields.io/github/languages/code-size/inswan/site-status" alt="代码体积"/>
<img src="https://img.shields.io/github/stars/inswan/site-status?style=social" alt="GitHub stars"/>
<img src="https://img.shields.io/github/forks/inswan/site-status?style=social&color=orange" alt="GitHub forks"/>
<br />
<br />
</div>

## 👀 在线演示

- [InsWan 的站点状态页](https://status.inswan.fun/)

## 🎉 特色功能

- 🌍 支持多平台部署（Vercel / Cloudflare Pages / NuxtHub 等）
- ✨ 极简优雅、流畅丝滑的浏览体验
- 🔐 支持整站密码保护（JWT + Hash）
- 👀 全站监控一览无余
- ⏲️ 数据自动定时刷新
- 📱 完美移动端适配

## 前置准备

你需要先：

1. 在 [UptimeRobot](https://uptimerobot.com/dashboard) 添加要监控的站点
2. 在「My Settings」页面或 [API 设置页面](https://dashboard.uptimerobot.com/integrations) 获取 **Read-Only API Key**，  
   也可以使用单个监视器的 **Monitor-specific API Key**  
   ⚠️ **请勿使用 Main API Key**

## 部署方式

### 推荐：Vercel（一键部署）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/InsWan/site-status)

部署步骤：
1. 点击上方按钮进入 Vercel 部署页面
2. 必须配置以下环境变量：

   | 变量名              | 值          | 说明                          |
   | ------------------- | ----------- | ----------------------------- |
   | DEPLOYMENT_PLATFORM | auto        | Vercel 请保持 auto            |
   | API_KEY             | 你的API密钥 | UptimeRobot 的 Read-Only 或 Monitor-specific Key |

完成即用！🚀

### Cloudflare Pages

需要手动将环境变量 `DEPLOYMENT_PLATFORM` 改为 `cloudflare`

- Star 并 Fork 本仓库
- 推荐使用全新的 [NuxtHub](https://hub.nuxt.com/) 一键部署（操作与 Vercel 几乎相同）
- 也可以直接在 Cloudflare Pages 中手动部署
- 部署前务必配置环境变量（参考 `.env.example`），`API_KEY` 为必填项

### 其他平台

参考官方文档：[部署 Nuxt 应用](https://nuxt.com/docs/getting-started/deployment)

## 常见问题

### 如何开启站点密码保护？

在环境变量中同时添加以下两项（两项缺一不可）：

| 变量名            | 说明                                      |
| ----------------- | ----------------------------------------- |
| SITE_PASSWORD     | 访问站点时需要的密码（用户输入这个密码）   |
| SITE_SECRE_KEY   | 加密用的密钥（随便填，越复杂越好）        |


## 鸣谢

- 本项目 Fork 自 [imsyy/site-status](https://github.com/imsyy/site-status)
- 受 [yb/uptime-status](https://github.com/yb/uptime-status) 启发

感谢原作者的无私分享！❤️