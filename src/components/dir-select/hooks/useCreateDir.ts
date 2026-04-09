import { useCallback, useRef, useEffect } from "react";
import { useModal, useAppMenus } from "../../../contexts/AppStateContext";
import { useDirNavigationStore } from "../store";

type UseCreateDirProps = {
  currentPath?: string;
};

export const useCreateDir = ({ currentPath }: UseCreateDirProps) => {
  const { openCreateDirModal, setCreateDirCallback } = useModal();
  const store = useDirNavigationStore();
  const { addDebugLog } = useAppMenus();
  
  // Use ref to always have latest currentPath without recreating callbacks
  const currentPathRef = useRef(currentPath);
  useEffect(() => {
    currentPathRef.current = currentPath;
    addDebugLog(`[useCreateDir] currentPath updated: ${currentPath}`);
  }, [currentPath, addDebugLog]);

  const createDirectory = useCallback(
    (dirName: string) => {
      const latestPath = currentPathRef.current;
      addDebugLog(`[useCreateDir] createDirectory called - currentPathRef: ${latestPath}, dirName: ${dirName}`);
      if (!latestPath || !dirName.trim()) {
        addDebugLog(`[useCreateDir] ABORT - currentPathRef: ${latestPath}, dirName.trim(): "${dirName.trim()}"`);
        return;
      }

      try {
        // store.addDirectory handles the filesystem mkdirSync via addNodeToTree
        addDebugLog(`[useCreateDir] Calling store.addDirectory(${latestPath}, ${dirName})`);
        store.addDirectory(latestPath, dirName);
        addDebugLog(`[useCreateDir] store.addDirectory completed`);
      } catch (error) {
        addDebugLog(`[useCreateDir] ERROR: ${error}`);
        console.error("Failed to create directory:", error);
      }
    },
    [store, addDebugLog],
  );

  const openModal = useCallback(() => {
    addDebugLog(`[useCreateDir] openModal called - currentPathRef: ${currentPathRef.current}`);
    setCreateDirCallback(createDirectory);
    openCreateDirModal();
  }, [createDirectory, setCreateDirCallback, openCreateDirModal, addDebugLog]);

  return {
    openModal,
  };
};
