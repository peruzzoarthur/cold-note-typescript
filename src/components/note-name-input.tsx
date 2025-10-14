import { useCallback } from "react";
import type { TabSelectObject } from "../types";
import { useTabNavigation } from "../hooks/useTabNavigation";
import { useNoteContext } from "../contexts/NoteContext";

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
  
  const handleNoteNameChange = useCallback((value: string) => {
    setNoteName(value);
  }, [setNoteName]);
  return (
    <box style={{ border: true, width: 40, height: 3, marginTop: 1 }}>
      <input
        placeholder="Enter note name..."
        value={noteData.noteName ?? undefined}
        focused={focused}
        onKeyDown={handleKeyDown}
        onInput={handleNoteNameChange}
      />
    </box>
  );
};
