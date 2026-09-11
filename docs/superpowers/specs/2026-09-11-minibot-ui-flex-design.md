# `@minibot/ui` Flex 自适应布局设计

**Date:** 2026-09-11  
**Status:** Accepted  
**Package:** `packages/ui`  
**Refs:** [antd-mobile-rn Flex](https://rn.mobile.ant.design/components/flex-cn)、既有 `Space`；栅格/宫格见非目标

---

## 1. 目标

提供 **固定边 + 自适应主区** 的通用布局原语，覆盖：

- 左右 / 左中右（横向）：两侧内容尺寸固定，中间（或某一侧）占满剩余宽度
- 上中下（纵向）：顶/底固定，中间占满剩余高度（常配合 `ScrollView`）

**不**替代 `Space`（间距优先），**不**首期做 24 栅格 / 宫格。

| | Space | Flex |
|--|-------|------|
| 重心 | 子项间距 | 比例 / 占满剩余空间 |
| 典型 | 一排按钮、标签 | 左固定 + 中 `flex:1` + 右固定 |

---

## 2. 组件与目录

```text
packages/ui/src/components/foundation/flex/
  Flex.tsx          # Flex + Flex.Item（Object.assign）
  Flex.stories.tsx
  index.ts
```

分组：`foundation`（与 `space` 并列）。  
导出：根 barrel + `exports:gen` 短路径 `flex`。  
中文名（Gallery）：`Flex 弹性布局`。

---

## 3. API

### 3.1 `Flex`

| Prop | 说明 | 默认 |
|------|------|------|
| `direction` | `horizontal` \| `vertical` | `horizontal` |
| `align` | `start` \| `center` \| `end` \| `stretch` \| `baseline` | — |
| `justify` | `start` \| `end` \| `center` \| `between` \| `around` \| `evenly` | — |
| `wrap` | 是否换行（主要横向有意义） | `false` |
| `gap` | 主间距（px） | `0` |
| `gapHorizontal` / `gapVertical` | 覆盖横/纵间距 | — |
| `block` | 横向时 `width: '100%'` / `alignSelf: 'stretch'` | `true` |
| `style` | 透传 | |
| `children` | 任意节点；需占剩余空间的用 `Flex.Item` | |

`align` / `justify` 枚举与 `Space` 对齐（`between` 等短名），映射到 RN `alignItems` / `justifyContent`。

`gap*` 使用 RN `columnGap` / `rowGap`（与 `Space` 一致）。

### 3.2 `Flex.Item`

| Prop | 说明 | 默认 |
|------|------|------|
| `flex` | 对应 RN `flex` | `1` |
| `style` | 透传 | |
| `children` | | |

实现约定：

- 默认 `flex: 1`（可用 `flex={0}` / 其它数值覆盖）
- 父为横向时默认 `minWidth: 0`；父为纵向时默认 `minHeight: 0`，避免文本/滚动把布局撑破
- **不**强制包一层业务样式；仅布局

`Flex.Item` 需能读到父 `direction`：由 `Flex` 通过 **React context** 下发（轻量），避免调用方重复传。

### 3.3 用法示例

```tsx
import { Flex } from "@minibot/ui";

// 左中右
<Flex align="center" gap={8}>
  <View style={{ width: 40 }}>左</View>
  <Flex.Item>中间自适应</Flex.Item>
  <View style={{ width: 40 }}>右</View>
</Flex>

// 上中下（父需有确定高度或 flex:1）
<Flex direction="vertical" style={{ flex: 1 }}>
  <View style={{ height: 48 }}>顶</View>
  <Flex.Item>
    <ScrollView>{/* ... */}</ScrollView>
  </Flex.Item>
  <View style={{ height: 72 }}>底</View>
</Flex>
```

非 `Flex.Item` 子节点保持固有尺寸（固定边直接放 `View` / 组件即可）。

---

## 4. 实现约束

- 纯 `View` + Yoga，无 gesture-handler / reanimated
- `Flex = Object.assign(FlexRoot, { Item: FlexItem })`
- 不修改 `Space` / `StackHeader` / `ListRow` 行为；后续若内部可选用 `Flex` 属可选重构，非本范围

---

## 5. Storybook

单文件 `Flex.stories.tsx` Family 预览，至少含：

1. 左右 / 左中右（固定 + `Flex.Item`）
2. 上中下（`direction="vertical"` + 中间 `ScrollView`）
3. `justify="between"` 无 Item（对比 Space）
4. 自定义 `flex={2}` 比例

---

## 6. 非目标（本轮）

- Vant 式 `Row` / `Col`、`span` / `offset`、24 栅格
- antd-m `Grid` 宫格
- 响应式断点、`xs`/`md` 等
- 命令式 API

---

## 7. 验收

- [ ] `Flex` / `Flex.Item` 可从 `@minibot/ui` 导入
- [ ] 左中右：中间缩略不把两侧挤出屏
- [ ] 上中下：中间 `ScrollView` 可滚，顶底不被顶飞
- [ ] `exports:gen` / introduce 清单含 `flex`
- [ ] Storybook 预览可交互
