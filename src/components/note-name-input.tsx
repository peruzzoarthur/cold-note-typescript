import { useCallback } from "react";
import type { TabSelectObject } from "../types";
import { useTabNavigation } from "../hooks/useTabNavigation";

type NoteNameInputProps = {
  focused: boolean;
  noteName: string | null;
  setNoteName: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  tabOptions: TabSelectObject[];
};

export const NoteNameInput = ({
  focused,
  noteName,
  setNoteName,
  selectedTab,
  setSelectedTab,
  tabOptions,
}: NoteNameInputProps) => {
  const { handleKeyDown } = useTabNavigation(selectedTab, setSelectedTab, tabOptions);
  
  const handleNoteNameChange = useCallback((value: string) => {
    setNoteName(value);
  }, []);
  return (
    <box style={{ border: true, width: 40, height: 3, marginTop: 1 }}>
      <input
        placeholder="Enter note name..."
        value={noteName ?? undefined}
        focused={focused}
        onKeyDown={handleKeyDown}
        onInput={handleNoteNameChange}
      />
    </box>
  );
};
