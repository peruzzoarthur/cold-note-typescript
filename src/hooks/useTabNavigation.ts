import type { KeyEvent } from "@opentui/core";
import type { TabSelectObject } from "../types";

export interface UseTabNavigationReturn {
  handleKeyDown: (key: KeyEvent) => void;
}

export const useTabNavigation = (
  selectedTab: number,
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>,
  tabOptions: TabSelectObject[]
): UseTabNavigationReturn => {
  const handleKeyDown = (key: KeyEvent): void => {
    if (key.name === "return" || key.name === "enter") {
      const newIndex = (selectedTab + 1) % tabOptions.length;
      setSelectedTab(newIndex);
    }
  };

  return { handleKeyDown };
};