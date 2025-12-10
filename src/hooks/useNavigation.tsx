import type { KeyEvent } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import { useCallback } from "react";

export type VimKeyHandler = {
  onLeft?: () => void;
  onRight?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  onTab?: () => void;
  onShiftTab?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onEscape?: () => void;
  onCustom?: (key: string) => void;
};

export const useNavigation = (handlers: VimKeyHandler) => {
  const handleKeyPress = useCallback(
    (key: KeyEvent) => {
      // if (key.name === 'h' || key.name === 'left') {
      //   handlers.onLeft?.();
      // } else if (key.name === 'l' || key.name === 'right') {
      //   handlers.onRight?.();
      // } else if (key.name === 'k' || key.name === 'up') {
      //   handlers.onUp?.();
      // } else if (key.name === 'j' || key.name === 'down') {
      //   handlers.onDown?.();
      // }
      if (key.name === "tab" && key.shift) {
        handlers.onShiftTab?.();
      } else if (key.name === "tab") {
        handlers.onTab?.();
      } else if (key.name === "return" || key.name === "enter") {
        handlers.onEnter?.();
      } else if (key.name === "space") {
        handlers.onSpace?.();
      } else if (key.name === "escape") {
        handlers.onEscape?.();
      }
    },
    [handlers],
  );

  useKeyboard(handleKeyPress);
};
