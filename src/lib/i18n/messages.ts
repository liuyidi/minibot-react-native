/** Flat message catalogs for zh / en. Keep keys stable; values may change. */

export type MessageCatalog = {
  tabs: {
    chat: string;
    knowledge: string;
    discover: string;
    me: string;
  };
  common: {
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    connect: string;
    disconnect: string;
    loading: string;
    on: string;
    off: string;
    retry: string;
    version: string;
    show: string;
    hide: string;
    close: string;
    back: string;
    clear: string;
    reset: string;
    saving: string;
  };
  appearance: {
    title: string;
    sectionTheme: string;
    sectionMode: string;
    themeHint: string;
    modeHint: string;
    system: string;
    systemDesc: string;
    light: string;
    lightDesc: string;
    dark: string;
    darkDesc: string;
    packBrand: string;
    packBrandDesc: string;
    packCodex: string;
    packCodexDesc: string;
    packClaude: string;
    packClaudeDesc: string;
  };
  language: {
    title: string;
  };
  me: {
    editProfile: string;
    sectionConnection: string;
    sectionPrefs: string;
    sectionAccount: string;
    sectionAbout: string;
    server: string;
    appearance: string;
    language: string;
    account: string;
    about: string;
    logout: string;
    logoutConfirmTitle: string;
    logoutConfirmMessage: string;
    defaultName: string;
    defaultBio: string;
    unbound: string;
    wechatBound: string;
    statusIdle: string;
    statusConnecting: string;
    statusOpen: string;
    statusReconnecting: string;
    statusClosed: string;
    statusError: string;
  };
  settingsTitles: {
    profile: string;
    appearance: string;
    language: string;
    account: string;
    server: string;
    about: string;
    aboutApp: string;
  };
  chat: {
    welcome: string;
    newChat: string;
    placeholder: string;
    streamingPlaceholder: string;
    thinkingProcess: string;
    expand: string;
    collapse: string;
    replying: string;
    emptyReply: string;
    openSessions: string;
    minibotConnected: string;
    minibotConnecting: string;
    minibotReconnecting: string;
    minibotFailed: string;
    minibotOffline: string;
    loadSessionFailed: string;
    createSessionFailed: string;
    stopGeneration: string;
    send: string;
  };
  server: {
    title: string;
    saved: string;
    savedBody: string;
    connectFailed: string;
    connectErrorFallback: string;
    notConnected: string;
    connectFirst: string;
    sessionsTitle: string;
    sessionsCount: string;
    listFailed: string;
    baseUrl: string;
    authSecret: string;
    autoConnect: string;
    saveReconnect: string;
    probeSessions: string;
    hint: string;
    remoteSessions: string;
  };
  discover: {
    title: string;
    subtitle: string;
    skills: string;
    mcp: string;
    tools: string;
    comingSoon: string;
    hint: string;
    badgeBuiltin: string;
    skillLongGoal: string;
    skillCron: string;
    skillGithub: string;
    mcpFilesystem: string;
    mcpBrowser: string;
    toolShell: string;
    toolWebSearch: string;
    toolWebFetch: string;
  };
  knowledge: {
    title: string;
    subtitle: string;
    add: string;
    empty: string;
    hint: string;
    emptyHint: string;
    docsCount: string;
    addA11y: string;
    kbProduct: string;
    kbProductDesc: string;
    kbEngineering: string;
    kbEngineeringDesc: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    skipGuest: string;
    noAccount: string;
    hasAccount: string;
    registerNow: string;
    loginNow: string;
    loginSubtitle: string;
    registerSubtitle: string;
    nicknameOptional: string;
    confirmPassword: string;
    passwordPlaceholder: string;
    passwordHint: string;
    confirmPasswordPlaceholder: string;
    goLogin: string;
    invalidEmailTitle: string;
    invalidEmailBody: string;
    passwordRequiredTitle: string;
    passwordRequiredBody: string;
    passwordTooShortTitle: string;
    passwordTooShortBody: string;
    passwordMismatchTitle: string;
    passwordMismatchBody: string;
    loginFailed: string;
    registerFailed: string;
    tryLater: string;
    show: string;
    hide: string;
  };
  drawer: {
    sessions: string;
    history: string;
    empty: string;
    close: string;
    closeList: string;
    openList: string;
    edgeOpen: string;
    serverStatus: string;
  };
  about: {
    checkUpdate: string;
    upToDateTitle: string;
    upToDateBody: string;
    aboutApp: string;
    introTitle: string;
    introBody1: string;
    introBody2: string;
    linksTitle: string;
    repoLink: string;
    githubLink: string;
    versionLabel: string;
  };
  profile: {
    avatarColor: string;
    nickname: string;
    nicknamePlaceholder: string;
    bio: string;
    bioPlaceholder: string;
    saving: string;
    emptyNicknameTitle: string;
    emptyNicknameBody: string;
    saveSuccessTitle: string;
    saveSuccessBody: string;
    saveFailTitle: string;
    saveFailBody: string;
  };
  account: {
    phone: string;
    wechat: string;
    email: string;
    unbound: string;
    bound: string;
    notSet: string;
    changePhone: string;
    changeEmail: string;
    phonePlaceholder: string;
    invalidPhoneTitle: string;
    invalidPhoneBody: string;
    invalidEmailTitle: string;
    invalidEmailBody: string;
    unbindWechatTitle: string;
    unbindWechatBody: string;
    unbind: string;
    bindWechatTitle: string;
    bindWechatBody: string;
    bind: string;
    wechatUser: string;
    deleteAccountTitle: string;
    deleteAccountBody: string;
    deleteConfirm: string;
  };
};

