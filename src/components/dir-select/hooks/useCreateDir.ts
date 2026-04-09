import { useCallback, useEffect } from "react";
import { useModal, useAppMenus } from "../../../contexts/AppStateContext";
import { useDirNavigationStore } from "../store";

type UseCreateDirProps = {
  currentPath?: string;
};

export const useCreateDir = ({ currentPath }: UseCreateDirProps) => {
  const { openCreateDirModal, setCreateDirCallback } = useModal();
  const store = useDirNavigationStore();
  const { addDebugLog } = useAppMenus();

  // Update the callback whenever currentPath changes - this ensures the callback always has current path
  useEffect(() => {
    addDebugLog(`[useCreateDir] Setting up callback for currentPath: ${currentPath}`);
    
    const callback = (dirName: string) => {
      addDebugLog(`[useCreateDir] createDirectory EXECUTING - currentPath at execution: ${currentPath}, dirName: ${dirName}`);
      if (!currentPath || !dirName.trim()) {
        addDebugLog(`[useCreateDir] ABORT - currentPath: ${currentPath}, dirName.trim(): "${dirName.trim()}"`);
        return;
      }

      try {
        addDebugLog(`[useCreateDir] Calling store.addDirectory(${currentPath}, ${dirName})`);
        store.addDirectory(currentPath, dirName);
        addDebugLog(`[useCreateDir] store.addDirectory completed`);
      } catch (error) {
        addDebugLog(`[useCreateDir] ERROR: ${error}`);
        console.error("Failed to create directory:", error);
      }
    };
    
    setCreateDirCallback(callback);
  }, [currentPath, store, setCreateDirCallback, addDebugLog]);

  const openModal = useCallback(() => {
    addDebugLog(`[useCreateDir] openModal called - currentPath: ${currentPath}`);
    openCreateDirModal();
  }, [openCreateDirModal, currentPath, addDebugLog]);

  return {
    openModal,
  };
};
