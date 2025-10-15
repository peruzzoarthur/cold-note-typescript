import { useCallback } from "react";
import type { TabSelectObject } from "../types";
import { useTabNavigation } from "../hooks/useTabNavigation";
import { useNoteContext } from "../contexts/NoteContext";
import { useGlobalKeyboard } from "../contexts/GlobalKeyboardContext";
import type { KeyEvent } from "@opentui/core";

type NoteNameInputProps = {
  focused: boolean;
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  tabOptions: TabSelectObject[];
};

export const NoteNameInput = ({
  focused,
  selectedTab,
  setSelectedTab,
  tabOptions,
}: NoteNameInputProps) => {
  const { noteData, setNoteName } = useNoteContext();
  const { handleKeyDown } = useTabNavigation(selectedTab, setSelectedTab, tabOptions);
  const { handleGlobalKey } = useGlobalKeyboard();
  
  const handleNoteNameChange = useCallback((value: string) => {
    setNoteName(value);
  }, [setNoteName]);

  const handleInputKeyDown = useCallback((key: KeyEvent) => {
    // Check global keys first
    if (handleGlobalKey(key)) {
      return; // Global key was handled, don't process further
    }
    
    // Handle local navigation
    handleKeyDown(key);
  }, [handleGlobalKey, handleKeyDown]);

  return (
    <box style={{ border: true, width: 40, height: 3  }}>
      <input
        placeholder="Enter note name..."
        value={noteData.noteName ?? undefined}
        focused={focused}
        onKeyDown={handleInputKeyDown}
        onInput={handleNoteNameChange}
      />
    </box>
  );
};
