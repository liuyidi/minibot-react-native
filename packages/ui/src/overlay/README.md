# Overlay Stack 使用说明

Kit 浮层统一走 **OverlayStack**（`react-native-root-siblings`，整栈一个 Host）。  
业务侧优先用封装好的组件 / 命令式 API；一般不必直接碰 `OverlayStack`。

设计文档：[docs/superpowers/specs/2026-09-11-minibot-ui-overlay-stack-design.md](../../../../docs/superpowers/specs/2026-09-11-minibot-ui-overlay-stack-design.md)  
可交互 Demo：Storybook → **UI / Overlays 浮层 / OverlayStack**

---

## 1. 前置：根上包 `ConfigProvider`

`ConfigProvider` 内含主题、文案，以及 **`RootSiblingParent`**（Overlay 挂载点）。App / Storybook 入口只需一层：

```tsx
import { ConfigProvider, brandLight } from "@minibot/ui";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={brandLight} locale="zh" mode="light">
      {children}
    </ConfigProvider>
  );
}
```

注意：

- 全应用 **只保留一处 active 的 `RootSiblingParent`**（不要在外层再套一层）。
- 未包 `ConfigProvider` 时，命令式 `Toast` / `Dialog` 与声明式 Popup 都无法正确挂到根旁路。

---

## 2. 怎么选 API

| 场景 | 推荐写法 | 说明 |
|------|----------|------|
| 页面里开关面板 / Sheet | 声明式组件 `visible` + `onClose` | BottomSheet、ActionSheet、Popup、Dialog |
| 接口成功/失败轻提示 | `Toast.show` / `useToast()` | 命令式，盖在任意 kit 浮层之上 |
| 提交前确认、错误告警 | `Dialog.alert` / `confirm` 或 `useDialog()` | 命令式 Promise，适合请求链路 |
| 锚点菜单 | `DropdownMenu` | 内部走 Popup |
| 自定义挂到栈上 | `OverlayPortal` / `OverlayStack` | 进阶；优先复用现有组件 |

层级（高者在上）：

```text
System 4000  >  Toast 3000  >  Dialog 2000  >  Popup 1000
```

同类型多开时，后进更高（`base + stackIndex`）。

---

## 3. 声明式（组件式）用法

用 React state 控制 `visible`，组件内部经 `OverlayPortal` 进栈，**不要再包 `RN.Modal`**。

### 3.1 BottomSheet

```tsx
import { useState } from "react";
import { BottomSheet, Button } from "@minibot/ui";

function FilterEntry() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>筛选</Button>
      <BottomSheet
        visible={open}
        onClose={() => setOpen(false)}
        title="筛选"
        showCloseButton
        heightRatio={0.5}
      >
        {/* 内容 */}
      </BottomSheet>
    </>
  );
}
```

### 3.2 ActionSheet

```tsx
import { ActionSheet, Button } from "@minibot/ui";

<Button onPress={() => setOpen(true)}>更多</Button>
<ActionSheet
  visible={open}
  onClose={() => setOpen(false)}
  title="选择操作"
  options={[
    { label: "编辑", onPress: () => { setOpen(false); /* ... */ } },
    { label: "删除", destructive: true, onPress: () => { setOpen(false); } },
  ]}
/>
```

### 3.3 Dialog / Alert / Confirm（声明式）

适合 UI 状态与页面绑定、需要受控展示时：

```tsx
import { Dialog, Alert, Confirm } from "@minibot/ui";

<Dialog
  visible={open}
  onClose={() => setOpen(false)}
  title="提示"
  primaryAction={{ label: "知道了", onPress: () => setOpen(false) }}
>
  <Text>自定义内容</Text>
</Dialog>

<Alert
  visible={alertOpen}
  onClose={() => setAlertOpen(false)}
  title="保存成功"
  content="你的更改已写入。"
/>

<Confirm
  visible={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  title="确认删除？"
  content="删除后无法恢复。"
  onConfirm={() => { /* ... */ }}
  onCancel={() => { /* ... */ }}
/>
```

