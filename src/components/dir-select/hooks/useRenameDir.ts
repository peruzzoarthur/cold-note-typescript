import { useCallback, useEffect } from "react";
import { useModal, useAppMenus } from "../../../contexts/AppStateContext";
import { basename, join } from "path";
import { useDirNavigationStore } from "../store";

type UseRenameDirProps = {
  dirPath?: string;
  selectedDirPath: string | null;
  setSelectedDirPath: (path: string | null) => void;
};

export const useRenameDir = ({ dirPath, selectedDirPath, setSelectedDirPath }: UseRenameDirProps) => {
  const { openRenameDirModal, setRenameDirCallback, setRenameDirOldName } = useModal();
  const store = useDirNavigationStore();
  const { addDebugLog } = useAppMenus();

  // Update the callback whenever dirPath changes - this ensures the callback always has current path
  useEffect(() => {
    addDebugLog(`[useRenameDir] Setting up callback for dirPath: ${dirPath}`);
    
    const callback = (newName: string) => {
      addDebugLog(`[useRenameDir] renameDirectory EXECUTING - dirPath at execution: ${dirPath}, newName: ${newName}`);
      if (!dirPath || !newName.trim()) {
        addDebugLog(`[useRenameDir] ABORT - dirPath: ${dirPath}, newName.trim(): "${newName.trim()}"`);
        return;
      }

      try {
        addDebugLog(`[useRenameDir] Calling store.renameDirectory(${dirPath}, ${newName})`);
        store.renameDirectory(dirPath, newName);
        addDebugLog(`[useRenameDir] store.renameDirectory completed`);

        // Update the selected path if the renamed directory is currently selected
        if (selectedDirPath === dirPath) {
          const parentPath = dirPath.substring(0, dirPath.lastIndexOf('/')) || '/';
          const newDirPath = join(parentPath, newName);
          addDebugLog(`[useRenameDir] Updating selectedDirPath from ${selectedDirPath} to ${newDirPath}`);
          setSelectedDirPath(newDirPath);
        }
      } catch (error) {
        addDebugLog(`[useRenameDir] ERROR: ${error}`);
        console.error("Failed to rename directory:", error);
      }
    };
    
    setRenameDirCallback(callback);
    
    if (dirPath) {
      const oldName = basename(dirPath);
      addDebugLog(`[useRenameDir] Setting renameDirOldName to: ${oldName}`);
      setRenameDirOldName(oldName);
    }
  }, [dirPath, selectedDirPath, setSelectedDirPath, store, setRenameDirCallback, setRenameDirOldName, addDebugLog]);

  const openModal = useCallback(() => {
    addDebugLog(`[useRenameDir] openModal called - dirPath: ${dirPath}`);
    openRenameDirModal();
  }, [openRenameDirModal, dirPath, addDebugLog]);

  return {
    openModal,
  };
};
