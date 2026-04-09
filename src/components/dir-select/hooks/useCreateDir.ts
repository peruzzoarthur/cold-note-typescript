import { useCallback, useRef } from "react";
import { useModal, useAppMenus } from "../../../contexts/AppStateContext";
import { useDirNavigationStore } from "../store";

type UseCreateDirProps = {
  currentPath?: string;
};

export const useCreateDir = ({ currentPath }: UseCreateDirProps) => {
  const { openCreateDirModal, setCreateDirCallback } = useModal();
  const store = useDirNavigationStore();
  const { addDebugLog } = useAppMenus();
  
  // Use ref to always have latest values
  const pathRef = useRef(currentPath);
  const storeRef = useRef(store);
  
  // Update refs on every render
  pathRef.current = currentPath;
  storeRef.current = store;

  const openModal = useCallback(() => {
    addDebugLog(`[useCreateDir] openModal called - currentPath: ${pathRef.current}`);
    
    // Create callback at open time with latest values via closure over refs
    const callback = (dirName: string) => {
      const latestPath = pathRef.current;
      const latestStore = storeRef.current;
      addDebugLog(`[useCreateDir] EXECUTING - path: ${latestPath}, dirName: ${dirName}`);
      
      if (!latestPath || !dirName.trim()) {
        addDebugLog(`[useCreateDir] ABORT - path: ${latestPath}`);
        return;
      }

      try {
        latestStore.addDirectory(latestPath, dirName);
        addDebugLog(`[useCreateDir] SUCCESS`);
      } catch (error) {
        addDebugLog(`[useCreateDir] ERROR: ${error}`);
        console.error("Failed to create directory:", error);
      }
    };
    
    setCreateDirCallback(callback);
    openCreateDirModal();
  }, [openCreateDirModal, setCreateDirCallback, addDebugLog]);

  return {
    openModal,
  };
};