### 3.4 Popup（底层壳）

需要自定义方位 / 锚点时用；BottomSheet、Dialog 等已基于它：

```tsx
import { Popup } from "@minibot/ui";

<Popup
  visible={open}
  onClose={() => setOpen(false)}
  position="bottom"   // top | bottom | left | right | center
  animation="slide-up" // none | fade | slide-up
  overlay
  closeOnMaskPress
>
  {children}
</Popup>
```

Dialog 语义层会设 `overlayType="Dialog"`（层级 2000）；Sheet 默认 `Popup`（1000）。

### 3.5 嵌套浮层（同栈叠层）

多层声明式可同时 `visible`，例如 Sheet A 内再开 Sheet B：

```tsx
<BottomSheet visible={a} onClose={() => setA(false)} title="A">
  <Button onPress={() => setB(true)}>打开 B</Button>
</BottomSheet>

<BottomSheet visible={b} onClose={() => setB(false)} title="B">
  {/* 蒙层 / Android 返回只关栈顶 B，A 仍保留 */}
</BottomSheet>
```

Storybook **OverlayStack → 嵌套叠层** 可点验。

---

## 4. 命令式 / 请求场景

命令式与 Hook **同源**，都进 OverlayStack。不必再套 `ToastProvider` / `DialogProvider`（二者仅为兼容保留的 no-op）。

### 4.1 Toast：请求反馈

```tsx
import { Toast, useToast, Button } from "@minibot/ui";

// 任意处（需已在 ConfigProvider 下）
async function save() {
  Toast.loading("保存中...", 0); // 0 = 不自动关
  try {
    await api.save();
    Toast.hide();
    Toast.success("已保存");
  } catch {
    Toast.hide();
    Toast.fail("保存失败");
  }
}

// 或 Hook（与 Toast.* 同一实现）
function SaveButton() {
  const toast = useToast();
  return (
    <Button
      onPress={async () => {
        toast.loading("提交中...");
        await api.submit();
        toast.success("完成");
      }}
    >
      提交
    </Button>
  );
}
```

常用 API：

| 方法 | 用途 |
|------|------|
| `Toast.show(msg)` / `show({ message, icon, position, durationMs, maskClickable })` | 通用 |
| `Toast.loading(msg?, durationMs?)` | 加载；默认约 3s，传 `0` 需 `hide()` |
| `Toast.success` / `Toast.fail` | 结果 |
| `Toast.hide()` | 关掉当前 Toast |

Toast 层级 **高于** Dialog / Popup，可盖在 Sheet、确认框之上。

### 4.2 Dialog：请求前确认 / 错误告警

```tsx
import { Dialog, useDialog } from "@minibot/ui";

// 静态方法 — 适合 service / 非组件回调
async function removeItem(id: string) {
  const ok = await Dialog.confirm({
    title: "确认删除？",
    content: "删除后无法恢复。",
    confirmText: "删除",
    cancelText: "取消",
  });
  if (!ok) return;
  try {
    await api.remove(id);
    await Dialog.alert({ title: "已删除", content: "操作成功。" });
  } catch (e) {
    await Dialog.alert({
      title: "删除失败",
      content: e instanceof Error ? e.message : "请稍后重试",
    });
  }
}

// Hook — 适合组件内
function Row() {
  const { alert, confirm } = useDialog();
  return (
    <Button
      onPress={async () => {
        const ok = await confirm({ title: "提交订单？", content: "确认后不可撤回。" });
        if (ok) await alert({ title: "已提交" });
      }}
    >
      下单
    </Button>
  );
}
```

| API | 返回值 |
|-----|--------|
| `Dialog.alert(options)` / `alert()` | `Promise<void>`（关闭即 resolve） |
| `Dialog.confirm(options)` / `confirm()` | `Promise<boolean>`（确认 true / 取消 false） |

