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
    model: string;
    thinking: string;
    account: string;
    apiKey: string;
    usage: string;
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
    connectedWithModel: string;
  };
  settingsTitles: {
    profile: string;
    appearance: string;
    language: string;
    account: string;
    apiKey: string;
    server: string;
    model: string;
    thinking: string;
    usage: string;
    about: string;
    aboutApp: string;
  };
  chat: {
    welcome: string;
    newChat: string;
    placeholder: string;
    streamingPlaceholder: string;
    noApiTitle: string;
    noApiBody: string;
    configureKey: string;
    noServerTitle: string;
    noServerBody: string;
    connectServer: string;
    configureApiKey: string;
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
    deepseekDirect: string;
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
    modelLabel: string;
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
  prefs: {
    thinkingLabel: string;
    onShort: string;
    offShort: string;
  };
  apiKey: {
    emptyTitle: string;
    emptyBody: string;
    configured: string;
    placeholderUpdate: string;
    save: string;
    clear: string;
    clearConfirmTitle: string;
    clearConfirmBody: string;
    clearAction: string;
    saveSuccessTitle: string;
    saveSuccessBody: string;
    saveFailTitle: string;
    saveFailBody: string;
    emptyAlertTitle: string;
    emptyAlertBody: string;
    formatWarnTitle: string;
    formatWarnBody: string;
    copiedTitle: string;
    copiedBody: string;
    howToTitle: string;
    howToBody: string;
    getKeyLink: string;
    show: string;
    hide: string;
    showA11y: string;
    hideA11y: string;
    copyA11y: string;
  };
  thinking: {
    hint: string;
    reasonerLocked: string;
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
  model: {
    hint: string;
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
  usage: {
    noRecords: string;
    needApiKey: string;
    loadFailed: string;
    resetTitle: string;
    resetBody: string;
    resetAction: string;
    noApiTitle: string;
    noApiBody: string;
    goConfigure: string;
    balanceTitle: string;
    availableBalance: string;
    balanceOk: string;
    balanceLow: string;
    topupBalance: string;
    grantBalance: string;
    localUsage: string;
    totalTokens: string;
    inputTokens: string;
    outputTokens: string;
    requestCount: string;
    lastUpdated: string;
    resetLocal: string;
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
    model: "模型",
    thinking: "思考模式",
    account: "账号",
    apiKey: "API Key",
    usage: "用量",
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
    connectedWithModel: "已连接 · {model}",
  },
  settingsTitles: {
    profile: "个人信息",
    appearance: "外观",
    language: "语言",
    account: "账号管理",
    apiKey: "API Key",
    server: "Minibot 服务器",
    model: "模型",
    thinking: "思考模式",
    usage: "Token 用量",
    about: "关于",
    aboutApp: "关于 Minibot",
  },
  chat: {
    welcome: "输入你的问题，或分享你想聊的话题…",
    newChat: "新对话",
    placeholder: "给 Minibot 发送消息",
    streamingPlaceholder: "Minibot 正在回复…",
    noApiTitle: "尚未配置 API Key",
    noApiBody: "请先在「我的」页面配置 API Key，再开始聊天。",
    configureKey: "配置 API Key",
    noServerTitle: "尚未连接 Minibot",
    noServerBody:
      "请先在「我的 → Minibot 服务器」连接 gateway，或配置 DeepSeek API Key 作为离线过渡。",
    connectServer: "连接服务器",
    configureApiKey: "配置 API Key",
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
    deepseekDirect: "DeepSeek 直连",
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
    modelLabel: "模型：{model}",
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
  prefs: {
    thinkingLabel: "思考 {state}",
    onShort: "开",
    offShort: "关",
  },
  apiKey: {
    emptyTitle: "尚未配置",
    emptyBody: "尚未配置，聊天功能需要先设置 API Key",
    configured: "已配置 {key}",
    placeholderUpdate: "输入新密钥以更新",
    save: "保存密钥",
    clear: "清除密钥",
    clearConfirmTitle: "清除 API Key",
    clearConfirmBody: "清除后需要重新配置才能聊天。",
    clearAction: "清除",
    saveSuccessTitle: "保存成功",
    saveSuccessBody: "API Key 已保存。",
    saveFailTitle: "保存失败",
    saveFailBody: "请稍后重试。",
    emptyAlertTitle: "请输入 API Key",
    emptyAlertBody: "密钥不能为空。",
    formatWarnTitle: "格式可能有误",
    formatWarnBody: "API Key 通常以 sk- 开头。",
    copiedTitle: "已复制",
    copiedBody: "API Key 已复制到剪贴板。",
    howToTitle: "如何获取 API Key",
    howToBody:
      "1. 登录 API 开放平台\n2. 进入 API Keys 页面\n3. 点击 Create API Key 并复制密钥",
    getKeyLink: "前往密钥平台获取 →",
    show: "显示",
    hide: "隐藏",
    showA11y: "显示 API Key",
    hideA11y: "隐藏 API Key",
    copyA11y: "复制 API Key",
  },
  thinking: {
    hint: "开启后，模型会先输出思考过程，再给出最终回答。V4 模型默认开启思考，此处关闭后将不再展示思考过程。Reasoner 模型始终开启思考模式。",
    reasonerLocked: "当前模型为 Reasoner，思考模式始终开启。",
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
  model: {
    hint: "选择聊天使用的模型。V4 系列为当前推荐模型。",
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
  usage: {
    noRecords: "暂无记录",
    needApiKey: "请先配置 API Key 后查看账户余额。",
    loadFailed: "加载失败，请检查网络或 API Key 是否有效。",
    resetTitle: "重置统计",
    resetBody: "将清除本机累计的 Token 用量记录，不影响账户余额。",
    resetAction: "重置",
    noApiTitle: "尚未配置 API Key",
    noApiBody: "配置后可查询账户余额，聊天时会自动累计本机 Token 用量。",
    goConfigure: "去配置",
    balanceTitle: "账户余额",
    availableBalance: "可用余额",
    balanceOk: "余额充足，可正常调用 API",
    balanceLow: "余额不足，请及时充值",
    topupBalance: "充值余额",
    grantBalance: "赠送余额",
    localUsage: "本机 Token 用量",
    totalTokens: "累计 Token",
    inputTokens: "输入 Token",
    outputTokens: "输出 Token",
    requestCount: "请求次数",
    lastUpdated: "统计本 App 内聊天产生的 Token，最后更新：{time}",
    resetLocal: "重置本机统计",
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
    model: "Model",
    thinking: "Thinking",
    account: "Account",
    apiKey: "API Key",
    usage: "Usage",
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
    connectedWithModel: "Connected · {model}",
  },
  settingsTitles: {
    profile: "Profile",
    appearance: "Appearance",
    language: "Language",
    account: "Account",
    apiKey: "API Key",
    server: "Minibot server",
    model: "Model",
    thinking: "Thinking",
    usage: "Token usage",
    about: "About",
    aboutApp: "About Minibot",
  },
  chat: {
    welcome: "Ask a question, or share what you'd like to talk about…",
    newChat: "New chat",
    placeholder: "Message Minibot",
    streamingPlaceholder: "Minibot is replying…",
    noApiTitle: "API Key required",
    noApiBody: "Add an API Key in Me before chatting.",
    configureKey: "Configure API Key",
    noServerTitle: "Minibot not connected",
    noServerBody:
      "Connect the gateway under Me → Minibot server, or configure a DeepSeek API Key as a fallback.",
    connectServer: "Connect server",
    configureApiKey: "Configure API Key",
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
    deepseekDirect: "DeepSeek direct",
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
    modelLabel: "Model: {model}",
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
  prefs: {
    thinkingLabel: "Thinking {state}",
    onShort: "On",
    offShort: "Off",
  },
  apiKey: {
    emptyTitle: "Not configured",
    emptyBody: "Not configured yet. Chat requires an API Key.",
    configured: "Configured {key}",
    placeholderUpdate: "Enter a new key to update",
    save: "Save key",
    clear: "Clear key",
    clearConfirmTitle: "Clear API Key",
    clearConfirmBody: "You will need to configure it again before chatting.",
    clearAction: "Clear",
    saveSuccessTitle: "Saved",
    saveSuccessBody: "API Key saved.",
    saveFailTitle: "Save failed",
    saveFailBody: "Please try again later.",
    emptyAlertTitle: "API Key required",
    emptyAlertBody: "Key cannot be empty.",
    formatWarnTitle: "Format warning",
    formatWarnBody: "API Keys usually start with sk-.",
    copiedTitle: "Copied",
    copiedBody: "API Key copied to clipboard.",
    howToTitle: "How to get an API Key",
    howToBody:
      "1. Sign in to the API platform\n2. Open the API Keys page\n3. Click Create API Key and copy the key",
    getKeyLink: "Get a key from the platform →",
    show: "Show",
    hide: "Hide",
    showA11y: "Show API Key",
    hideA11y: "Hide API Key",
    copyA11y: "Copy API Key",
  },
  thinking: {
    hint: "When enabled, the model shows its reasoning before the final answer. V4 models think by default; turning this off hides the reasoning. Reasoner models always think.",
    reasonerLocked: "Reasoner is selected; thinking mode is always on.",
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
  model: {
    hint: "Choose the model for chat. V4 is currently recommended.",
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
  usage: {
    noRecords: "No records",
    needApiKey: "Configure an API Key to view account balance.",
    loadFailed: "Load failed. Check your network or API Key.",
    resetTitle: "Reset stats",
    resetBody: "Clears local token usage totals. Does not affect account balance.",
    resetAction: "Reset",
    noApiTitle: "API Key required",
    noApiBody: "Configure an API Key to view balance; in-app chat tracks local token usage.",
    goConfigure: "Configure",
    balanceTitle: "Account balance",
    availableBalance: "Available balance",
    balanceOk: "Balance is sufficient for API calls",
    balanceLow: "Balance is low; please top up",
    topupBalance: "Top-up balance",
    grantBalance: "Granted balance",
    localUsage: "Local token usage",
    totalTokens: "Total tokens",
    inputTokens: "Input tokens",
    outputTokens: "Output tokens",
    requestCount: "Requests",
    lastUpdated: "Tokens from in-app chat. Last updated: {time}",
    resetLocal: "Reset local stats",
  },
};

export const catalogs = { zh, en } as const;
