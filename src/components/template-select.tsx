import {
  type SelectOption,
  type SelectRenderable,
  type KeyEvent,
} from "@opentui/core";
import { useRef, useEffect, useCallback, useState } from "react";
import type { TabSelectObject } from "../types";
import { useTabNavigation } from "../hooks/useTabNavigation";
import { useNoteContext } from "../contexts/NoteContext";
import { useGlobalKeyboard } from "../contexts/GlobalKeyboardContext";
import { ConfigRepository } from "../database";
import { readdirSync, statSync } from "fs";
import { join, extname } from "path";

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
  const { handleGlobalKey } = useGlobalKeyboard();
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [configRepo] = useState(() => new ConfigRepository());

  useEffect(() => {
    try {
      const config = configRepo.find();
      if (config?.templates_dir) {
        const templatesPath = config.templates_dir.replace(/^~/, process.env.HOME || '');
        
        try {
          const entries = readdirSync(templatesPath);
          const templates = entries
            .filter(entry => {
              try {
                const fullPath = join(templatesPath, entry);
                const isFile = statSync(fullPath).isFile();
                const isMarkdown = extname(entry) === '.md';
                return isFile && isMarkdown && !entry.startsWith('.');
              } catch {
                return false;
              }
            })
            .sort()
            .map(template => ({
              name: template.replace('.md', ''),
              value: join(templatesPath, template),
              description: `Template in ${config.templates_dir}`,
            }));
          
          setOptions(templates);
        } catch (error) {
          console.error("Failed to read templates directory:", error);
          setOptions([{
            name: "Error",
            value: "",
            description: "Could not read templates directory. Check config.",
          }]);
        }
      } else {
        setOptions([{
          name: "No templates configured",
          value: "",
          description: "Open config (Ctrl+P) to set templates directory path",
        }]);
      }
    } catch (error) {
      console.error("Failed to load config:", error);
      setOptions([]);
    }
  }, [configRepo]);

  const handleSelectKeyDown = useCallback((key: KeyEvent) => {
    // Check global keys first
    if (handleGlobalKey(key)) {
      return;
    }
    
    // Handle local navigation
    handleKeyDown(key);
  }, [handleGlobalKey, handleKeyDown]);

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
          onKeyDown={handleSelectKeyDown}
          selectedTextColor="#CBA6F7"
          showScrollIndicator
          options={options}
          style={{ flexGrow: 1 }}
        />
      </box>
    </box>
  );
};
