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

export const tabOptions: TabSelectObject[] = [
  { name: "Name", description: "Manage your notes" },
  {
    name: "Aliases",
    description: "Select aliases to be applied to the note",
  },
  {
    name: "Directory",
    description: "Select the directory to save your note",
  },
  {
    name: "Template",
    description: "Select note template",
  },
  {
    name: "Tags",
    description: "Select tags to be applied to the note",
  },
  {
    name: "Create",
    description: "Create note",
  },
];
