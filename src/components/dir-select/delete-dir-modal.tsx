import { TextAttributes, type KeyEvent } from "@opentui/core";
import { theme } from "../../theme";
import { useState, useEffect } from "react";
import { useKeyboard } from "@opentui/react";
import { Modal } from "../modal";
import { LAYOUT } from "../../constants";
import { useAppMenus } from "../../contexts/AppStateContext";
import "../ui/create-button";

type DeleteDirModalProps = {
  dirName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DeleteDirModal = ({ dirName, onConfirm, onCancel }: DeleteDirModalProps) => {
  const [activeButton, setActiveButton] = useState(0); // 0 for No, 1 for Yes
  const { addDebugLog } = useAppMenus();

  // DEBUG: Log when modal mounts with dirName
  useEffect(() => {
    addDebugLog(`[DeleteDirModal] Mounted with dirName: "${dirName}"`);
  }, [dirName, addDebugLog]);

  useKeyboard((key: KeyEvent) => {
    addDebugLog(`[DeleteDirModal] Key pressed: ${key.name}, activeButton: ${activeButton}`);
    if (key.name === "tab") {
      // Toggle between buttons with tab
      setActiveButton(prev => prev === 0 ? 1 : 0);
    } else if (key.name === "left" || key.name === "h") {
      setActiveButton(0);
    } else if (key.name === "right" || key.name === "l") {
      setActiveButton(1);
    } else if (key.name === "n") {
      addDebugLog(`[DeleteDirModal] Cancel (n) pressed`);
      onCancel();
    } else if (key.name === "y") {
      addDebugLog(`[DeleteDirModal] Confirm (y) pressed`);
      onConfirm();
    } else if (key.name === "return" || key.name === "enter") {
      if (activeButton === 1) {
        addDebugLog(`[DeleteDirModal] Confirm (Enter) pressed`);
        onConfirm();
      } else {
        addDebugLog(`[DeleteDirModal] Cancel (Enter) pressed`);
        onCancel();
      }
    } else if (key.name === "escape") {
      addDebugLog(`[DeleteDirModal] Escape pressed`);
      onCancel();
    }
  });

  return (
    <Modal width={LAYOUT.MODAL.DELETE_DIR_WIDTH} height={LAYOUT.MODAL.DELETE_DIR_HEIGHT} top={LAYOUT.MODAL.DELETE_DIR_TOP} left={LAYOUT.MODAL.DELETE_DIR_LEFT}>
      <box flexDirection="column" flexGrow={1}>
        <text marginBottom={LAYOUT.SPACING.SMALL} attributes={TextAttributes.BOLD}>
          Delete Directory
        </text>
        <text marginBottom={LAYOUT.SPACING.MEDIUM}>
          Are you sure you want to delete "{dirName}"?
        </text>
        <box flexDirection="row" justifyContent="center" gap={LAYOUT.SPACING.MEDIUM}>
          <createButton
            label="No"
            focused={activeButton === 0}
            width={LAYOUT.DIMENSIONS.BUTTON_WIDTH}
            backgroundColor={activeButton === 0 ? theme.error : theme.line}
          />
          <createButton
            label="Yes"
            focused={activeButton === 1}
            width={LAYOUT.DIMENSIONS.BUTTON_WIDTH}
            backgroundColor={activeButton === 1 ? theme.success : theme.line}
          />
        </box>
        <text marginTop={LAYOUT.SPACING.SMALL} attributes={TextAttributes.DIM}>
          Tab/h/l or ← → to navigate • y/n or Enter to confirm • Esc to cancel
        </text>
      </box>
    </Modal>
  );
};
