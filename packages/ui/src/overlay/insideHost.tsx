import { createContext, useContext } from "react";

/**
 * True while rendering OverlayStack entry content inside OverlayHost.
 * Nested OverlayPortal (e.g. Dialog.alert → Alert → Popup) must paint
 * inline — another show/notify would infinite-loop the host.
 */
export const InsideOverlayHostContext = createContext(false);

export function useInsideOverlayHost(): boolean {
  return useContext(InsideOverlayHostContext);
}
