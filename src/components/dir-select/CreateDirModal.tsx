import type { KeyEvent } from "@opentui/core";
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
      {/* Backdrop overlay */}
      <box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#000000",
          opacity: 0.3,
          zIndex: 999,
        }}
      />

      {/* Modal */}
      <box
        style={{
          position: "absolute",
          right: "15%",
          top: "50%",
          transform: "translateY(-50%)",
          width: 55,
          height: 8,
          border: true,
          borderColor: "#CBA6F7",
          backgroundColor: "#1e1e2e",
          padding: 2,
          zIndex: 1000,
        }}
      >
        <box style={{ flexDirection: "column", width: "100%" }}>
          <text style={{ marginBottom: 1, color: "#CBA6F7", fontWeight: "bold" }}>
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
          <text style={{ color: "#6c7086" }}>
            Enter to create • Esc to cancel
          </text>
        </box>
      </box>
    </>
  );
};
