import type { Components, JSX } from "../types/components";

interface WcDatepicker extends Components.WcDatepicker, HTMLElement {}
export const WcDatepicker: {
  prototype: WcDatepicker;
  new (): WcDatepicker;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
