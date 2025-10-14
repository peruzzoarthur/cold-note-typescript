import { useCallback } from "react";

type AliasesInputProps = {
  focused: boolean;
  aliases: string | null;
  setAliases: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AliasesInput = ({ focused, aliases, setAliases }: AliasesInputProps) => {
  const handleAliasesChange = useCallback((value: string) => {
    setAliases(value)
  }, [])
  return (
    <box
      style={{ border: true, width: 40, height: 3, marginTop: 1 }}
    >
      <input
        placeholder="Enter aliases..."
        value={aliases ?? undefined}
        focused={focused}
        onInput={handleAliasesChange}
      />
    </box>
  );
};
