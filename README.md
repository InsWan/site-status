English | [简体中文](./README.zh-CN.md)

<div align="center">
<h1>site-status</h1>
<p>An online status page that displays website uptime status using the UptimeRobot API</p>
<br />
<img src="https://img.shields.io/github/last-commit/inswan/site-status" alt="last commit"/>
<img src="https://img.shields.io/github/languages/code-size/inswan/site-status" alt="code size"/>
<img src="https://img.shields.io/github/stars/inswan/site-status?style=social" alt="GitHub stars"/>
<img src="https://img.shields.io/github/forks/inswan/site-status?style=social&color=orange" alt="GitHub forks"/>
<br />
<br />
</div>

## 👀 Demo

- [InsWan's Status Page](https://status.inswan.fun/)

## 🎉 Features

- 🌍 Supports multiple deployment platforms
- ✨ Beautiful and smooth user experience
- 🔐 Optional password protection (JWT + Hash)
- 👀 Full overview of all monitors
- ⏲️ Automatic periodic data refresh
- 📱 Fully responsive on mobile devices

## Prerequisites

You need to:
1. Create monitors on [UptimeRobot](https://uptimerobot.com/dashboard)
2. Get a **Read-Only API Key** from the `My Settings` page or the [API Settings page](https://dashboard.uptimerobot.com/integrations),  
   **OR** use a **Monitor-specific API Key**  
   ⚠️ **Do NOT use the Main API Key**

## Deployment

### Cloudflare Pages

This repository defaults to Vercel deployment.

You can also deploy on [Cloudflare Pages](https://pages.cloudflare.com/), but you must set the environment variable `DEPLOYMENT_PLATFORM=cloudflare`.

- Star and fork this repository 😘
- Use the new [NuxtHub](https://hub.nuxt.com/) for one-click deployment (very similar to Vercel), or deploy manually on Cloudflare Pages
- **Before clicking "Deploy"**, configure the required environment variables (see `.env.example`). `API_KEY` is mandatory
- If everything goes well, your status page will be live!

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/InsWan/site-status)

- Click the button above to start deployment
- Add the following environment variables (required):

  | Variable Name       | Value  | Notes                  |
  | ------------------- | ------ | ---------------------- |
  | DEPLOYMENT_PLATFORM | auto   | Keep as `auto` for Vercel |
  | API_KEY             | your_key_here | UptimeRobot Read-Only or Monitor-specific key |

Done! 🚀

### Other Platforms

Refer to the official Nuxt deployment guide:  
[Deploying Nuxt Applications](https://nuxt.com/docs/getting-started/deployment)

## Q & A

### How to enable password protection?

Add both of these environment variables (both are required):

| Variable Name     | Description                          |
| ----------------- | ------------------------------------ |
| SITE_PASSWORD     | The password visitors need to enter  |
| SITE_SECRE_KEY   | Encryption key (can be any random string) |


## Credits

- Forked from [imsyy/site-status](https://github.com/imsyy/site-status)
- Inspired by [yb/uptime-status](https://github.com/yb/uptime-status)

Thank you to the original authors! ❤️