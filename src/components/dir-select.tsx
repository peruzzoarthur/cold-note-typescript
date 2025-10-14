import {
  type SelectOption,
  type SelectRenderable,
} from "@opentui/core";
import { useRef, useEffect } from "react";
import type { TabSelectObject } from "../types";
import { useTabNavigation } from "../hooks/useTabNavigation";

type DirSelectProps = {
  focused: boolean;
  dirPath: string | null;
  setDirPath: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  tabOptions: TabSelectObject[];
};

export const DirSelect = ({
  focused,
  dirPath,
  setDirPath,
  selectedTab,
  setSelectedTab,
  tabOptions,
}: DirSelectProps) => {
  const { handleKeyDown } = useTabNavigation(selectedTab, setSelectedTab, tabOptions);
  const options: SelectOption[] = [
    {
      name: "dir1",
      value: "~/coldLab/dir1",
      description: "a cool dir",
    },
    {
      name: "dir2",
      value: "~/coldLab/dir2",
      description: "a cool dir",
    },
    {
      name: "dir3",
      value: "~/coldLab/dir3",
      description: "a cool dir",
    },
    {
      name: "dir4",
      value: "~/coldLab/dir4",
      description: "a cool dir",
    },
    {
      name: "dir5",
      value: "~/coldLab/dir5",
      description: "a cool dir",
    },
  ];

  const selectedIndex = dirPath ? options.findIndex(opt => opt.value === dirPath) : -1;
  const selectRef = useRef<SelectRenderable | null>(null);

  useEffect(() => {
    if (selectRef.current && selectedIndex >= 0) {
      selectRef.current.setSelectedIndex(selectedIndex);
    }
  }, [selectedIndex]);

  return (
    <box style={{ paddingLeft: 1, paddingRight: 1 }}>
      <box
        style={{
          height: 12,
          width: 60,
          marginBottom: 1,
          border: true,
        }}
      >
        <select
          ref={selectRef}
          focused={focused}
          onChange={(_, option) => setDirPath(option?.value)}
          onKeyDown={handleKeyDown}
          selectedTextColor="#CBA6F7"
          showScrollIndicator
          options={options}
          style={{ flexGrow: 1 }}
        />
      </box>
    </box>
  );
};
