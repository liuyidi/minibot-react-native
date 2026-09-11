import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import RcForm, {
  useForm as useRcForm,
  type FormInstance,
  type FormProps as RcFormProps,
} from "rc-field-form";
import type { Rule } from "rc-field-form/es/interface";

import type { UiTheme } from "../../../theme/types";
import { withStatics } from "../../../utils/withStatics";
import { FormContext, type FormLayout } from "./context";
import { FormHeader } from "./FormHeader";
import { FormItem } from "./FormItem";

export type { FormInstance } from "rc-field-form";
export type { Rule } from "rc-field-form/es/interface";

export type FormProps<Values = unknown> = Pick<
  RcFormProps<Values>,
  | "form"
  | "name"
  | "initialValues"
  | "preserve"
  | "validateMessages"
  | "onFieldsChange"
  | "onValuesChange"
  | "onFinish"
  | "onFinishFailed"
  | "children"
> & {
  /**
   * When to validate. RN text fields use `onChangeText` by default.
   * @default "onChangeText"
   */
  validateTrigger?: RcFormProps["validateTrigger"];
  /** @default "vertical" */
  layout?: FormLayout;
  disabled?: boolean;
  /** Show field errors under controls. @default true */
  hasFeedback?: boolean;
  footer?: ReactNode;
  theme?: Partial<UiTheme>;
  style?: StyleProp<ViewStyle>;
};

function FormInner<Values = unknown>(
  {
    form,
    name,
    initialValues,
    preserve,
    validateMessages,
    validateTrigger = "onChangeText",
    onFieldsChange,
    onValuesChange,
    onFinish,
    onFinishFailed,
    children,
    layout = "vertical",
    disabled = false,
    hasFeedback = true,
    footer,
    style,
  }: FormProps<Values>,
  ref: Ref<FormInstance<Values>>,
) {
  const [wrapForm] = useRcForm<Values>();
  const formInstance = (form ?? wrapForm) as FormInstance<Values>;

  useImperativeHandle(ref, () => formInstance);

  const ctx = useMemo(
    () => ({ name, layout, disabled, hasFeedback }),
    [name, layout, disabled, hasFeedback],
  );

  return (
    <FormContext.Provider value={ctx}>
      <View style={[styles.root, style]}>
        <RcForm
          form={formInstance}
          name={name}
          initialValues={initialValues}
          preserve={preserve}
          validateMessages={validateMessages}
          validateTrigger={validateTrigger}
          onFieldsChange={onFieldsChange}
          onValuesChange={onValuesChange}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          component={false}
        >
          {children}
        </RcForm>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </FormContext.Provider>
  );
}

type FormComponent = (<Values = unknown>(
  props: FormProps<Values> & { ref?: Ref<FormInstance<Values>> },
) => ReactElement | null) & {
  Item: typeof FormItem;
  Header: typeof FormHeader;
  useForm: typeof useRcForm;
};

const FormRoot = forwardRef(FormInner);

/** Form shell aligned with antd-mobile (rc-field-form). */
export const Form = withStatics(
  FormRoot as unknown as (props: FormProps) => ReactElement | null,
  {
    Item: FormItem,
    Header: FormHeader,
    useForm: useRcForm,
  },
) as FormComponent;

export const useForm = useRcForm;

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  footer: {
    marginTop: 16,
    gap: 10,
  },
});
