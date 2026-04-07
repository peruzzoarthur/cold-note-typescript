import { TextAttributes, type KeyEvent } from "@opentui/core";
import { theme } from "../../theme";
import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { Modal } from "../modal";
import { LAYOUT } from "../../constants";
import "../ui/create-button";

type NoteExistsModalProps = {
  noteName: string;
  onOpenExisting: () => void;
  onCancel: () => void;
};

export const NoteExistsModal = ({ noteName, onOpenExisting, onCancel }: NoteExistsModalProps) => {
  const [activeButton, setActiveButton] = useState(0); // 0 for Cancel, 1 for Open

  useKeyboard((key: KeyEvent) => {
    if (key.name === "tab") {
      // Toggle between buttons with tab
      setActiveButton(prev => prev === 0 ? 1 : 0);
    } else if (key.name === "left" || key.name === "h") {
      setActiveButton(0);
    } else if (key.name === "right" || key.name === "l") {
      setActiveButton(1);
    } else if (key.name === "o") {
      onOpenExisting();
    } else if (key.name === "c" || key.name === "n") {
      onCancel();
    } else if (key.name === "return" || key.name === "enter") {
      if (activeButton === 1) {
        onOpenExisting();
      } else {
        onCancel();
      }
    } else if (key.name === "escape") {
      onCancel();
    }
  });

  return (
    <Modal width={LAYOUT.MODAL.NOTE_EXISTS_WIDTH} height={LAYOUT.MODAL.NOTE_EXISTS_HEIGHT} top={LAYOUT.MODAL.NOTE_EXISTS_TOP} left={LAYOUT.MODAL.NOTE_EXISTS_LEFT}>
      <box flexDirection="column" flexGrow={1}>
        <text marginBottom={LAYOUT.SPACING.SMALL} attributes={TextAttributes.BOLD}>
          Note Already Exists
        </text>
        <text marginBottom={LAYOUT.SPACING.MEDIUM}>
          A note named "{noteName}" already exists in this directory.
        </text>
        <text marginBottom={LAYOUT.SPACING.MEDIUM}>
          Would you like to open the existing note?
        </text>
        <box flexDirection="row" justifyContent="center" gap={LAYOUT.SPACING.MEDIUM}>
          <createButton
            label="Cancel"
            focused={activeButton === 0}
            width={LAYOUT.DIMENSIONS.BUTTON_WIDTH}
            backgroundColor={activeButton === 0 ? theme.error : theme.line}
          />
          <createButton
            label="Open"
            focused={activeButton === 1}
            width={LAYOUT.DIMENSIONS.BUTTON_WIDTH}
            backgroundColor={activeButton === 1 ? theme.success : theme.line}
          />
        </box>
        <text marginTop={LAYOUT.SPACING.SMALL} attributes={TextAttributes.DIM}>
          Tab/h/l or ← → to navigate • o/c or Enter to confirm • Esc to cancel
        </text>
      </box>
    </Modal>
  );
};
