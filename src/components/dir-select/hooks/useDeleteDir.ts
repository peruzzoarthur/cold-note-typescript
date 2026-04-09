import { useCallback, useRef, useEffect } from "react";
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
  
  // Use ref to always have latest dirPath without recreating callbacks
  const dirPathRef = useRef(dirPath);
  useEffect(() => {
    dirPathRef.current = dirPath;
    addDebugLog(`[useDeleteDir] dirPath updated: ${dirPath}`);
  }, [dirPath, addDebugLog]);

  const deleteDirectory = useCallback(() => {
    const latestDirPath = dirPathRef.current;
    addDebugLog(`[useDeleteDir] deleteDirectory called - dirPathRef: ${latestDirPath}`);
    if (!latestDirPath) {
      addDebugLog(`[useDeleteDir] ABORT - dirPathRef is undefined`);
      return;
    }

    try {
      // store.removeDirectory handles the filesystem rmSync via removeNodeFromTree
      addDebugLog(`[useDeleteDir] Calling store.removeDirectory(${latestDirPath})`);
      store.removeDirectory(latestDirPath);
      addDebugLog(`[useDeleteDir] store.removeDirectory completed`);
    } catch (error) {
      addDebugLog(`[useDeleteDir] ERROR: ${error}`);
      console.error("Failed to delete directory:", error);
    }
  }, [store, addDebugLog]);

  const openModal = useCallback(() => {
    const latestDirPath = dirPathRef.current;
    addDebugLog(`[useDeleteDir] openModal called - dirPathRef: ${latestDirPath}`);
    if (latestDirPath) {
      const dirName = basename(latestDirPath);
      addDebugLog(`[useDeleteDir] Setting deleteDirName to: ${dirName}`);
      setDeleteDirName(dirName);
      setDeleteDirCallback(deleteDirectory);
      openDeleteDirModal();
    } else {
      addDebugLog(`[useDeleteDir] ABORT openModal - dirPathRef is undefined`);
    }
  }, [deleteDirectory, setDeleteDirCallback, setDeleteDirName, openDeleteDirModal, addDebugLog]);

  return {
    openModal,
  };
};
