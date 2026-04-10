import { useCallback, useRef } from "react";
import { useModal, useAppMenus } from "../../../contexts/AppStateContext";
import { basename, join } from "path";
import { useDirNavigationStore } from "../store";

type UseRenameDirProps = {
  selectedDirPath: string | null;
  setSelectedDirPath: (path: string | null) => void;
};

export const useRenameDir = ({ selectedDirPath, setSelectedDirPath }: UseRenameDirProps) => {
  const { openRenameDirModal, setRenameDirCallback, setRenameDirOldName } = useModal();
  const store = useDirNavigationStore();
  const { addDebugLog } = useAppMenus();

  // Keep refs for context-level state that can change independently of selection
  const selectedPathRef = useRef(selectedDirPath);
  const setSelectedPathRef = useRef(setSelectedDirPath);
  selectedPathRef.current = selectedDirPath;
  setSelectedPathRef.current = setSelectedDirPath;

  const openModal = useCallback((dirPath: string) => {
    addDebugLog(`[useRenameDir] openModal called - dirPath: ${dirPath}`);
    setRenameDirOldName(basename(dirPath));

    const callback = (newName: string) => {
      addDebugLog(`[useRenameDir] EXECUTING - path: ${dirPath}, newName: ${newName}`);
      if (!newName.trim()) {
        addDebugLog(`[useRenameDir] ABORT - empty newName`);
        return;
      }
      try {
        store.renameDirectory(dirPath, newName);
        addDebugLog(`[useRenameDir] store.renameDirectory completed`);

        if (selectedPathRef.current === dirPath) {
          const parentPath = dirPath.substring(0, dirPath.lastIndexOf('/')) || '/';
          setSelectedPathRef.current(join(parentPath, newName));
        }
        addDebugLog(`[useRenameDir] SUCCESS`);
      } catch (error) {
        addDebugLog(`[useRenameDir] ERROR: ${error}`);
        console.error("Failed to rename directory:", error);
      }
    };

    setRenameDirCallback(callback);
    openRenameDirModal();
  }, [openRenameDirModal, setRenameDirCallback, setRenameDirOldName, store, addDebugLog]);

  return { openModal };
};
