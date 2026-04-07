import { mkdirSync } from "fs";
import { join } from "path";
import { useCallback } from "react";
import { useModal } from "../../../contexts/AppStateContext";
import { useDirNavigationStore } from "../store";

type UseCreateDirProps = {
  currentPath?: string;
};

export const useCreateDir = ({ currentPath }: UseCreateDirProps) => {
  const { openCreateDirModal, setCreateDirCallback } = useModal();
  const store = useDirNavigationStore();

  const createDirectory = useCallback(
    (dirName: string) => {
      if (!currentPath || !dirName.trim()) {
        return;
      }

      try {
        const newDirPath = join(currentPath, dirName);
        mkdirSync(newDirPath, { recursive: false });

        // Add to tree and refresh
        store.addDirectory(currentPath, dirName);
      } catch (error) {
        console.error("Failed to create directory:", error);
      }
    },
    [currentPath, store],
  );

  const openModal = useCallback(() => {
    setCreateDirCallback(() => createDirectory);
    openCreateDirModal();
  }, [createDirectory, setCreateDirCallback, openCreateDirModal]);

  return {
    openModal,
  };
};
