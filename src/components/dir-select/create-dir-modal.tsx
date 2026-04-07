import { TextAttributes, type KeyEvent } from "@opentui/core";
import { useCallback, useState } from "react";
import { Modal } from "../modal";
import { LAYOUT } from "../../constants";

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
    <Modal width={LAYOUT.MODAL.CREATE_DIR_WIDTH} height={LAYOUT.MODAL.CREATE_DIR_HEIGHT} top={LAYOUT.MODAL.CREATE_DIR_TOP} left={LAYOUT.MODAL.CREATE_DIR_LEFT}>
      <box flexDirection="column" flexGrow={1}>
        <text marginBottom={LAYOUT.SPACING.SMALL} attributes={TextAttributes.BOLD}>
          Create New Directory
        </text>
        <input
          placeholder="Directory name..."
          value={dirName}
          focused={true}
          onKeyDown={handleKeyDown}
          onInput={setDirName}
          style={{ marginBottom: LAYOUT.SPACING.SMALL }}
        />
        <text attributes={TextAttributes.DIM}>
          Enter to create • Esc to cancel
        </text>
      </box>
    </Modal>
  );
};
