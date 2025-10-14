import {
  type SelectOption,
  type SelectRenderable,
} from "@opentui/core";
import { useRef, useEffect } from "react";

type DirSelectProps = {
  focused: boolean;
  dirPath: string | null;
  setDirPath: React.Dispatch<React.SetStateAction<string | null>>;
};

export const DirSelect = ({ focused, dirPath, setDirPath }: DirSelectProps) => {
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
      name: "dir2",
      value: "~/coldLab/dir2",
      description: "a cool dir",
    },
    {
      name: "dir2",
      value: "~/coldLab/dir2",
      description: "a cool dir",
    },
    {
      name: "dir2",
      value: "~/coldLab/dir2",
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
          height: 8,
          width: 60,
          marginBottom: 1,
          border: true,
        }}
      >
        <select
          ref={selectRef}
          focused={focused}
          onChange={(_, option) => setDirPath(option?.value)}
          onSelect={(_, option) => setDirPath(option?.value)}
          selectedTextColor="#CBA6F7"
          showScrollIndicator
          options={options}
          style={{ flexGrow: 1 }}
        />
      </box>
    </box>
  );
};
