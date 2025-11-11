import { TextAttributes, type KeyEvent } from "@opentui/core";
import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { Modal } from "../modal";

type RenameDirModalProps = {
  oldName: string;
  onSubmit: (newName: string) => void;
  onCancel: () => void;
};

export const RenameDirModal = ({ oldName, onSubmit, onCancel }: RenameDirModalProps) => {
  const [dirName, setDirName] = useState(oldName);

  useKeyboard((key: KeyEvent) => {
    if (key.name === "return" || key.name === "enter") {
      if (dirName.trim() && dirName !== oldName) {
        onSubmit(dirName.trim());
      }
    } else if (key.name === "escape") {
      onCancel();
    }
  });

  return (
    <Modal width="40%" height="20%" top="40%" left="30%">
      <box flexDirection="column" flexGrow={1}>
        <text marginBottom={1} attributes={TextAttributes.BOLD}>
          Rename Directory
        </text>
        <input
          placeholder="New directory name..."
          value={dirName}
          focused={true}
          onInput={setDirName}
          style={{ marginBottom: 1 }}
        />
        <text attributes={TextAttributes.DIM}>
          Enter to rename • Esc to cancel
        </text>
      </box>
    </Modal>
  );
};
