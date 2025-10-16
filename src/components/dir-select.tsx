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
import { join } from "path";

type DirSelectProps = {
  focused: boolean;
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  tabOptions: TabSelectObject[];
};

export const DirSelect = ({
  focused,
  selectedTab,
  setSelectedTab,
  tabOptions,
}: DirSelectProps) => {
  const { noteData, setDirPath } = useNoteContext();
  const { handleKeyDown } = useTabNavigation(selectedTab, setSelectedTab, tabOptions);
  const { handleGlobalKey } = useGlobalKeyboard();
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [configRepo] = useState(() => new ConfigRepository());

  useEffect(() => {
    try {
      const config = configRepo.find();
      if (config?.obsidian_vault) {
        const vaultPath = config.obsidian_vault.replace(/^~/, process.env.HOME || '');
        
        try {
          const entries = readdirSync(vaultPath);
          const dirs = entries
            .filter(entry => {
              try {
                const fullPath = join(vaultPath, entry);
                return statSync(fullPath).isDirectory() && !entry.startsWith('.');
              } catch {
                return false;
              }
            })
            .sort()
            .map(dir => ({
              name: dir,
              value: join(vaultPath, dir),
              description: `Directory in ${config.obsidian_vault}`,
            }));
          
          setOptions(dirs);
        } catch (error) {
          console.error("Failed to read vault directory:", error);
          setOptions([{
            name: "Error",
            value: "",
            description: "Could not read vault directory. Check config.",
          }]);
        }
      } else {
        setOptions([{
          name: "No vault configured",
          value: "",
          description: "Open config (Ctrl+P) to set Obsidian vault path",
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

  const selectedIndex = noteData.dirPath ? options.findIndex(opt => opt.value === noteData.dirPath) : -1;
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