在 Sheet 已打开时再 `Dialog.alert` / `Toast.show`，会叠在 Sheet 之上；关掉 Dialog/Toast 后 Sheet 仍在。

### 4.3 典型请求编排

```tsx
async function checkout() {
  const ok = await Dialog.confirm({
    title: "确认支付",
    content: `将支付 ¥${amount}`,
  });
  if (!ok) return;

  Toast.loading("支付中...", 0);
  try {
    await api.pay();
    Toast.hide();
    Toast.success("支付成功");
  } catch (e) {
    Toast.hide();
    await Dialog.alert({
      title: "支付失败",
      content: e instanceof Error ? e.message : "请重试",
    });
  }
}
```

---

## 5. 进阶：直接用 Overlay 原语

业务优先用第 3、4 节。仅在要挂自定义节点、或封装新浮层组件时使用。

### 5.1 `OverlayPortal`（声明式桥）

`visible` ↔ `show` / `dismiss`；自身不渲染，内容画在 Host 里：

```tsx
import { OverlayPortal } from "@minibot/ui";

<OverlayPortal
  visible={open}
  options={{
    type: "Popup",       // Popup | Dialog | Toast | System
    hasMask: false,      // 面板自带蒙层时保持 false
    dismissOnBack: true,
    pointerEvents: "box-none",
  }}
  onDismiss={() => setOpen(false)}
>
  {panel}
</OverlayPortal>
```

### 5.2 `OverlayStack`（命令式控制器）

```tsx
import { OverlayStack } from "@minibot/ui";

const id = OverlayStack.show(() => <MyPanel onClose={() => OverlayStack.dismiss(id)} />, {
  type: "System",
  hasMask: true,
  closeOnMask: false,
  dismissOnBack: false,
});

OverlayStack.update(id, <MyPanel step={2} />);
OverlayStack.dismiss(id);
OverlayStack.dismissTop();        // 可选按 type 过滤
OverlayStack.dismissAll("Toast");
OverlayStack.getSnapshot();       // 调试
```

默认表（可被 `options` 覆盖）见 `defaults.ts`：Popup 默认无栈蒙层；Dialog 默认有蒙层；Toast 默认可自动关等。

---

## 6. 行为约定

| 行为 | 说明 |
|------|------|
| 蒙层点击 | 仅 **栈顶** 可交互层响应；下层蒙层不抢关 |
| Android 返回 | 从栈顶向下：跳过 Toast；可 dismiss 的关掉一层；System 默认拦截返回 |
| 主题 / 文案 | Host 在 Sibling 旁路，经 bridge 同步 `ConfigProvider` 的 theme / locale |
| 退场动画 | Sheet 的 slide 仍由组件内 `useSlideUpOverlay` 负责；返回键直接出栈时可能跳过退场动画（已知取舍） |

---

## 7. 已知限制

- **盖不住** 外部 `RN.Modal`、系统 `PickerIOS`、键盘等更高原生层。
- Kit 内浮层勿再私建 `Modal`，否则 Toast 无法盖在上面、也无法与其它 Sheet 同栈。
- Storybook 画廊若嵌套多层 Provider，保证最内层仍是带 `RootSiblingParent` 的 `ConfigProvider`（本仓 preview / Gallery 已接好）。

---

## 8. 相关导出

```ts
// 业务常用
import {
  ConfigProvider,
  BottomSheet,
  ActionSheet,
  Popup,
  Dialog,
  Alert,
  Confirm,
  Toast,
  useToast,
  useDialog,
  DropdownMenu,
} from "@minibot/ui";

// 进阶 / 封装新浮层
import {
  OverlayStack,
  OverlayPortal,
  OverlayLevels,
} from "@minibot/ui";
```

本目录源码：`controller.ts`（栈）、`OverlayHost.tsx`（单 Sibling 宿主）、`OverlayPortal.tsx`（声明式桥）、`defaults.ts` / `types.ts`（层级与默认选项）。