export const zh: MessageCatalog = {
  tabs: {
    chat: "Chat",
    knowledge: "知识库",
    discover: "发现",
    me: "我的",
  },
  common: {
    cancel: "取消",
    confirm: "确定",
    save: "保存",
    delete: "删除",
    connect: "连接",
    disconnect: "断开",
    loading: "加载中…",
    on: "开启",
    off: "关闭",
    retry: "重试",
    version: "版本",
    show: "显示",
    hide: "隐藏",
    close: "关闭",
    back: "返回",
    clear: "清除",
    reset: "重置",
    saving: "保存中…",
  },
  appearance: {
    title: "外观",
    sectionTheme: "界面风格",
    sectionMode: "深浅色",
    themeHint: "选择产品视觉包。Codex 偏冷白/墨色；Claude 偏暖奶油/陶土。",
    modeHint: "系统模式将跟随 iOS / Android 的深浅色设置。",
    system: "系统",
    systemDesc: "跟随系统深浅色设置",
    light: "浅色",
    lightDesc: "始终使用浅色界面",
    dark: "深色",
    darkDesc: "始终使用深色界面",
    packBrand: "Mini",
    packBrandDesc: "Mini Direction 02：白底 / 近黑字，黑主按钮",
    packCodex: "Codex",
    packCodexDesc: "OpenAI Codex：冷白 / 石墨，墨色强调",
    packClaude: "Claude",
    packClaudeDesc: "Anthropic Claude：暖奶油 / 橄榄石墨，陶土强调",
  },
  language: {
    title: "语言",
  },
  me: {
    editProfile: "点按编辑个人资料",
    sectionConnection: "连接",
    sectionPrefs: "偏好",
    sectionAccount: "账号与数据",
    sectionAbout: "关于",
    server: "Minibot 服务器",
    appearance: "外观",
    language: "语言",
    account: "账号",
    about: "关于 Minibot",
    logout: "退出登录",
    logoutConfirmTitle: "退出登录",
    logoutConfirmMessage: "确定退出当前账号？",
    defaultName: "Minibot 用户",
    defaultBio: "点按编辑个人资料",
    unbound: "未绑定",
    wechatBound: "微信已绑定",
    statusIdle: "未连接",
    statusConnecting: "连接中",
    statusOpen: "已连接",
    statusReconnecting: "重连中",
    statusClosed: "已断开",
    statusError: "错误",
  },
  settingsTitles: {
    profile: "个人信息",
    appearance: "外观",
    language: "语言",
    account: "账号管理",
    server: "Minibot 服务器",
    about: "关于",
    aboutApp: "关于 Minibot",
  },
  chat: {
    welcome: "输入你的问题，或分享你想聊的话题…",
    newChat: "新对话",
    placeholder: "给 Minibot 发送消息",
    streamingPlaceholder: "Minibot 正在回复…",
    thinkingProcess: "思考过程",
    expand: "展开",
    collapse: "收起",
    replying: "正在回复…",
    emptyReply: "（无回复内容）",
    openSessions: "打开会话列表",
    minibotConnected: "minibot 已连接",
    minibotConnecting: "minibot 连接中",
    minibotReconnecting: "minibot 重连中",
    minibotFailed: "minibot 连接失败",
    minibotOffline: "minibot 未连接",
    loadSessionFailed: "加载会话失败",
    createSessionFailed: "创建会话失败",
    stopGeneration: "停止生成",
    send: "发送",
  },
  server: {
    title: "Minibot 服务器",
    saved: "已保存",
    savedBody: "已重新连接 minibot。",
    connectFailed: "连接失败",
    connectErrorFallback: "请检查地址与服务是否启动",
    notConnected: "未连接",
    connectFirst: "请先连接 minibot。",
    sessionsTitle: "会话列表",
    sessionsCount: "共 {count} 个远端会话",
    listFailed: "拉取失败",
    baseUrl: "Gateway Base URL",
    authSecret: "Auth Secret（可选）",
    autoConnect: "启动时自动连接",
    saveReconnect: "保存并重连",
    probeSessions: "测 sessions",
    hint: "使用 @minibot/client：bootstrap → REST sessions → WS multiplex。iOS 模拟器可用 127.0.0.1；Android 模拟器用 10.0.2.2；真机请填电脑局域网 IP，且 minibot 需监听 0.0.0.0:8766。",
    remoteSessions: "远端会话：{count}",
  },
  discover: {
    title: "发现",
    subtitle: "Skills · MCP · Tools",
    skills: "Skills",
    mcp: "MCP",
    tools: "Tools",
    comingSoon: "敬请期待",
    hint: "浏览可启用的能力目录。当前为占位数据，接入 minibot 后将拉取服务端清单。",
    badgeBuiltin: "内置",
    skillLongGoal: "长程目标拆解与持续推进",
    skillCron: "定时任务与心跳检查",
    skillGithub: "仓库检索、PR 与 Issue 辅助",
    mcpFilesystem: "MCP 文件系统读写与列举",
    mcpBrowser: "网页浏览与抓取能力",
    toolShell: "受控 Shell 执行",
    toolWebSearch: "联网搜索",
    toolWebFetch: "抓取指定 URL 内容",
  },
  knowledge: {
    title: "知识库",
    subtitle: "对接 minikb / minibot 知识能力",
    add: "新建",
    empty: "暂无知识库，后续将从服务端同步。",
    hint: "管理可被 Agent 检索的本地 / 远程知识库。对接 minibot 后将同步服务端目录。",
    emptyHint: "当前为本地占位列表。接入 minibot knowledge API 后可创建、导入与检索。",
    docsCount: "{count} 篇文档",
    addA11y: "新建知识库",
    kbProduct: "产品文档",
    kbProductDesc: "产品说明、FAQ 与对外文档摘要",
    kbEngineering: "工程笔记",
    kbEngineeringDesc: "架构决策、运维手册与排障记录",
  },
  auth: {
    login: "登录",
    register: "注册",
    email: "邮箱",
    password: "密码",
    skipGuest: "跳过登录，直接进入 Chat（临时）",
    noAccount: "还没有账号？",
    hasAccount: "已有账号？",
    registerNow: "立即注册",
    loginNow: "立即登录",
    loginSubtitle: "使用账号登录，同步你的对话与设置。",
    registerSubtitle: "创建账号后即可登录 Minibot，后续可同步会话到云端。",
    nicknameOptional: "昵称（可选）",
    confirmPassword: "确认密码",
    passwordPlaceholder: "请输入密码",
    passwordHint: "至少 8 位",
    confirmPasswordPlaceholder: "再次输入密码",
    goLogin: "去登录",
    invalidEmailTitle: "邮箱格式有误",
    invalidEmailBody: "请输入有效的邮箱地址。",
    passwordRequiredTitle: "请输入密码",
    passwordRequiredBody: "密码不能为空。",
    passwordTooShortTitle: "密码太短",
    passwordTooShortBody: "密码至少需要 8 个字符。",
    passwordMismatchTitle: "密码不一致",
    passwordMismatchBody: "两次输入的密码不一致。",
    loginFailed: "登录失败",
    registerFailed: "注册失败",
    tryLater: "请稍后重试。",
    show: "显示",
    hide: "隐藏",
  },
  drawer: {
    sessions: "会话",
    history: "历史（按最近更新）",
    empty: "暂无会话",
    close: "关闭",
    closeList: "关闭会话列表",
    openList: "打开会话列表",
    edgeOpen: "从左边缘滑动打开会话列表",
    serverStatus: "服务器状态：{label}",
  },
  about: {
    checkUpdate: "版本更新",
    upToDateTitle: "版本更新",
    upToDateBody: "当前已是最新版本 {version}。",
    aboutApp: "关于 Minibot",
    introTitle: "应用简介",
    introBody1:
      "Minibot 是一款基于 React Native（Expo）构建的 AI 对话应用，目标对接 minibot server，支持 iOS、Android 与 Web 多端使用。",
    introBody2: "你的 API Key 与个人设置均保存在本机，不会上传至第三方服务器。",
    linksTitle: "相关链接",
    repoLink: "Minibot 仓库 →",
    githubLink: "GitHub 开源仓库 →",
    versionLabel: "版本 {version}",
  },
  profile: {
    avatarColor: "选择头像颜色",
    nickname: "昵称",
    nicknamePlaceholder: "输入昵称",
    bio: "个人描述",
    bioPlaceholder: "介绍一下自己",
    saving: "保存中…",
    emptyNicknameTitle: "请输入昵称",
    emptyNicknameBody: "昵称不能为空。",
    saveSuccessTitle: "保存成功",
    saveSuccessBody: "个人信息已更新。",
    saveFailTitle: "保存失败",
    saveFailBody: "请稍后重试。",
  },
  account: {
    phone: "手机号",
    wechat: "微信",
    email: "电子邮箱",
    unbound: "未绑定",
    bound: "已绑定",
    notSet: "未设置",
    changePhone: "更改手机号",
    changeEmail: "更改邮箱",
    phonePlaceholder: "请输入 11 位手机号",
    invalidPhoneTitle: "格式有误",
    invalidPhoneBody: "请输入 11 位中国大陆手机号。",
    invalidEmailTitle: "格式有误",
    invalidEmailBody: "请输入有效的邮箱地址。",
    unbindWechatTitle: "解绑微信",
    unbindWechatBody: "确定解除当前微信绑定？",
    unbind: "解绑",
    bindWechatTitle: "绑定微信",
    bindWechatBody: "将跳转微信授权（演示：直接模拟绑定成功）",
    bind: "绑定",
    wechatUser: "微信用户",
    deleteAccountTitle: "注销账号",
    deleteAccountBody: "注销后将清除本机全部账号与聊天配置数据，此操作不可恢复。",
    deleteConfirm: "确认注销",
  },
};

