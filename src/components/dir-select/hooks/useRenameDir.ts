import { useCallback, useRef, useEffect } from "react";
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
  
  // Use refs to always have latest values without recreating callbacks
  const dirPathRef = useRef(dirPath);
  const selectedDirPathRef = useRef(selectedDirPath);
  
  useEffect(() => {
    dirPathRef.current = dirPath;
    addDebugLog(`[useRenameDir] dirPath updated: ${dirPath}`);
  }, [dirPath, addDebugLog]);
  
  useEffect(() => {
    selectedDirPathRef.current = selectedDirPath;
    addDebugLog(`[useRenameDir] selectedDirPath updated: ${selectedDirPath}`);
  }, [selectedDirPath, addDebugLog]);

  const renameDirectory = useCallback(
    (newName: string) => {
      const latestDirPath = dirPathRef.current;
      const latestSelectedDirPath = selectedDirPathRef.current;
      addDebugLog(`[useRenameDir] renameDirectory called - dirPathRef: ${latestDirPath}, newName: ${newName}`);
      if (!latestDirPath || !newName.trim()) {
        addDebugLog(`[useRenameDir] ABORT - dirPathRef: ${latestDirPath}, newName.trim(): "${newName.trim()}"`);
        return;
      }

      try {
        // Rename in tree
        addDebugLog(`[useRenameDir] Calling store.renameDirectory(${latestDirPath}, ${newName})`);
        store.renameDirectory(latestDirPath, newName);
        addDebugLog(`[useRenameDir] store.renameDirectory completed`);
        
        // Update the selected path if the renamed directory is currently selected
        if (latestSelectedDirPath === latestDirPath) {
          const parentPath = latestDirPath.substring(0, latestDirPath.lastIndexOf('/')) || '/';
          const newDirPath = join(parentPath, newName);
          addDebugLog(`[useRenameDir] Updating selectedDirPath from ${latestSelectedDirPath} to ${newDirPath}`);
          setSelectedDirPath(newDirPath);
        }
      } catch (error) {
        addDebugLog(`[useRenameDir] ERROR: ${error}`);
        console.error("Failed to rename directory:", error);
      }
    },
    [store, setSelectedDirPath, addDebugLog],
  );

  const openModal = useCallback(() => {
    const latestDirPath = dirPathRef.current;
    addDebugLog(`[useRenameDir] openModal called - dirPathRef: ${latestDirPath}`);
    if (latestDirPath) {
      const oldName = basename(latestDirPath);
      addDebugLog(`[useRenameDir] Setting renameDirOldName to: ${oldName}`);
      setRenameDirOldName(oldName);
      setRenameDirCallback(renameDirectory);
      openRenameDirModal();
    } else {
      addDebugLog(`[useRenameDir] ABORT openModal - dirPathRef is undefined`);
    }
  }, [renameDirectory, setRenameDirCallback, setRenameDirOldName, openRenameDirModal, addDebugLog]);

  return {
    openModal,
  };
};
