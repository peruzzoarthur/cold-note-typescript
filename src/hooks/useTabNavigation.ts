import type { KeyEvent } from "@opentui/core";
import type { TabSelectObject } from "../types";

export const useTabNavigation = (
  selectedTab: number,
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>,
  tabOptions: TabSelectObject[]
) => {
  const handleKeyDown = (key: KeyEvent): void => {
    if (key.name === "return" || key.name === "enter") {
      const newIndex = (selectedTab + 1) % tabOptions.length;
      setSelectedTab(newIndex);
    }
  };

  return { handleKeyDown };
};