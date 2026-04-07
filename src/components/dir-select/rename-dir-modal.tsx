import { TextAttributes, type KeyEvent } from "@opentui/core";
import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { Modal } from "../modal";
import { LAYOUT } from "../../constants";

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
    <Modal width={LAYOUT.MODAL.RENAME_DIR_WIDTH} height={LAYOUT.MODAL.RENAME_DIR_HEIGHT} top={LAYOUT.MODAL.RENAME_DIR_TOP} left={LAYOUT.MODAL.RENAME_DIR_LEFT}>
      <box flexDirection="column" flexGrow={1}>
        <text marginBottom={LAYOUT.SPACING.SMALL} attributes={TextAttributes.BOLD}>
          Rename Directory
        </text>
        <input
          placeholder="New directory name..."
          value={dirName}
          focused={true}
          onInput={setDirName}
          style={{ marginBottom: LAYOUT.SPACING.SMALL }}
        />
        <text attributes={TextAttributes.DIM}>
          Enter to rename • Esc to cancel
        </text>
      </box>
    </Modal>
  );
};
