import type { KeyEvent } from "@opentui/core";
import type { TabSelectObject } from "./types";

export const handleKeyDown = (
  key: KeyEvent,
  selectedTab: number,
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>,
  tabOptions: TabSelectObject[],
): void => {
  if (key.name === "return" || key.name === "enter") {
    const newIndex = (selectedTab + 1) % tabOptions.length;
    setSelectedTab(newIndex);
  }
};
