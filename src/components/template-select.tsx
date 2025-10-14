import {
  type SelectOption,
  type SelectRenderable,
} from "@opentui/core";
import { useRef, useEffect } from "react";
import type { TabSelectObject } from "../types";
import { useTabNavigation } from "../hooks/useTabNavigation";
import { useNoteContext } from "../contexts/NoteContext";

type TemplateSelectProps = {
  focused: boolean;
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  tabOptions: TabSelectObject[];
};

export const TemplateSelect = ({
  focused,
  selectedTab,
  setSelectedTab,
  tabOptions,
}: TemplateSelectProps) => {
  const { noteData, setTemplatePath } = useNoteContext();
  const { handleKeyDown } = useTabNavigation(selectedTab, setSelectedTab, tabOptions);
  const options: SelectOption[] = [
    {
      name: "template1",
      value: "~/coldLab/template1",
      description: "a cool dir",
    },
    {
      name: "template2",
      value: "~/coldLab/template2",
      description: "a cool dir",
    },
    {
      name: "template3",
      value: "~/coldLab/template3",
      description: "a cool dir",
    },
    {
      name: "template4",
      value: "~/coldLab/template4",
      description: "a cool dir",
    },
    {
      name: "template5",
      value: "~/coldLab/template5",
      description: "a cool dir",
    },
  ];

  const selectedIndex = noteData.templatePath
    ? options.findIndex((opt) => opt.value === noteData.templatePath)
    : -1;
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
          onChange={(_, option) => setTemplatePath(option?.value)}
          onSelect={(_, option) => setTemplatePath(option?.value)}
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
