# `@minibot/ui` 日历 / 时间选择器统一设计

**Date:** 2026-09-11  
**Status:** Accepted (implementation in progress)  
**Package:** `packages/ui`

---

## 1. 目标

提供可组合的日期/时间选择能力，覆盖：

| 场景 | 带弹层 | 纯面板 |
|------|--------|--------|
| 通用滚轮 | `Picker` | `PickerView` |
| 纯时间 | `TimePicker` | `TimePickerView` |
| 滚轮日期 / 日期时间 | `DatePicker` / `DateTimePicker` | `DatePickerView` / `DateTimePickerView`（同目录 `date-picker/`） |
| 日历单日 / 区间 | `CalendarPicker` | `CalendarPickerView`（含内部 `CalendarGrid`） |
| 日历区间 + 双时间 | `CalendarRangeWithTime` | `CalendarRangeWithTimeView` |

Storybook 主预览三项：`CalendarPicker 日历选择`、`DatePicker 日期选择`、`TimePicker 时间选择`。

## 2. 命名约定（硬规则）

| 后缀 | 含义 | 对内 / 对外 |
|------|------|-------------|
| `Xxx`（无后缀） | **带 Popup**（`visible` / `onClose` / `onConfirm`） | 默认入口 |
| `XxxView` | **不带 Popup** 的纯内容面板 | 嵌入与组合 |

- `Picker` 与 `PickerView` **同目录**：`forms/picker/{Picker,PickerView,index}.tsx`
- 其它日期时间日历组件同样：`forms/time-picker/{TimePicker,TimePickerView}.tsx` 等
- 内部组合（如 `CalendarRangeWithTimeView`）只引用 `*View`，不引用带弹层组件

```tsx
<TimePicker visible={open} onClose={...} value={t} onConfirm={setT} />
<TimePickerView value={t} onChange={setT} />
```

共享壳：`PickerPopupShell`（`forms/picker/` **内部模块**，不对外导出；业务只用 `Picker` / `TimePicker` 等）。

## 3. 架构（分层）

```text
L0  src/date/          parse · format · calendar-math · holidays/cn
L1  `forms/picker/`：PickerColumn → PickerView → Picker；PickerGroup；PickerRow
L2  calendar-grid
L3  *View + *（弹层）
L4  组合套装 View + 弹层
```

## 4. 值类型

- **对外**：字符串。日期 `YYYY-MM-DD`，时间 `HH:mm`，日期时间 `YYYY-MM-DDTHH:mm`。
- **区间**：`{ start, end }` 或 `{ startDate, startTime, endDate, endTime }`。
- **对内**：`Date`；导出 `parse*` / `format*`。

## 5. 节假日

内置中国法定放假/调休（按年），可 `holidayMap` / `setHolidayOverrides` 覆盖。

## 6. 非目标（首期）

- 命令式 `CalendarPicker.show`
- 农历显示
- 多选（非区间）日期

## 7. 导出

根 barrel 同时导出 `Xxx` 与 `XxxView`；`exports:gen` 短路径按文件夹。
