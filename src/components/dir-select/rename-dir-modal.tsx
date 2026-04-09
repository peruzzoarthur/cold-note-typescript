import { TextAttributes, type KeyEvent } from "@opentui/core";
import { useState, useEffect } from "react";
import { useKeyboard } from "@opentui/react";
import { Modal } from "../modal";
import { LAYOUT } from "../../constants";
import { useAppMenus } from "../../contexts/AppStateContext";

type RenameDirModalProps = {
  oldName: string;
  onSubmit: (newName: string) => void;
  onCancel: () => void;
};

export const RenameDirModal = ({ oldName, onSubmit, onCancel }: RenameDirModalProps) => {
  const [dirName, setDirName] = useState(oldName);
  const { addDebugLog } = useAppMenus();

  // DEBUG: Log when modal mounts and when oldName changes
  useEffect(() => {
    addDebugLog(`[RenameDirModal] Mounted/oldName changed - oldName: "${oldName}", dirName state: "${dirName}"`);
  }, [oldName, addDebugLog]);

  // DEBUG: Log when dirName state changes
  useEffect(() => {
    addDebugLog(`[RenameDirModal] dirName state changed to: "${dirName}"`);
  }, [dirName, addDebugLog]);

  useKeyboard((key: KeyEvent) => {
    addDebugLog(`[RenameDirModal] Key pressed: ${key.name}, dirName: "${dirName}", oldName: "${oldName}"`);
    if (key.name === "return" || key.name === "enter") {
      if (dirName.trim() && dirName !== oldName) {
        addDebugLog(`[RenameDirModal] Submitting newName: "${dirName.trim()}"`);
        onSubmit(dirName.trim());
      } else {
        addDebugLog(`[RenameDirModal] Submit blocked - dirName.trim(): "${dirName.trim()}", dirName !== oldName: ${dirName !== oldName}`);
      }
    } else if (key.name === "escape") {
      addDebugLog(`[RenameDirModal] Cancel pressed`);
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
