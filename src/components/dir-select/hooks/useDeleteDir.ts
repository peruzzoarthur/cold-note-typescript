import { useCallback, useEffect } from "react";
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

  // Update the callback whenever dirPath changes - this ensures the callback always has current path
  useEffect(() => {
    addDebugLog(`[useDeleteDir] Setting up callback for dirPath: ${dirPath}`);
    
    const callback = () => {
      addDebugLog(`[useDeleteDir] deleteDirectory EXECUTING - dirPath at execution: ${dirPath}`);
      if (!dirPath) {
        addDebugLog(`[useDeleteDir] ABORT - dirPath is undefined`);
        return;
      }

      try {
        addDebugLog(`[useDeleteDir] Calling store.removeDirectory(${dirPath})`);
        store.removeDirectory(dirPath);
        addDebugLog(`[useDeleteDir] store.removeDirectory completed`);
      } catch (error) {
        addDebugLog(`[useDeleteDir] ERROR: ${error}`);
        console.error("Failed to delete directory:", error);
      }
    };
    
    setDeleteDirCallback(callback);
    
    if (dirPath) {
      const name = basename(dirPath);
      addDebugLog(`[useDeleteDir] Setting deleteDirName to: ${name}`);
      setDeleteDirName(name);
    }
  }, [dirPath, store, setDeleteDirCallback, setDeleteDirName, addDebugLog]);

  const openModal = useCallback(() => {
    addDebugLog(`[useDeleteDir] openModal called - dirPath: ${dirPath}`);
    openDeleteDirModal();
  }, [openDeleteDirModal, dirPath, addDebugLog]);

  return {
    openModal,
  };
};
