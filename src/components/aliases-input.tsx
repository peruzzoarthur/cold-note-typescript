import { useCallback } from "react";
import { useNoteContext } from "../contexts/NoteContext";

type AliasesInputProps = {
  focused: boolean;
};

export const AliasesInput = ({ focused }: AliasesInputProps) => {
  const { noteData, setAliases } = useNoteContext();
  
  const handleAliasesChange = useCallback((value: string) => {
    setAliases(value)
  }, [setAliases])
  return (
    <box
      style={{ border: true, width: 40, height: 3, marginTop: 1 }}
    >
      <input
        placeholder="Enter aliases..."
        value={noteData.aliases ?? undefined}
        focused={focused}
        onInput={handleAliasesChange}
      />
    </box>
  );
};
