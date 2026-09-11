# Form 表单 — Design

Date: 2026-09-11  
Status: approved  
References:
- [antd-mobile Form](https://mobile.ant.design/zh/components/form/)
- [antd-mobile-rn Form](https://rn.mobile.ant.design/components/form-cn)
- [Vant Form](https://vant-ui.github.io/vant/#/zh-CN/form) (UX cues only)

## Decision

- Engine: **`rc-field-form`** (antd-mobile compatible).
- API surface: `Form` / `Form.Item` / `Form.Header` / `useForm`.
- **Remove** `FormField` — replaced by `Form.Item` layout (label / required / error / help).

## API

### `Form`

| Prop | Notes |
| --- | --- |
| `form` / `initialValues` / `name` | rc-field-form |
| `validateTrigger` | default `"onChangeText"` (RN-first; Switch uses `onChange`) |
| `onFinish` / `onFinishFailed` / `onValuesChange` / `onFieldsChange` | |
| `layout` | `"vertical"` \| `"horizontal"` — default `vertical` |
| `footer` | Bottom slot (submit button) |
| `disabled` | Disable all items |
| `theme` / `style` | |

### `Form.Item`

| Prop | Notes |
| --- | --- |
| `name` / `rules` / `required` / `initialValue` | |
| `label` / `help` / `disabled` / `hidden` / `noStyle` | |
| `valuePropName` | default `"value"`; Switch → `"checked"` |
| `trigger` | default `"onChangeText"`; Switch → `"onChange"` |
| `validateTrigger` / `dependencies` / `normalize` / `getValueFromEvent` / `getValueProps` | |
| `layout` | override Form layout |
| `childElementPosition` | `"normal"` \| `"right"` (horizontal) |

### `useForm` / `FormInstance`

Standard rc-field-form pick: get/set values, validateFields, resetFields, submit, …

### `Form.Header`

Section title above a group of items.

## Layout

- Vertical: label → control → help/error
- Horizontal: label | control, error below
- Required asterisk when `required` or rules contain required

## Demos

1. 基础用法 + footer 提交  
2. 校验规则  
3. 自定义 validator  
4. 表单方法（submit / reset）  
5. Switch（`valuePropName="checked"` `trigger="onChange"`）

## Out of scope

- `Form.List` / `Form.Subscribe` / `Form.Array`
- scroll-to-field
- CSS variables

## Files

- Add `packages/ui/src/components/forms/form/`
- Remove `packages/ui/src/components/forms/form-field/`
- Dependency: `rc-field-form`
- Gallery: `FormField` → `Form`
