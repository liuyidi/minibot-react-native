# Minibot 内测安装说明（给测试同学）

> 包名 `com.liuyidi.minibot`。这是 **EAS preview / 内测包**，不是 App Store 正式版。  
> 更新时间：2026-08-24

把下面整段转给测试即可。安装链接会随每次构建更新，以 Expo 构建页为准。

---

## 一键入口

| 平台 | 做什么 | 链接 |
|------|--------|------|
| **iOS** | 打开构建页 → Install | [iOS preview 构建](https://expo.dev/accounts/liuyidi/projects/minibot/builds/19a879fe-14aa-4d89-9a68-668551d31599) |
| **Android** | 打开构建页 → 下载 APK | [Android preview 构建](https://expo.dev/accounts/liuyidi/projects/minibot/builds/d9380d87-23e8-41a0-8493-a79b944798c3) |
| 全部构建 | 历史包 / 新包 | [EAS Builds](https://expo.dev/accounts/liuyidi/projects/minibot/builds) |

当前对应产物（会过期，优先用构建页里的 Install / Download）：

- iOS IPA：[下载](https://expo.dev/artifacts/eas/qs-4_0alnL3jT9EKh6Pq63wbg8gBN6MngGJvVsVcJDU.ipa)
- Android APK：[下载](https://expo.dev/artifacts/eas/mJgAF49G1614xm7Gcw6ZY-QHznoPhSSly7qMBm1Tgjw.apk)

默认连生产 Gateway：`https://bot.liuyidi.me`。用邮箱验证码 / Demo / Google·GitHub 登录即可。

---

## iOS（必读）

Ad Hoc 内测包 **只能装在已登记 UDID 的设备**上。未登记手机会装不上，需开发者先跑 `eas device:create` 再打一版。

### 1. 开启开发者模式（iOS 16+）

内测包常会提示「需要开启开发者模式」：

1. 打开 **设置 → 隐私与安全性**
2. 滑到最底，打开 **开发者模式**
3. 按提示 **重启**
4. 开机后再确认一次，输入锁屏密码

看不到该开关时：先点一次安装链接，或用数据线连 Mac 打开 Xcode（Window → Devices and Simulators）识别设备后，再回设置查看。

### 2. 安装

1. **Safari** 打开上面的 iOS 构建页（不要用微信内置浏览器）
2. 点 **Install**
3. 回到桌面等图标出现（可能显示「正在安装」一两分钟）

### 3. 仍无法打开时

- **设置 → 通用 → VPN 与设备管理**（或「描述文件与设备管理」）→ 找到开发者证书 → **信任**
- 卸掉旧版 Minibot 后重装
- 系统升级后可能要重新开开发者模式
- 确认这台 iPhone 已加入本次 Ad Hoc 设备列表（当前登记示例：`00008110-000E1DA43431401E`）

App Store / TestFlight 包一般 **不需要** 开发者模式。公开链接落地：[testflight-public-link.md](./testflight-public-link.md)。

---

## Android

1. 用 Chrome 打开 Android 构建页，下载 APK
2. 若拦截：允许「从此来源安装」或打开「安装未知应用」
3. 装完从桌面打开 Minibot

装不上时：卸掉旧包再装；确认架构匹配（当前 preview 为通用 APK）。

---

## 开发者：打新内测包

iOS 必须先登记设备，且本机代理会让 `api.expo.dev` TLS 失败，构建前卸掉代理：

```bash
cd ~/github/minibot-react-native

# 新设备（交互：扫码登记 UDID）
env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy -u ALL_PROXY -u all_proxy \
  npx eas device:create --apple-team-id 7AV39FBXD2

# iOS Ad Hoc（不要加 --refresh-ad-hoc-provisioning-profile，除非已配 ASC API Key）
env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy -u ALL_PROXY -u all_proxy \
  npx eas build --platform ios --profile preview --non-interactive --no-wait

# Android APK
env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy -u ALL_PROXY -u all_proxy \
  npx eas build --platform android --profile preview --non-interactive --no-wait
```

公开下载页 Android APK（OSS，非商店 AAB）：

```bash
env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy -u ALL_PROXY -u all_proxy \
  npx eas build --platform android --profile production-apk --non-interactive --no-wait
```

打完后把 APK 同步到 OSS（下载页读 `releases.json`，不必重发 WebUI）：

```bash
cd ~/github/minibot
source scripts/oss-release.env
scripts/publish-oss-releases.sh --version 1.0.7 --android /path/to/minibot.apk
```

EAS 项目需配置 Secret `NODE_AUTH_TOKEN`（GitHub Packages），环境勾选 development / preview / production。

### EAS Workflows（云端）

定义在 `.eas/workflows/`：

| 文件 | 用途 | 触发 |
|------|------|------|
| `preview.yml` | 内测：Android APK + iOS Ad Hoc | 控制台手动 / `eas workflow:run` |
| `production.yml` | 商店：Android AAB + iOS App Store IPA | 控制台手动 / `eas workflow:run` |

```bash
npm run eas:workflow:preview      # .eas/workflows/preview.yml
npm run eas:workflow:production   # .eas/workflows/production.yml
```

（脚本会卸掉本机代理后再跑 `eas workflow:run`，避免 `api.expo.dev` TLS 失败。）

打完后把新构建 URL 替换本文「一键入口」表格。

---

## 相关文档

- [国内商店与合规](./app-release-china.md)
- [GitHub Packages 鉴权](./github-packages.md)
