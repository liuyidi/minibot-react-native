import { type ReactNode } from "react";

import { OverlayStack } from "../../../overlay";
import type { UiTheme } from "../../../theme/types";
import { Alert } from "./Alert";
import { Confirm } from "./Confirm";

export type DialogAlertOptions = {
  title?: string;
  content?: ReactNode;
  confirmText?: string;
  closeOnMaskPress?: boolean;
};

export type DialogConfirmOptions = {
  title?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  closeOnMaskPress?: boolean;
};

export type DialogApi = {
  alert: (options: DialogAlertOptions) => Promise<void>;
  confirm: (options: DialogConfirmOptions) => Promise<boolean>;
};

function dialogAlert(options: DialogAlertOptions): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    let id = "";
    const finish = () => {
      if (settled) return;
      settled = true;
      OverlayStack.dismiss(id);
      resolve();
    };
    id = OverlayStack.show(
      <Alert
        visible
        title={options.title}
        content={options.content}
        confirmText={options.confirmText}
        closeOnMaskPress={options.closeOnMaskPress}
        onClose={finish}
      />,
      {
        type: "Dialog",
        hasMask: false,
        closeOnMask: false,
        dismissOnBack: true,
        pointerEvents: "box-none",
        onDismiss: finish,
      },
    );
  });
}

function dialogConfirm(options: DialogConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    let id = "";
    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      OverlayStack.dismiss(id);
      resolve(value);
    };
    id = OverlayStack.show(
      <Confirm
        visible
        title={options.title}
        content={options.content}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        closeOnMaskPress={options.closeOnMaskPress}
        onConfirm={() => finish(true)}
        onCancel={() => finish(false)}
        onClose={() => finish(false)}
      />,
      {
        type: "Dialog",
        hasMask: false,
        closeOnMask: false,
        dismissOnBack: true,
        pointerEvents: "box-none",
        onDismiss: () => finish(false),
      },
    );
  });
}

export const dialogApi: DialogApi = {
  alert: dialogAlert,
  confirm: dialogConfirm,
};

export function useDialog(): DialogApi {
  return dialogApi;
}

export type DialogProviderProps = {
  children: ReactNode;
  theme?: Partial<UiTheme>;
};

/**
 * No-op wrapper kept for Storybook / older call sites.
 * Dialog.alert / useDialog mount via OverlayStack.
 */
export function DialogProvider({ children }: DialogProviderProps) {
  return <>{children}</>;
}
