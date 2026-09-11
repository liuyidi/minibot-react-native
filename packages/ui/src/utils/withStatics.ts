import { createElement, type ComponentType, type ReactElement } from "react";

/**
 * Attach statics onto a fresh wrapper function.
 * Mutating `forwardRef` / frozen component functions throws
 * "property is not writable" under React 19 + Hermes.
 */
export function withStatics<
  P extends object,
  S extends Record<string, unknown>,
>(Component: ComponentType<P>, statics: S): ComponentType<P> & S {
  function Wrapped(props: P): ReactElement | null {
    return createElement(Component, props);
  }
  return Object.assign(Wrapped, statics);
}
