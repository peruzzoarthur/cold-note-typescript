import { TextAttributes, type KeyEvent } from "@opentui/core";
import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { Modal } from "../modal";
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
    <Modal width="50%" height="30%" top="35%" left="25%">
      <box flexDirection="column" flexGrow={1}>
        <text marginBottom={1} attributes={TextAttributes.BOLD}>
          Note Already Exists
        </text>
        <text marginBottom={2}>
          A note named "{noteName}" already exists in this directory.
        </text>
        <text marginBottom={2}>
          Would you like to open the existing note?
        </text>
        <box flexDirection="row" justifyContent="center" gap={2}>
          <createButton
            label="Cancel"
            focused={activeButton === 0}
            width={15}
            backgroundColor={activeButton === 0 ? "#F38BA8" : "#5A5A6A"}
          />
          <createButton
            label="Open"
            focused={activeButton === 1}
            width={15}
            backgroundColor={activeButton === 1 ? "#A6E3A2" : "#5A5A6A"}
          />
        </box>
        <text marginTop={1} attributes={TextAttributes.DIM}>
          Tab/h/l or ← → to navigate • o/c or Enter to confirm • Esc to cancel
        </text>
      </box>
    </Modal>
  );
};
