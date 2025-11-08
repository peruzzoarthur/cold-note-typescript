import { TextAttributes, type KeyEvent, RGBA } from "@opentui/core";
import { useCallback, useState } from "react";

type CreateDirModalProps = {
  onSubmit: (dirName: string) => void;
  onCancel: () => void;
};

export const CreateDirModal = ({ onSubmit, onCancel }: CreateDirModalProps) => {
  const [dirName, setDirName] = useState("");

  const handleKeyDown = useCallback(
    (key: KeyEvent) => {
      if (key.name === "return" && dirName.trim()) {
        onSubmit(dirName.trim());
      }
      if (key.name === "escape") {
        onCancel();
      }
    },
    [dirName, onSubmit, onCancel],
  );

  return (
    <>
      {/* Backdrop */}
      <box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: RGBA.fromInts(0, 0, 0, 128),
          zIndex: 999,
        }}
      />

      {/* Modal */}
      <box
        style={{
          position: "absolute",
          top: "40%",
          left: "30%",
          width: "40%",
          height: "20%",
          borderColor: "#CBA6F7",
          backgroundColor: "#1E1E2F",
          border: true,
          zIndex: 1000,
        }}
      >
        <box flexDirection="column" flexGrow={1} >
          <text marginBottom={1} attributes={TextAttributes.BOLD}>
            Create New Directory
          </text>
          <input
            placeholder="Directory name..."
            value={dirName}
            focused={true}
            onKeyDown={handleKeyDown}
            onInput={setDirName}
            style={{ marginBottom: 1 }}
          />
          <text attributes={TextAttributes.DIM}>
            Enter to create • Esc to cancel
          </text>
        </box>
      </box>
    </>
  );
};
