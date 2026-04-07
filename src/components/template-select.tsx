import {
  type SelectOption,
  type SelectRenderable,
  type KeyEvent,
} from "@opentui/core";
import { theme } from "../theme";
import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import type { TabSelectObject } from "../types";
import { useTabNavigation } from "../hooks/useTabNavigation";
import { useNoteContext } from "../contexts/NoteContext";
import { useGlobalKeyboard } from "../contexts/AppStateContext";
import { ConfigRepository } from "../database";
import { readdirSync, statSync } from "fs";
import { join, extname } from "path";
import { LAYOUT } from "../constants";

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

  const selectedIndex = useMemo(() => {
    return noteData.templatePath
      ? options.findIndex((opt) => opt.value === noteData.templatePath)
      : -1;
  }, [noteData.templatePath, options]);
  const selectRef = useRef<SelectRenderable | null>(null);

  useEffect(() => {
    if (selectRef.current && selectedIndex >= 0) {
      selectRef.current.setSelectedIndex(selectedIndex);
    }
  }, [selectedIndex]);

  return (
    <box style={{ paddingLeft: LAYOUT.SPACING.SMALL, paddingRight: LAYOUT.SPACING.SMALL }}>
      <box
        style={{
          height: LAYOUT.DIMENSIONS.SELECT_HEIGHT,
          width: LAYOUT.DIMENSIONS.SELECT_WIDTH,
          marginBottom: LAYOUT.SPACING.SMALL,
          border: true,
        }}
      >
        <select
          ref={selectRef}
          focused={focused}
          onChange={(_, option) => setTemplatePath(option?.value)}
          onSelect={(_, option) => setTemplatePath(option?.value)}
          onKeyDown={handleSelectKeyDown}
          selectedTextColor={theme.accent}
          showScrollIndicator
          options={options}
          style={{ flexGrow: 1 }}
        />
      </box>
    </box>
  );
};
