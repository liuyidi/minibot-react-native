import {
  cloneElement,
  isValidElement,
  useContext,
  useMemo,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Field, type FormInstance } from "rc-field-form";
import type { FieldProps } from "rc-field-form/es/Field";
import type { NamePath, Rule } from "rc-field-form/es/interface";

import { useResolvedTheme } from "../../../theme/ThemeProvider";
import type { UiTheme } from "../../../theme/types";
import { FormContext, type FormLayout } from "./context";

function toArray<T>(value?: T | T[]): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export type FormItemProps = {
  name?: NamePath;
  label?: ReactNode;
  help?: ReactNode;
  /** Show feedback errors under the control. @default from Form */
  hasFeedback?: boolean;
  required?: boolean;
  /** Skip label/error chrome; still binds the field when `name` is set. */
  noStyle?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  layout?: FormLayout;
  /**
   * In horizontal layout, put the control on the right.
   * @default "normal"
   */
  childElementPosition?: "normal" | "right";
  rules?: Rule[];
  /**
   * Child value prop. Switch → `"checked"`.
   * @default "value"
   */
  valuePropName?: string;
  /**
   * Event that updates the field.
   * RN inputs default to `"onChangeText"`; Switch → `"onChange"`.
   * @default "onChangeText"
   */
  trigger?: string;
  validateTrigger?: string | string[] | false;
  dependencies?: NamePath[];
  initialValue?: unknown;
  normalize?: FieldProps["normalize"];
  getValueFromEvent?: FieldProps["getValueFromEvent"];
  getValueProps?: FieldProps["getValueProps"];
  preserve?: boolean;
  validateFirst?: boolean | "parallel";
  messageVariables?: Record<string, string>;
  shouldUpdate?: FieldProps["shouldUpdate"];
  children?: ReactNode | ((form: FormInstance) => ReactNode);
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

function FormItemLayout({
  label,
  help,
  required,
  errors,
  layout,
  childElementPosition,
  hasFeedback,
  hidden,
  children,
  theme: themeOverride,
  style,
}: {
  label?: ReactNode;
  help?: ReactNode;
  required?: boolean;
  errors: string[];
  layout: FormLayout;
  childElementPosition: "normal" | "right";
  hasFeedback: boolean;
  hidden?: boolean;
  children: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
}) {
  const palette = useResolvedTheme(themeOverride);
  if (hidden) return null;

  const labelNode =
    label != null && label !== false ? (
      <View style={styles.labelRow}>
        {required ? (
          <Text style={[styles.asterisk, { color: palette.red }]}>*</Text>
        ) : null}
        {typeof label === "string" || typeof label === "number" ? (
          <Text style={[styles.label, { color: palette.heading }]}>{label}</Text>
        ) : (
          label
        )}
      </View>
    ) : null;

  const feedback =
    hasFeedback && errors.length > 0 ? (
      <View style={styles.feedback}>
        {errors.map((err, i) => (
          <Text key={`${err}-${i}`} style={[styles.error, { color: palette.red }]}>
            {err}
          </Text>
        ))}
      </View>
    ) : help != null && help !== false ? (
      <View style={styles.feedback}>
        {typeof help === "string" || typeof help === "number" ? (
          <Text style={[styles.help, { color: palette.muted }]}>{help}</Text>
        ) : (
          help
        )}
      </View>
    ) : null;

  if (layout === "horizontal") {
    return (
      <View
        style={[
          styles.item,
          styles.itemHorizontal,
          { borderBottomColor: palette.border },
          style,
        ]}
      >
        {labelNode ? <View style={styles.hLabel}>{labelNode}</View> : null}
        <View
          style={[
            styles.hControl,
            childElementPosition === "right" ? styles.hControlRight : null,
          ]}
        >
          {children}
          {feedback}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.item, styles.itemVertical, style]}>
      {labelNode}
      {children}
      {feedback}
    </View>
  );
}

