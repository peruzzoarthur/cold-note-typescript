import { useKeyboard } from "@opentui/react";
import { useCallback, useState } from "react";

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
  const handleKeyPress = useCallback((key: any) => {
    if (key.name === 'h' || key.name === 'left') {
      handlers.onLeft?.();
    } else if (key.name === 'l' || key.name === 'right') {
      handlers.onRight?.();
    } else if (key.name === 'k' || key.name === 'up') {
      handlers.onUp?.();
    } else if (key.name === 'j' || key.name === 'down') {
      handlers.onDown?.();
    } else if (key.name === 'tab' && key.shift) {
      // Handle Shift+Tab
      handlers.onShiftTab?.();
    } else if (key.name === 'tab') {
      handlers.onTab?.();
    } else if (key.name === 'return' || key.name === 'enter') {
      handlers.onEnter?.();
    } else if (key.name === 'space') {
      handlers.onSpace?.();
    } else if (key.name === 'escape') {
      handlers.onEscape?.();
    } else {
      // Pass through any other keys
      handlers.onCustom?.(key.name || key);
    }
  }, [handlers]);

  // Use the built-in OpenTUI keyboard hook
  useKeyboard(handleKeyPress);
};

export type NavigationState = {
  currentIndex: number;
  maxIndex: number;
};

export const useVimNavigation = (maxIndex: number, initialIndex: number = 0) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlers: VimKeyHandler = {
    onLeft: () => setCurrentIndex(prev => Math.max(0, prev - 1)),
    onRight: () => setCurrentIndex(prev => Math.min(maxIndex - 1, prev + 1)),
    onUp: () => setCurrentIndex(prev => Math.max(0, prev - 1)),
    onDown: () => setCurrentIndex(prev => Math.min(maxIndex - 1, prev + 1)),
  };

  useVimKeyboard(handlers);

  return {
    currentIndex,
    setCurrentIndex,
    goLeft: handlers.onLeft!,
    goRight: handlers.onRight!,
    goUp: handlers.onUp!,
    goDown: handlers.onDown!,
  };
};
