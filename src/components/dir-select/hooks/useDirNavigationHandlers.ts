import type { KeyEvent, SelectOption } from "@opentui/core";
import { useCallback } from "react";

type UseDirNavigationHandlersProps = {
  currentOption: SelectOption | null;
  path: string | undefined;
  handleNavigateDir: (key: KeyEvent, name: string) => void;
  handleGlobalKey: (key: KeyEvent) => boolean;
  handleKeyDown: (key: KeyEvent) => void;
  onCreateDir?: () => void;
};

export const useDirNavigationHandlers = ({
  currentOption,
  path,
  handleNavigateDir,
  handleGlobalKey,
  handleKeyDown,
  onCreateDir,
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
      if (key.name === "o" && currentOption?.value) {
        handleNavigateDir(key, currentOption.value);
      }
      if (key.name === "-" && path) {
        handleNavigateDir(key, path);
      }
      if ((key.name === "n" || key.name === "+") && onCreateDir) {
        onCreateDir();
        return;
      }
      handleSelectKeyDown(key);
    },
    [currentOption, path, handleNavigateDir, handleSelectKeyDown, onCreateDir],
  );

  return { handleNavigationKeyDown };
};