export function FormItem({
  name,
  label,
  help,
  hasFeedback: hasFeedbackProp,
  required,
  noStyle = false,
  disabled: disabledProp,
  hidden,
  layout: layoutProp,
  childElementPosition = "normal",
  rules,
  valuePropName = "value",
  trigger = "onChangeText",
  validateTrigger,
  dependencies,
  initialValue,
  normalize,
  getValueFromEvent,
  getValueProps,
  preserve,
  validateFirst,
  messageVariables,
  shouldUpdate,
  children,
  theme,
  style,
}: FormItemProps) {
  const formCtx = useContext(FormContext);
  const layout = layoutProp ?? formCtx.layout;
  const disabled = disabledProp ?? formCtx.disabled;
  const hasFeedback = hasFeedbackProp ?? formCtx.hasFeedback;
  const mergedValidateTrigger =
    validateTrigger === undefined ? trigger : validateTrigger;

  const isRequired = useMemo(() => {
    if (required != null) return required;
    return Boolean(
      rules?.some(
        (rule) =>
          rule && typeof rule === "object" && !Array.isArray(rule) && rule.required,
      ),
    );
  }, [required, rules]);

  const renderLayout = (
    control: ReactNode,
    errors: string[],
  ) => {
    if (noStyle && !hidden) return <>{control}</>;
    return (
      <FormItemLayout
        label={label}
        help={help}
        required={isRequired}
        errors={errors}
        layout={layout}
        childElementPosition={childElementPosition}
        hasFeedback={hasFeedback}
        hidden={hidden}
        theme={theme}
        style={style}
      >
        {control}
      </FormItemLayout>
    );
  };

  const isRenderProps = typeof children === "function";

  if (!name && !isRenderProps && !dependencies) {
    return <>{renderLayout(children as ReactNode, [])}</>;
  }

  const variables = {
    label: typeof label === "string" ? label : "",
    ...messageVariables,
  };

  return (
    <Field
      name={name}
      rules={rules}
      dependencies={dependencies}
      shouldUpdate={shouldUpdate}
      initialValue={initialValue}
      normalize={normalize}
      getValueFromEvent={getValueFromEvent}
      getValueProps={getValueProps}
      preserve={preserve}
      validateFirst={validateFirst}
      valuePropName={valuePropName}
      trigger={trigger}
      validateTrigger={mergedValidateTrigger}
      messageVariables={variables}
    >
      {(control, meta, form) => {
        let childNode: ReactNode = null;

        if (isRenderProps) {
          childNode = (children as (form: FormInstance) => ReactNode)(form);
        } else if (isValidElement(children)) {
          const element = children as ReactElement<Record<string, unknown>>;
          const controlProps = control as Record<string, unknown>;
          const childProps: Record<string, unknown> = {
            ...(element.props as Record<string, unknown>),
            ...controlProps,
            disabled:
              disabled || Boolean((element.props as { disabled?: boolean }).disabled),
          };

          const triggers = new Set([
            ...toArray(trigger),
            ...toArray(
              mergedValidateTrigger === false ? [] : mergedValidateTrigger,
            ),
          ]);
          triggers.forEach((eventName) => {
            if (!eventName) return;
            childProps[eventName] = (...args: unknown[]) => {
              const fromControl = controlProps[eventName];
              if (typeof fromControl === "function") {
                (fromControl as (...a: unknown[]) => void)(...args);
              }
              const origin = (element.props as Record<string, unknown>)[
                eventName
              ];
              if (typeof origin === "function") {
                (origin as (...a: unknown[]) => void)(...args);
              }
            };
          });

          childNode = cloneElement(element, childProps);
        } else {
          childNode = children as ReactNode;
        }

        return renderLayout(childNode, meta.errors ?? []);
      }}
    </Field>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 12,
  },
  itemVertical: {
    gap: 8,
  },
  itemHorizontal: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 4,
    gap: 12,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 20,
  },
  asterisk: {
    fontSize: 15,
    lineHeight: 20,
  },
  hLabel: {
    width: 88,
    paddingTop: 10,
  },
  hControl: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  hControlRight: {
    alignItems: "flex-end",
  },
  feedback: {
    gap: 2,
  },
  error: {
    fontSize: 13,
    lineHeight: 18,
  },
  help: {
    fontSize: 13,
    lineHeight: 18,
  },
});
