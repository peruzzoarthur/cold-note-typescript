import { useCallback, useRef } from "react";
import { useModal, useAppMenus } from "../../../contexts/AppStateContext";
import { basename } from "path";
import { useDirNavigationStore } from "../store";

type UseDeleteDirProps = {
  dirPath?: string;
};

export const useDeleteDir = ({ dirPath }: UseDeleteDirProps) => {
  const { openDeleteDirModal, setDeleteDirCallback, setDeleteDirName } = useModal();
  const store = useDirNavigationStore();
  const { addDebugLog } = useAppMenus();
  
  // Use refs to always have latest values
  const pathRef = useRef(dirPath);
  const storeRef = useRef(store);
  
  // Update refs on every render
  pathRef.current = dirPath;
  storeRef.current = store;

  const openModal = useCallback(() => {
    const currentPath = pathRef.current;
    addDebugLog(`[useDeleteDir] openModal called - dirPath: ${currentPath}`);
    
    if (currentPath) {
      const name = basename(currentPath);
      setDeleteDirName(name);
    }
    
    // Create callback at open time with latest values via closure over refs
    const callback = () => {
      const latestPath = pathRef.current;
      const latestStore = storeRef.current;
      addDebugLog(`[useDeleteDir] EXECUTING - path: ${latestPath}`);
      
      if (!latestPath) {
        addDebugLog(`[useDeleteDir] ABORT - path is undefined`);
        return;
      }

      try {
        latestStore.removeDirectory(latestPath);
        addDebugLog(`[useDeleteDir] SUCCESS`);
      } catch (error) {
        addDebugLog(`[useDeleteDir] ERROR: ${error}`);
        console.error("Failed to delete directory:", error);
      }
    };
    
    setDeleteDirCallback(callback);
    openDeleteDirModal();
  }, [openDeleteDirModal, setDeleteDirCallback, setDeleteDirName, addDebugLog]);

  return {
    openModal,
  };
};
