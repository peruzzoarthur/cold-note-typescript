import { type SelectOption, type SelectRenderable } from "@opentui/core";
import { useRef, useEffect } from "react";

type TemplateSelectProps = {
  focused: boolean;
  templatePath: string | null;
  setTemplatePath: React.Dispatch<React.SetStateAction<string | null>>;
};

export const TemplateSelect = ({
  focused,
  templatePath,
  setTemplatePath,
}: TemplateSelectProps) => {
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

  const selectedIndex = templatePath
    ? options.findIndex((opt) => opt.value === templatePath)
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
          selectedTextColor="#CBA6F7"
          showScrollIndicator
          options={options}
          style={{ flexGrow: 1 }}
        />
      </box>
    </box>
  );
};
