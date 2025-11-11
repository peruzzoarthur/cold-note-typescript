import { TextAttributes, type KeyEvent } from "@opentui/core";
import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { Modal } from "../modal";
import "../ui/create-button";

type DeleteDirModalProps = {
  dirName: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DeleteDirModal = ({ dirName, onConfirm, onCancel }: DeleteDirModalProps) => {
  const [activeButton, setActiveButton] = useState(0); // 0 for No, 1 for Yes

  useKeyboard((key: KeyEvent) => {
    if (key.name === "tab") {
      // Toggle between buttons with tab
      setActiveButton(prev => prev === 0 ? 1 : 0);
    } else if (key.name === "left" || key.name === "h") {
      setActiveButton(0);
    } else if (key.name === "right" || key.name === "l") {
      setActiveButton(1);
    } else if (key.name === "n") {
      onCancel();
    } else if (key.name === "y") {
      onConfirm();
    } else if (key.name === "return" || key.name === "enter") {
      if (activeButton === 1) {
        onConfirm();
      } else {
        onCancel();
      }
    } else if (key.name === "escape") {
      onCancel();
    }
  });

  return (
    <Modal width="50%" height="25%" top="40%" left="25%">
      <box flexDirection="column" flexGrow={1}>
        <text marginBottom={1} attributes={TextAttributes.BOLD}>
          Delete Directory
        </text>
        <text marginBottom={2}>
          Are you sure you want to delete "{dirName}"?
        </text>
        <box flexDirection="row" justifyContent="center" gap={2}>
          <createButton
            label="No"
            focused={activeButton === 0}
            width={15}
            backgroundColor={activeButton === 0 ? "#F38BA8" : "#5A5A6A"}
          />
          <createButton
            label="Yes"
            focused={activeButton === 1}
            width={15}
            backgroundColor={activeButton === 1 ? "#A6E3A2" : "#5A5A6A"}
          />
        </box>
        <text marginTop={1} attributes={TextAttributes.DIM}>
          Tab/h/l or ← → to navigate • y/n or Enter to confirm • Esc to cancel
        </text>
      </box>
    </Modal>
  );
};
