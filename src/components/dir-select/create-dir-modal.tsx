import { TextAttributes, type KeyEvent } from "@opentui/core";
import { useCallback, useState } from "react";
import { Modal } from "../modal";

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
    <Modal width="40%" height="20%" top="40%" left="30%">
      <box flexDirection="column" flexGrow={1}>
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
    </Modal>
  );
};