export const en: MessageCatalog = {
  tabs: {
    chat: "Chat",
    knowledge: "Knowledge",
    discover: "Discover",
    me: "Me",
  },
  common: {
    cancel: "Cancel",
    confirm: "OK",
    save: "Save",
    delete: "Delete",
    connect: "Connect",
    disconnect: "Disconnect",
    loading: "Loading…",
    on: "On",
    off: "Off",
    retry: "Retry",
    version: "Version",
    show: "Show",
    hide: "Hide",
    close: "Close",
    back: "Back",
    clear: "Clear",
    reset: "Reset",
    saving: "Saving…",
  },
  appearance: {
    title: "Appearance",
    sectionTheme: "Theme pack",
    sectionMode: "Color mode",
    themeHint:
      "Pick a visual pack. Codex is cool white/ink; Claude is warm cream/terracotta.",
    modeHint: "System mode follows your iOS / Android appearance setting.",
    system: "System",
    systemDesc: "Match system light / dark mode",
    light: "Light",
    lightDesc: "Always use light appearance",
    dark: "Dark",
    darkDesc: "Always use dark appearance",
    packBrand: "Mini",
    packBrandDesc: "Mini Direction 02: white canvas / near-black ink, black primary",
    packCodex: "Codex",
    packCodexDesc: "OpenAI Codex: cool white / graphite, ink accent",
    packClaude: "Claude",
    packClaudeDesc: "Anthropic Claude: warm cream / olive graphite, terracotta accent",
  },
  language: {
    title: "Language",
  },
  me: {
    editProfile: "Tap to edit profile",
    sectionConnection: "Connection",
    sectionPrefs: "Preferences",
    sectionAccount: "Account & data",
    sectionAbout: "About",
    server: "Minibot server",
    appearance: "Appearance",
    language: "Language",
    account: "Account",
    about: "About Minibot",
    logout: "Sign out",
    logoutConfirmTitle: "Sign out",
    logoutConfirmMessage: "Sign out of this account?",
    defaultName: "Minibot user",
    defaultBio: "Tap to edit profile",
    unbound: "Not linked",
    wechatBound: "WeChat linked",
    statusIdle: "Offline",
    statusConnecting: "Connecting",
    statusOpen: "Connected",
    statusReconnecting: "Reconnecting",
    statusClosed: "Disconnected",
    statusError: "Error",
  },
  settingsTitles: {
    profile: "Profile",
    appearance: "Appearance",
    language: "Language",
    account: "Account",
    server: "Minibot server",
    about: "About",
    aboutApp: "About Minibot",
  },
  chat: {
    welcome: "Ask a question, or share what you'd like to talk about…",
    newChat: "New chat",
    placeholder: "Message Minibot",
    streamingPlaceholder: "Minibot is replying…",
    thinkingProcess: "Thinking",
    expand: "Expand",
    collapse: "Collapse",
    replying: "Replying…",
    emptyReply: "(No reply)",
    openSessions: "Open sessions",
    minibotConnected: "minibot connected",
    minibotConnecting: "minibot connecting",
    minibotReconnecting: "minibot reconnecting",
    minibotFailed: "minibot failed",
    minibotOffline: "minibot offline",
    loadSessionFailed: "Failed to load session",
    createSessionFailed: "Failed to create session",
    stopGeneration: "Stop generating",
    send: "Send",
  },
  server: {
    title: "Minibot server",
    saved: "Saved",
    savedBody: "Reconnected to minibot.",
    connectFailed: "Connection failed",
    connectErrorFallback: "Check the URL and that the server is running",
    notConnected: "Not connected",
    connectFirst: "Connect to minibot first.",
    sessionsTitle: "Sessions",
    sessionsCount: "{count} remote sessions",
    listFailed: "Failed to list sessions",
    baseUrl: "Gateway Base URL",
    authSecret: "Auth Secret (optional)",
    autoConnect: "Auto-connect on launch",
    saveReconnect: "Save & reconnect",
    probeSessions: "Probe sessions",
    hint: "Uses @minibot/client: bootstrap → REST sessions → WS multiplex. iOS Simulator: 127.0.0.1; Android emulator: 10.0.2.2; physical devices need your LAN IP with minibot on 0.0.0.0:8766.",
    remoteSessions: "Remote sessions: {count}",
  },
  discover: {
    title: "Discover",
    subtitle: "Skills · MCP · Tools",
    skills: "Skills",
    mcp: "MCP",
    tools: "Tools",
    comingSoon: "Coming soon",
    hint: "Browse available capabilities. Placeholder data for now; will sync from minibot when connected.",
    badgeBuiltin: "Built-in",
    skillLongGoal: "Long-goal breakdown and sustained progress",
    skillCron: "Scheduled tasks and heartbeat checks",
    skillGithub: "Repo search, PR and Issue assistance",
    mcpFilesystem: "MCP filesystem read/write and listing",
    mcpBrowser: "Web browsing and fetching",
    toolShell: "Controlled shell execution",
    toolWebSearch: "Web search",
    toolWebFetch: "Fetch content from a URL",
  },
  knowledge: {
    title: "Knowledge",
    subtitle: "minikb / minibot knowledge",
    add: "New",
    empty: "No knowledge bases yet. They will sync from the server later.",
    hint: "Manage local / remote knowledge bases for agent retrieval. Will sync from minibot when connected.",
    emptyHint:
      "Placeholder list for now. Create, import, and search once the minibot knowledge API is connected.",
    docsCount: "{count} docs",
    addA11y: "New knowledge base",
    kbProduct: "Product docs",
    kbProductDesc: "Product guides, FAQ, and public doc summaries",
    kbEngineering: "Engineering notes",
    kbEngineeringDesc: "Architecture decisions, runbooks, and troubleshooting",
  },
  auth: {
    login: "Sign in",
    register: "Sign up",
    email: "Email",
    password: "Password",
    skipGuest: "Skip sign-in and open Chat (temporary)",
    noAccount: "No account?",
    hasAccount: "Already have an account?",
    registerNow: "Sign up",
    loginNow: "Sign in",
    loginSubtitle: "Sign in to sync your chats and settings.",
    registerSubtitle: "Create an account to sign in to Minibot and sync sessions later.",
    nicknameOptional: "Nickname (optional)",
    confirmPassword: "Confirm password",
    passwordPlaceholder: "Enter password",
    passwordHint: "At least 8 characters",
    confirmPasswordPlaceholder: "Re-enter password",
    goLogin: "Sign in",
    invalidEmailTitle: "Invalid email",
    invalidEmailBody: "Enter a valid email address.",
    passwordRequiredTitle: "Password required",
    passwordRequiredBody: "Password cannot be empty.",
    passwordTooShortTitle: "Password too short",
    passwordTooShortBody: "Password must be at least 8 characters.",
    passwordMismatchTitle: "Passwords don't match",
    passwordMismatchBody: "The two passwords do not match.",
    loginFailed: "Sign-in failed",
    registerFailed: "Sign-up failed",
    tryLater: "Please try again later.",
    show: "Show",
    hide: "Hide",
  },
  drawer: {
    sessions: "Sessions",
    history: "History (recent first)",
    empty: "No sessions yet",
    close: "Close",
    closeList: "Close sessions",
    openList: "Open sessions",
    edgeOpen: "Swipe from the left edge to open sessions",
    serverStatus: "Server status: {label}",
  },
  about: {
    checkUpdate: "Check for updates",
    upToDateTitle: "Up to date",
    upToDateBody: "You're on the latest version {version}.",
    aboutApp: "About Minibot",
    introTitle: "About the app",
    introBody1:
      "Minibot is an AI chat app built with React Native (Expo), designed to connect to the minibot server on iOS, Android, and Web.",
    introBody2:
      "Your API Key and personal settings stay on this device and are not uploaded to third-party servers.",
    linksTitle: "Links",
    repoLink: "Minibot repo →",
    githubLink: "GitHub open-source repo →",
    versionLabel: "Version {version}",
  },
  profile: {
    avatarColor: "Avatar color",
    nickname: "Nickname",
    nicknamePlaceholder: "Enter nickname",
    bio: "Bio",
    bioPlaceholder: "Tell us about yourself",
    saving: "Saving…",
    emptyNicknameTitle: "Nickname required",
    emptyNicknameBody: "Nickname cannot be empty.",
    saveSuccessTitle: "Saved",
    saveSuccessBody: "Profile updated.",
    saveFailTitle: "Save failed",
    saveFailBody: "Please try again later.",
  },
  account: {
    phone: "Phone",
    wechat: "WeChat",
    email: "Email",
    unbound: "Not linked",
    bound: "Linked",
    notSet: "Not set",
    changePhone: "Change phone number",
    changeEmail: "Change email",
    phonePlaceholder: "11-digit mobile number",
    invalidPhoneTitle: "Invalid format",
    invalidPhoneBody: "Enter an 11-digit mainland China mobile number.",
    invalidEmailTitle: "Invalid format",
    invalidEmailBody: "Enter a valid email address.",
    unbindWechatTitle: "Unlink WeChat",
    unbindWechatBody: "Unlink your WeChat account?",
    unbind: "Unlink",
    bindWechatTitle: "Link WeChat",
    bindWechatBody: "Opens WeChat authorization (demo: simulates success)",
    bind: "Link",
    wechatUser: "WeChat user",
    deleteAccountTitle: "Delete account",
    deleteAccountBody:
      "This clears all local account and chat data on this device. This cannot be undone.",
    deleteConfirm: "Delete account",
  },
};

export const catalogs = { zh, en } as const;
