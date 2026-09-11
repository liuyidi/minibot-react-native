/** Panel placement for Popup. */
export type PopupPosition = "top" | "bottom" | "left" | "right" | "center";

/** Window-space rect used to dock the panel. */
export type PopupAnchor = {
  y: number;
  height: number;
};

export type PopupAnimation = "none" | "fade" | "slide-up";

export type PopupCloseIconPosition = "top-right" | "top-left";
