import type { KeyEvent } from "@opentui/core";
import { useGlobalKeyboard } from "../contexts/GlobalKeyboardContext";
import { useCallback, useState, useEffect } from "react";
import { ConfigRepository } from "../database";
import type { Config } from "../database/types";
import { useAppMenus } from "../hooks/useAppMenus";

type ConfigMenuProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: () => void;
};

export const ConfigMenu = ({ isMenuOpen, setIsMenuOpen }: ConfigMenuProps) => {
  const { handleGlobalKey } = useGlobalKeyboard();
  const [obsidianVault, setObsidianVault] = useState("");
  const [templatesDir, setTemplatesDir] = useState("");
  const [activeInput, setActiveInput] = useState(0);
  const [configRepo] = useState(() => new ConfigRepository());

  const {
    addDebugLog,
  } = useAppMenus();

  useEffect(() => {
    if (isMenuOpen) {
      try {
        const existingConfig = configRepo.find();
        if (existingConfig) {
          setObsidianVault(existingConfig.obsidian_vault);
          setTemplatesDir(existingConfig.templates_dir);
        }
      } catch (error) {
        console.error("Failed to load config:", error);
      }
    }
  }, [isMenuOpen, configRepo]);

  const handleConfigKeyDown = useCallback((key: KeyEvent) => {
    if (key.name === "tab") {
      if (key.shift) {
        setActiveInput(prev => Math.max(0, prev - 1));
      } else {
        setActiveInput(prev => Math.min(1, prev + 1));
      }
      return;
    }
    
    if (handleGlobalKey(key)) {
      return;
    }

    if (key.name === "return" || key.name === "enter") {
      handleSave();
    }
  }, [handleGlobalKey]);

  const handleSave = useCallback(() => {
    try {
      const config: Config = {
        obsidian_vault: obsidianVault,
        templates_dir: templatesDir
      };

      addDebugLog(`config:, ${config.obsidian_vault}`);

      const updated = configRepo.update(config);
      if (!updated) {
        configRepo.create(config);
      }

      setIsMenuOpen();
    } catch (error) {
      console.error("Failed to save config:", error);
    }
  }, [obsidianVault, templatesDir, configRepo, setIsMenuOpen]);

  if (!isMenuOpen) return null;

  return (
    <box
      style={{
        position: "absolute",
        top: "20%",
        left: "15%",
        width: "70%",
        height: "60%",
        border: true,
        backgroundColor: "#2A2A40",
        zIndex: 1000
      }}
    >
      <box flexDirection="column" padding={2}>
        <text marginBottom={2}>
          Configuration Settings (Tab to navigate, Enter to save, Escape to close)
        </text>
        
        <box flexDirection="column" gap={2}>
          <box flexDirection="column">
            <text marginBottom={1}>
              Obsidian Vault Path:
            </text>
            <box border={true} height={3} style={{ backgroundColor: activeInput === 0 ? "#414868" : "#2A2A40" }}>
              <input
                placeholder="Enter path to your Obsidian vault..."
                value={obsidianVault}
                focused={activeInput === 0}
                onKeyDown={handleConfigKeyDown}
                onInput={setObsidianVault}
                style={{ width: "100%" }}
                focusedBackgroundColor="#414868"
                backgroundColor="#2A2A40"
              />
            </box>
          </box>

          <box flexDirection="column">
            <text marginBottom={1}>
              Templates Directory:
            </text>
            <box border={true} style={{ backgroundColor: activeInput === 1 ? "#414868" : "#2A2A40" }}>
              <input
                placeholder="Enter path to your templates directory..."
                value={templatesDir}
                focused={activeInput === 1}
                onKeyDown={handleConfigKeyDown}
                onInput={setTemplatesDir}
                style={{ width: "100%" }}
              />
            </box>
          </box>
        </box>

        <box flexDirection="row" justifyContent="center" marginTop={3}>
          <box border={true} padding={1} >
            <text>Tab: Next Field | Enter: Save | Escape: Cancel</text>
          </box>
        </box>
      </box>
    </box>
  );
};
