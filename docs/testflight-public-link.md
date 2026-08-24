# TestFlight 公开链接落地指南

> 包名 `com.liuyidi.minibot` · Apple Team `7AV39FBXD2` · EAS 项目 [minibot](https://expo.dev/accounts/liuyidi/projects/minibot)  
> 更新时间：2026-08-24

公开链接形态：`https://testflight.apple.com/join/<code>`  
任何人用 **Safari** 打开（或扫码）即可走 TestFlight 安装。**不是**把 IPA 放到 OSS 直装。

下载页以后把 `releases.json` 的 `ios.url` 设成这条 join 链接即可（现有扫码组件会编码该 URL）。

---

## 和其它 iOS 分发的区别

| 方式 | 谁能装 | 要不要审核 |
|------|--------|------------|
| Ad Hoc / EAS preview | 仅已登记 UDID | 否 |
| **TestFlight 内部组** | 最多 100 人，需邮箱邀请 | 否（处理完构建即可） |
| **TestFlight 公开链接（本文）** | 最多 10,000 人，无需登记设备 | **首次外测构建要过 Beta App Review**（通常 24–48 小时） |
| App Store 正式版 | 全量用户 | App Review |

公开链接适合：官网 / 下载页扫码、朋友圈分发。上架 App Store 仍要另走正式审核。

---

## 前置清单

- [ ] Apple Developer 年费账号（个人即可）
- [ ] [App Store Connect](https://appstoreconnect.apple.com) 里已创建 App  
      Bundle ID = `com.liuyidi.minibot`，SKU 自定，平台 iOS
- [ ] 加密声明：构建已含 `ITSAppUsesNonExemptEncryption: false`；Connect 里选 **否，未使用非豁免加密**
- [ ] 隐私政策公网 URL（外测审核常要）。现有页：登录页「隐私政策」；商店元数据需填可打开的 https 链接
- [ ] EAS iOS **production** 凭据（让 EAS 托管 Distribution 证书 + App Store provisioning）

App 尚未在 Connect 创建时：Apps → 添加 → iOS → 名称 Minibot → Bundle ID 选 `com.liuyidi.minibot`。

---

## 一、打 production IPA（本仓）

```bash
cd ~/github/minibot-react-native

env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy -u ALL_PROXY -u all_proxy \
  npx eas build --platform ios --profile production --non-interactive --no-wait
```

或：`npx eas workflow:run production.yml`（同时打 Android AAB + iOS）。

产物用途：**只给 App Store Connect / TestFlight / 之后的 `eas submit`**，不要上传 OSS 当安装包。

等构建变成 **Finished**，记下 Build 页 URL。

---

## 二、提交到 App Store Connect

本机代理会导致 `api.expo.dev` / Apple API TLS 失败，提交前卸掉代理。

```bash
cd ~/github/minibot-react-native

env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy -u ALL_PROXY -u all_proxy \
  npx eas submit --platform ios --profile production --latest --non-interactive
```

指定某次构建：

```bash
npx eas submit --platform ios --profile production --id <EAS_BUILD_UUID> --non-interactive
```

第一次 submit 会要 Apple 登录或 **App Store Connect API Key**（推荐配到 EAS Credentials，避免每次 2FA）。

成功后：Connect → 你的 App → **TestFlight** 出现该 build，状态先是 **Processing**（约 10–60 分钟），变为 **Ready to Submit / Ready to Test**。

---

## 三、内部组（可选，先自测）

1. TestFlight → **内部测试** → 创建组（如 Internal）
2. 把自己和同事加成 App 的用户（Users and Access，角色 App Manager / Developer 即可）
3. 把刚处理好的 build 勾进该组

内部组 **不需要** Beta 审核。用 TestFlight App 装上，确认登录 / 连 `https://bot.liuyidi.me` 正常。

---

## 四、外部组 + 打开公开链接（落地关键）

1. TestFlight → **外部测试** → 创建组（如 Public）
2. **添加构建**，选刚过 Processing 的 production build  
   - **第一次**外发该 App：点提交后进入 **Beta App Review**  
   - 填「测试说明」：如何登录（邮箱验证码 / Demo）、App 是什么、AI 对话连自有 Gateway、无 UGC 审核队列可说明
3. 等外测审核通过（邮件通知）
4. 打开该外部组 → **Enable Public Link** / **启用公开链接**
5. 复制 `https://testflight.apple.com/join/xxxx`

可随时停用公开链接；停用后旧码失效。

### 外测审核常被拒的点

- 没给演示账号 / 验证码收不到  
- 隐私政策打不开或未说明数据去向  
- 登录后白屏、连不上生产 Gateway  
- 未说明生成式 AI 用途  

测试说明里写清：Demo 账号或固定测试邮箱、隐私政策 URL、默认服务器 `https://bot.liuyidi.me`。

---

## 五、给用户的安装说明（可直接转发）

1. iPhone 先安装 Apple **TestFlight**（App Store 搜 TestFlight）
2. **用 Safari** 打开公开链接（不要用微信内置浏览器）
3. 点 **View in TestFlight** / **在 TestFlight 中查看** → **安装**
4. 桌面出现 Minibot；之后更新也在 TestFlight 里点更新

中国区网络下 TestFlight 下载偶发慢，属常见现象。

公开链接 **不需要** 开发者模式，也 **不需要** 登记 UDID。

---

## 六、挂到 minibot 下载页

清单：`https://downloads.liuyidi.me/minibot/releases.json`  
页面：`https://bot.liuyidi.me/#/download/`

拿到 join 链接后，在 OSS 的 `releases.json` 写入（保留其它平台字段）：

```json
"ios": {
  "version": "1.0.7",
  "url": "https://testflight.apple.com/join/替换成你的code"
}
```

下载页 iOS Tab 会显示「立即下载」和二维码（二维码内容就是这条 join URL）。  
**不要**把 IPA 文件 URL 填进 `ios.url`。

---

## 七、之后每次发新 TestFlight 版

```text
version bump（如需）→ eas build ios production → eas submit --latest
→ TestFlight 里把新 build 加到已有外部组
```

已通过 Beta 审核的 App，**同版本系列**后续 build 多数不必再审；大改登录 / 权限 / 业务有时会再审。公开链接不变，用户在 TestFlight 里更新即可。

正式上架：Connect → App Store 页填元数据与截图 → 选同一颗 build → **提交审核**（与 TestFlight 外测是两条队列）。

---

## 命令速查

```bash
cd ~/github/minibot-react-native
PROXY_OFF='env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy -u ALL_PROXY -u all_proxy'

# 构建（本文第一步）
$PROXY_OFF npx eas build --platform ios --profile production --non-interactive --no-wait

# 上传 Connect（构建 Finished 之后）
$PROXY_OFF npx eas submit --platform ios --profile production --latest --non-interactive

# 查看最近 iOS 构建
$PROXY_OFF npx eas build:list --platform ios --limit 5
```

---

## 相关文档

- [内测 Ad Hoc / Android APK](./internal-distribution-testers.md)
- [国内商店与合规](./app-release-china.md)
