export {
  DialogRoot,
  DialogContentText,
  type DialogAction,
  type DialogProps,
} from "./Dialog";
export { Alert, type AlertProps } from "./Alert";
export { Confirm, type ConfirmProps } from "./Confirm";
export {
  dialogApi,
  useDialog,
  DialogProvider,
  type DialogAlertOptions,
  type DialogConfirmOptions,
  type DialogApi,
  type DialogProviderProps,
} from "./dialogApi";

import type { ReactElement } from "react";
import { DialogRoot, type DialogProps } from "./Dialog";
import { dialogApi, type DialogApi } from "./dialogApi";
import { withStatics } from "../../../utils/withStatics";

/** Declarative Dialog + imperative `Dialog.alert` / `Dialog.confirm`. */
export const Dialog = withStatics(DialogRoot, dialogApi) as ((
  props: DialogProps,
) => ReactElement | null) &
  DialogApi;

export default Dialog;
