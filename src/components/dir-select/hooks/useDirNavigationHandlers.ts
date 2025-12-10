import type { KeyEvent, SelectOption } from "@opentui/core";
import { useCallback } from "react";
import { useAppMenus } from "../../../hooks/useAppMenus";

type UseDirNavigationHandlersProps = {
  currentOption: SelectOption | null;
  path: string | undefined;
  handleNavigateDir: (key: KeyEvent, name: string) => void;
  handleGlobalKey: (key: KeyEvent) => boolean;
  handleKeyDown: (key: KeyEvent) => void;
  onCreateDir?: () => void;
  onDeleteDir?: () => void;
  onRenameDir?: () => void;
};

export const useDirNavigationHandlers = ({
  currentOption,
  path,
  handleNavigateDir,
  handleGlobalKey,
  handleKeyDown,
  onCreateDir,
  onDeleteDir,
  onRenameDir,
}: UseDirNavigationHandlersProps) => {

  const handleSelectKeyDown = useCallback(
    (key: KeyEvent) => {
      if (handleGlobalKey(key)) {
        return;
      }

      handleKeyDown(key);
    },
    [handleGlobalKey, handleKeyDown],
  );

  const handleNavigationKeyDown = useCallback(
    (key: KeyEvent) => {

      if (key.name === "l" && !key.ctrl && !key.meta && currentOption?.value) {
        handleNavigateDir(key, currentOption.value);
        return;
      }

      if ((key.name === "-" || key.name === "h") && path) {
        handleNavigateDir(key, path);
        return;
      }
      if ((key.name === "a" || key.name === "+") && onCreateDir) {
        onCreateDir();
        return;
      }
      if (
        (key.name === "d" || key.name === "delete") &&
        currentOption?.value &&
        onDeleteDir
      ) {
        if (currentOption.name !== "Press '-' to go back...") {
          onDeleteDir();
          return;
        }
      }
      if (key.name === "r" && currentOption?.value && onRenameDir) {
        if (currentOption.name !== "Press '-' to go back...") {
          onRenameDir();
          return;
        }
      }
      handleSelectKeyDown(key);
    },
    [
      currentOption,
      path,
      handleNavigateDir,
      handleSelectKeyDown,
      onCreateDir,
      onDeleteDir,
      onRenameDir,
    ],
  );

  return { handleNavigationKeyDown };
};
