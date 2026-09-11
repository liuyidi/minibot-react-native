/** Kit locale code — mirrors common ConfigProvider locale keys. */
export type UiLocale = "zh" | "en";

/** Light / dark mode hint (palette still passed as `theme`). */
export type UiMode = "light" | "dark";

export type UiLocaleMessages = {
  close: string;
  confirm: string;
  cancel: string;
  ok: string;
};

export const localeMessages: Record<UiLocale, UiLocaleMessages> = {
  zh: {
    close: "关闭",
    confirm: "确认",
    cancel: "取消",
    ok: "知道了",
  },
  en: {
    close: "Close",
    confirm: "Confirm",
    cancel: "Cancel",
    ok: "OK",
  },
};
