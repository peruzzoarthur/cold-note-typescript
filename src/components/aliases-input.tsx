import { useCallback } from "react";
import { useNoteContext } from "../contexts/NoteContext";
import type { TabSelectObject } from "../types";
import { useTabNavigation } from "../hooks/useTabNavigation";

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

  const handleAliasesChange = useCallback(
    (value: string) => {
      setAliases(value);
    },
    [setAliases],
  );
  return (
    <box style={{ border: true, width: 40, height: 3, marginTop: 1 }}>
      <input
        placeholder="Enter aliases..."
        value={noteData.aliases ?? undefined}
        focused={focused}
        onKeyDown={handleKeyDown}
        onInput={handleAliasesChange}
      />
    </box>
  );
};
