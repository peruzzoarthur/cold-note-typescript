import { useCallback } from "react";

type NoteNameInputProps = {
  focused: boolean;
  noteName: string | null;
  setNoteName: React.Dispatch<React.SetStateAction<string | null>>;
};

export const NoteNameInput = ({ focused, noteName, setNoteName }: NoteNameInputProps) => {
  const handleNoteNameChange = useCallback((value: string) => {
    setNoteName(value)
  }, [])
  return (
    <box
      style={{ border: true, width: 40, height: 3, marginTop: 1 }}
    >
      <input
        placeholder="Enter note name..."
        value={noteName ?? undefined}
        focused={focused}
        onInput={handleNoteNameChange}
      />
    </box>
  );
};
