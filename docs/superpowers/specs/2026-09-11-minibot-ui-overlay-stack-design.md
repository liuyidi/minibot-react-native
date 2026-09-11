# `@minibot/ui` Overlay Stack 设计（root-siblings · 单 Sibling）

**Date:** 2026-09-11  
**Status:** Accepted  
**Mount:** [react-native-root-siblings](https://github.com/magicismight/react-native-root-siblings)  
**Render strategy:** **整栈一个 `RootSiblings` 实例**，内部按 `entries[]` 分层渲染（业内推荐）

---

## 1. 目标

1. **命令式 + Hook 同源**  
   - `Toast.show` / `useToast()`  
   - `Dialog.alert` / `Dialog.confirm` / `useDialog()`
2. **浮层可叠**  
   - 例如 Popup / BottomSheet 上再开一层 BottomSheet（同一原生层级、同 Host 内 zIndex）
3. **Toast 可盖在 kit 浮层上**  
   - 不必 per-Modal `ToastReceiver`（kit 浮层不再各自开 `RN.Modal`）
4. **统一返回键、遮罩、生命周期**（LIFO + 类型默认表）
5. App 根上仍以 **`ConfigProvider`（主题/文案）+ `RootSiblingParent`** 为主；业务不手搓多套 Provider

### 非目标

- 盖住**外部** `RN.Modal` / 系统 `PickerIOS` / 键盘（物理上高于 RootSibling）
- 把三方原生窗登记进栈
- 用 Wrapper 的 fade 替代 BottomSheet 滑动等业务动画

---

## 2. 为何「整栈一个 Sibling」

| | 每 Entry 一个 Sibling | **整栈一个 Sibling（本方案）** |
|--|----------------------|--------------------------------|
| 挂载 | `new RootSiblings` × N | **一个** instance，`update` 整树 |
| zIndex / 点透 | 靠多节点拼 | **一棵树内**排序、统一 `pointerEvents` |
| 返回键 | 易与 mount 序不一致 | **只认** `entries[]` 栈 |
| 栈顶 barrier | 难「只让顶层可关」 | 易：仅栈顶可交互 mask |
| 退场动画 | 各 destroy | Host 内可先动画再改 snapshot |

命令式仍通过 Controller；root-siblings 只负责「挂到根旁路」，不负责业务栈语义。

参考库用法：[react-native-root-siblings README](https://github.com/magicismight/react-native-root-siblings/blob/master/README.md)（`RootSiblingParent` + `RootSiblingsManager`）。

---

## 3. 核心架构

```text
RootSiblingParent          ← 必须；最后挂载的才 active
  └─ ConfigProvider        ← theme + locale
       └─ App

OverlayController (singleton)
  entries: OverlayStackItem[]
  sibling: RootSiblings | null   ← 最多一个
       │
       └─ update( <OverlayHost entries={snapshot} /> )
              │
              ├─ sort by (level, stackIndex)
              └─ map → OverlayLayer (mask + content)
```

### 3.1 类型与默认层级

| OverlayType | level 基数 | hasMask | closeOnMask | dismissOnBack | 说明 |
|-------------|------------|---------|-------------|---------------|------|
| `Popup` | 1000 | 可选（锚点常无；Sheet 常有） | 可配置 | true | Dropdown / BottomSheet / ActionSheet / Popup |
| `Dialog` | 2000 | true | 可配置（默认 true） | true | 确认框、表单模态 |
| `Toast` | 3000 | false | false | false | 轻提示；**视觉高于 Dialog** |
| `System` | 4000 | true | false | false | 全局 Loading / 强阻塞 |

实际 zIndex：

```text
zIndex = OverlayLevels[type] + indexInStack
```

同 type 多开时后进更大；Toast 基数高于 Dialog，避免「后开 Dialog 盖住 Toast」。

### 3.2 数据结构

```ts
type OverlayType = "Popup" | "Dialog" | "Toast" | "System";

type OverlayOptions = {
  id?: string;
  type: OverlayType;
  level?: number; // override 基数
  hasMask?: boolean;
  maskColor?: string;
  closeOnMask?: boolean;
  dismissOnBack?: boolean;
  durationMs?: number; // Toast 自动关闭；0 = 不自动关
  pointerEvents?: "auto" | "none" | "box-none";
  onDismiss?: () => void;
};

type OverlayStackItem = {
  id: string;
  type: OverlayType;
  options: Required<
    Pick<OverlayOptions, "hasMask" | "closeOnMask" | "dismissOnBack">
  > &
    OverlayOptions;
  content: React.ReactNode | (() => React.ReactNode);
  /** Toast 定时器，dismiss 时 clear */
  timer?: ReturnType<typeof setTimeout>;
};
```

`show` 时用 **按 type 的默认表** merge `options`，禁止「全局 closeOnMask 默认 true」误伤 System。

### 3.3 Controller API

```ts
OverlayStack.show(content, options): string
OverlayStack.update(id, content): void
OverlayStack.dismiss(id): void
OverlayStack.dismissTop(predicate?): boolean  // 见返回键
OverlayStack.dismissAll(type?: OverlayType): void
OverlayStack.getSnapshot(): OverlayStackItem[]
OverlayStack.subscribe(listener): unsubscribe
```

**单 Sibling 生命周期：**

1. `show`：`entries.push`；若 `sibling == null` → `new RootSiblings(<OverlayHost />)`；否则 `sibling.update(...)`
2. `dismiss`：清 timer → 可选退场态 → 从 `entries` 删除 → `update` 或栈空则 `sibling.destroy(); sibling = null`
3. Host **订阅** Controller（或每次 show/dismiss 主动 `update`），以 `getSnapshot()` 为唯一数据源

对外语义化：

```ts
Toast.show / success / fail / loading / hide
Dialog.alert / confirm   // Promise
useToast / useDialog     // 薄封装同一 Controller
```

声明式保持：

```tsx
<Popup visible onClose={...}>...</Popup>
```

内部 `useEffect`：`visible` ↔ `show`/`dismiss`，**不再包 `RN.Modal`**。

---

## 4. OverlayHost 渲染规则

```tsx
// 伪代码
function OverlayHost() {
  const entries = useOverlaySnapshot();
  const sorted = sortByLevelThenIndex(entries);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {sorted.map((item, i) => (
        <OverlayLayer
          key={item.id}
          item={item}
          zIndex={levelBase(item) + i}
          isTopInteractive={item.id === topInteractiveId(entries)}
          onRequestClose={() => OverlayStack.dismiss(item.id)}
        />
      ))}
    </View>
  );
}
```

### 4.1 Mask 与 pointerEvents

- **Toast**：无 mask；层 `pointerEvents="box-none"`，不挡下层点击  
- **有 mask**：mask 可点；仅当 `isTopInteractive && closeOnMask` 时点击关闭（避免点穿关掉下层 Sheet）  
- **Dialog / System**：层 `pointerEvents="auto"`，阻塞下层  
- **锚点 Popup（无全屏 mask）**：外层 `box-none`；「点外部关闭」由业务/专用外部检测实现，不与 Dialog mask 混用同一默认

### 4.2 返回键（Android `BackHandler`）

从 **栈顶向下** 扫描（视觉顶 ≠ 一定是返回目标）：

1. 跳过 `type === "Toast"`（或 `dismissOnBack === false` 且非 System 阻塞）  
2. 若遇 `System` 且 `dismissOnBack !== true` → `return true`（吞掉返回，不关）  
3. 若遇 `dismissOnBack !== false` 的 Popup/Dialog → `dismiss(id)`，`return true`  
4. 否则 `return false` 交给导航

避免：`[Dialog, Toast]` 时顶是 Toast 导致返回直接退出页。

### 4.3 Toast 定时器

- `durationMs` 默认 2500；`loading` 可 `0` 直到 `hide`  
- `dismiss` / `dismissAll` / 同逻辑替换时 **clearTimeout**

### 4.4 动画职责

| 层 | 负责 |
|----|------|
| OverlayLayer | 可选统一 fade 入/出（退场完成后再从 entries 删除） |
| Popup / BottomSheet / Dialog 面板 | 沿用现有 slide / spring（如 `useSlideUpOverlay`）或后续 Reanimated |

---

## 5. 与 ConfigProvider / 主题

推荐树：

```tsx
<RootSiblingParent>
  <ConfigProvider theme={...} locale="zh" mode="light">
    {children}
  </ConfigProvider>
</RootSiblingParent>
```

- **不要**再在 ConfigProvider 里嵌套独立的 ToastProvider/DialogProvider 作为唯一挂载方式（可保留组件供 Storybook 隔离测）  
- Sibling Host 渲染在 Parent 下：若 Parent 包在 Config **外**，Host 内需再注入 theme，或 `show` 时传入已解析样式  
- **约定**：`RootSiblingParent` 包在最外或与 Config 同层且保证 **仅一处 active Parent**（Storybook 与 App 勿叠两个 active）

ConfigProvider 可继续只做 theme/locale；Overlay Controller 模块加载即用，首次 `show` 创建 sibling。

---

## 6. 与现有组件迁移

| 现有 | 目标 |
|------|------|
| Popup / BottomSheet / ActionSheet 内 `RN.Modal` | 改为 Overlay `type: "Popup"`；面板 UI 保留 |
| ToastProvider + Toast 自建 Modal | `Toast.*` → `type: "Toast"`；Host 内画现有 Toast 卡片 |
| DialogProvider 队列 | `Dialog.alert/confirm` → `type: "Dialog"`；复用 Alert/Confirm UI |
| Dropdown 锚点 | Popup + anchor；无 mask 或轻 mask |

kit **禁止**再为上述能力私建 `RN.Modal`（否则 Toast 叠层目标失败）。

---

## 7. 外部原生层共存

```text
更高：键盘 / PickerIOS / 外部 RN.Modal / 系统窗
中间：RootSibling OverlayHost（本栈）
更低：App 页面
```

- 外部层 **不进** `entries`  
- 产品优先用 **栈内 Sheet 版选择器**，少用系统 Picker 弹窗  
- 键盘：面板侧 KeyboardAvoiding，不靠 zIndex  
- 文档写明已知限制

---

## 8. 落地顺序

1. 依赖 `react-native-root-siblings`；根包 `RootSiblingParent`  
2. `OverlayTypes` + `OverlayController` + 单 Sibling `OverlayHost` / `OverlayLayer`  
3. 返回键 + mask 仅栈顶 + Toast timer + 退场后再删 entry  
4. 迁移 Popup / BottomSheet / ActionSheet 去掉自有 Modal  
5. `Toast.*` + `useToast`  
6. `Dialog.alert/confirm` + `useDialog`  
7. 更新 introduce / README；Storybook 冒烟叠层 + Toast 盖 Sheet  

---

## 9. 验收标准

- [ ] 仅一个 `RootSiblings` 实例随栈非空存在  
- [ ] Sheet 上再开 Sheet，返回键先关上层  
- [ ] `Toast.show` 在 Dialog/Sheet 打开时仍可见且默认不挡点击  
- [ ] System loading 时返回键不关、不退出（按配置吞掉）  
- [ ] 无 `RootSiblingParent` 时有明确开发报错/文档  
- [ ] 业务 `src/` 仍推荐 `import { … } from "@minibot/ui"` + babel  

---

## 10. 决议摘要

| 项 | 决议 |
|----|------|
| 挂载 | react-native-root-siblings |
| 渲染 | **整栈一个 Sibling**，内部 `entries` 渲染 |
| 层级 | Popup 1000 / Dialog 2000 / Toast 3000 / System 4000 |
| 声明式 | 保留 `<Popup visible>`，内部对接 Controller |
| Modal | kit 浮层不用 RN.Modal；外部 Modal 不进栈 |
