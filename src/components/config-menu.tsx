import { type KeyEvent } from "@opentui/core";
import { theme } from "../theme";
import { useGlobalKeyboard, useAppMenus } from "../contexts/AppStateContext";
import { useCallback, useState, useEffect, useRef } from "react";
import { ConfigRepository } from "../database";
import type { Config } from "../database/types";
import { Modal } from "./modal";
import { LAYOUT } from "../constants";

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
  const [hasLoadedConfig, setHasLoadedConfig] = useState(false);

  const obsidianVaultRef = useRef("");
  const templatesDirRef = useRef("");

  const { addDebugLog } = useAppMenus();

  useEffect(() => {
    if (isMenuOpen && !hasLoadedConfig) {
      try {
        const existingConfig = configRepo.find();
        if (existingConfig) {
          setObsidianVault(existingConfig.obsidian_vault);
          setTemplatesDir(existingConfig.templates_dir);
          obsidianVaultRef.current = existingConfig.obsidian_vault;
          templatesDirRef.current = existingConfig.templates_dir;
        } else {
          setObsidianVault("");
          setTemplatesDir("");
          obsidianVaultRef.current = "";
          templatesDirRef.current = "";
        }
        setHasLoadedConfig(true);
      } catch (error) {
        console.error("Failed to load config:", error);
      }
    } else if (!isMenuOpen) {
      setHasLoadedConfig(false);
    }
  }, [isMenuOpen, configRepo, addDebugLog, hasLoadedConfig]);

  const handleConfigKeyDown = useCallback(
    (key: KeyEvent) => {
      if (key.name === "tab") {
        if (key.shift) {
          setActiveInput((prev) => Math.max(0, prev - 1));
        } else {
          setActiveInput((prev) => Math.min(1, prev + 1));
        }
        return;
      }

      if (handleGlobalKey(key)) {
        return;
      }

      if (key.name === "return" || key.name === "enter") {
        handleSave();
      }
    },
    [handleGlobalKey],
  );

  const handleSave = () => {
    try {
      const currentVault = obsidianVaultRef.current;
      const currentTemplates = templatesDirRef.current;

      if (!currentVault.trim() || !currentTemplates.trim()) {
        return;
      }

      const config: Config = {
        obsidian_vault: currentVault.trim(),
        templates_dir: currentTemplates.trim(),
      };

      const existingConfig = configRepo.find();
      if (existingConfig) {
        configRepo.update(config);
      } else {
        configRepo.create(config);
      }

      setIsMenuOpen();
    } catch (error) {
      console.error("Failed to save config:", error);
    }
  };

  if (!isMenuOpen) return null;

  return (
    <Modal width={LAYOUT.MODAL.CONFIG_WIDTH} height={LAYOUT.MODAL.CONFIG_HEIGHT} top={LAYOUT.MODAL.CONFIG_TOP} left={LAYOUT.MODAL.CONFIG_LEFT}>
      <box alignItems="center" justifyContent="center">
      <ascii-font font="tiny" text="Configuration menu" />
      </box>
      <box flexDirection="column" padding={LAYOUT.SPACING.MEDIUM} flexGrow={1}>
        <text marginBottom={LAYOUT.SPACING.SMALL}>Obsidian Vault Path:</text>
        <box border={true} height={LAYOUT.DIMENSIONS.INPUT_HEIGHT} marginBottom={LAYOUT.SPACING.SMALL}>
          <input
            placeholder="Enter path to your Obsidian vault..."
            value={obsidianVault}
            focused={activeInput === 0}
            onKeyDown={handleConfigKeyDown}
            onInput={(value) => {
              obsidianVaultRef.current = value;
              setObsidianVault(value);
            }}
          />
        </box>
        <box flexDirection="column">
          <text marginBottom={LAYOUT.SPACING.SMALL}>Templates Directory:</text>
          <box border={true} height={LAYOUT.DIMENSIONS.INPUT_HEIGHT}>
            <input
              placeholder="Enter path to your templates directory..."
              value={templatesDir}
              focused={activeInput === 1}
              onKeyDown={handleConfigKeyDown}
              onInput={(value) => {
                templatesDirRef.current = value;
                setTemplatesDir(value);
              }}
              style={{ width: "100%" }}
              backgroundColor={theme.inactiveBg}
            />
          </box>
        </box>
      </box>
    </Modal>
  );
};
