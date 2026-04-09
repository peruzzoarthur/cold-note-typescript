import { useCallback, useRef } from "react";
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
  
  // Use refs to always have latest values
  const pathRef = useRef(dirPath);
  const selectedPathRef = useRef(selectedDirPath);
  const storeRef = useRef(store);
  const setSelectedPathRef = useRef(setSelectedDirPath);
  
  // Update refs on every render
  pathRef.current = dirPath;
  selectedPathRef.current = selectedDirPath;
  storeRef.current = store;
  setSelectedPathRef.current = setSelectedDirPath;

  const openModal = useCallback(() => {
    const currentPath = pathRef.current;
    addDebugLog(`[useRenameDir] openModal called - dirPath: ${currentPath}`);
    
    if (currentPath) {
      const oldName = basename(currentPath);
      setRenameDirOldName(oldName);
    }
    
    // Create callback at open time with latest values via closure over refs
    const callback = (newName: string) => {
      const latestPath = pathRef.current;
      const latestSelectedPath = selectedPathRef.current;
      const latestStore = storeRef.current;
      const latestSetSelected = setSelectedPathRef.current;
      
      addDebugLog(`[useRenameDir] EXECUTING - path: ${latestPath}, newName: ${newName}`);
      
      if (!latestPath || !newName.trim()) {
        addDebugLog(`[useRenameDir] ABORT - path: ${latestPath}`);
        return;
      }

      try {
        latestStore.renameDirectory(latestPath, newName);
        addDebugLog(`[useRenameDir] store.renameDirectory completed`);

        // Update the selected path if the renamed directory is currently selected
        if (latestSelectedPath === latestPath) {
          const parentPath = latestPath.substring(0, latestPath.lastIndexOf('/')) || '/';
          const newDirPath = join(parentPath, newName);
          latestSetSelected(newDirPath);
        }
        addDebugLog(`[useRenameDir] SUCCESS`);
      } catch (error) {
        addDebugLog(`[useRenameDir] ERROR: ${error}`);
        console.error("Failed to rename directory:", error);
      }
    };
    
    setRenameDirCallback(callback);
    openRenameDirModal();
  }, [openRenameDirModal, setRenameDirCallback, setRenameDirOldName, addDebugLog]);

  return {
    openModal,
  };
};
