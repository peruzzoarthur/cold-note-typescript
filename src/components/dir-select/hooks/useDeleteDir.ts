import { useCallback } from "react";
import { useModal, useAppMenus } from "../../../contexts/AppStateContext";
import { basename } from "path";
import { useDirNavigationStore } from "../store";

export const useDeleteDir = () => {
  const { openDeleteDirModal, setDeleteDirCallback, setDeleteDirName } = useModal();
  const store = useDirNavigationStore();
  const { addDebugLog } = useAppMenus();

  const openModal = useCallback((dirPath: string) => {
    addDebugLog(`[useDeleteDir] openModal called - dirPath: ${dirPath}`);
    setDeleteDirName(basename(dirPath));

    const callback = () => {
      addDebugLog(`[useDeleteDir] EXECUTING - path: ${dirPath}`);
      try {
        store.removeDirectory(dirPath);
        addDebugLog(`[useDeleteDir] SUCCESS`);
      } catch (error) {
        addDebugLog(`[useDeleteDir] ERROR: ${error}`);
        console.error("Failed to delete directory:", error);
      }
    };

    setDeleteDirCallback(callback);
    openDeleteDirModal();
  }, [openDeleteDirModal, setDeleteDirCallback, setDeleteDirName, store, addDebugLog]);

  return { openModal };
};
