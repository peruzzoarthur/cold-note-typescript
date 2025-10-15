import { useCallback } from "react";
import { useNoteContext } from "../contexts/NoteContext";
import type { TabSelectObject } from "../types";
import { useTabNavigation } from "../hooks/useTabNavigation";
import { useGlobalKeyboard } from "../contexts/GlobalKeyboardContext";
import type { KeyEvent } from "@opentui/core";

type AliasesInputProps = {
  focused: boolean;
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  tabOptions: TabSelectObject[];
};

export const AliasesInput = ({
  focused,
  selectedTab,
  setSelectedTab,
  tabOptions,
}: AliasesInputProps) => {
  const { noteData, setAliases } = useNoteContext();
  const { handleKeyDown } = useTabNavigation(
    selectedTab,
    setSelectedTab,
    tabOptions,
  );
  const { handleGlobalKey } = useGlobalKeyboard();

  const handleAliasesChange = useCallback(
    (value: string) => {
      setAliases(value);
    },
    [setAliases],
  );

  const handleInputKeyDown = useCallback((key: KeyEvent) => {
    // Check global keys first
    if (handleGlobalKey(key)) {
      return; // Global key was handled, don't process further
    }
    
    // Handle local navigation
    handleKeyDown(key);
  }, [handleGlobalKey, handleKeyDown]);
  return (
    <box style={{ border: true, width: 40, height: 3 }}>
      <input
        placeholder="Enter aliases..."
        value={noteData.aliases ?? undefined}
        focused={focused}
        onKeyDown={handleInputKeyDown}
        onInput={handleAliasesChange}
      />
    </box>
  );
};
