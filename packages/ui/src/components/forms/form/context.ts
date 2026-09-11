import { createContext } from "react";

export type FormLayout = "vertical" | "horizontal";

export type FormContextValue = {
  name?: string;
  layout: FormLayout;
  disabled: boolean;
  hasFeedback: boolean;
};

export const FormContext = createContext<FormContextValue>({
  layout: "vertical",
  disabled: false,
  hasFeedback: true,
});
