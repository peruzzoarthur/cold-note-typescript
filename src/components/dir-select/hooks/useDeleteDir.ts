import { rmSync } from "fs";
import { useCallback } from "react";
import { useModal } from "../../../contexts/AppStateContext";
import { basename } from "path";
import { useDirNavigationStore } from "../store";

type UseDeleteDirProps = {
  dirPath?: string;
};

export const useDeleteDir = ({ dirPath }: UseDeleteDirProps) => {
  const { openDeleteDirModal, setDeleteDirCallback, setDeleteDirName } = useModal();
  const store = useDirNavigationStore();

  const deleteDirectory = useCallback(() => {
    if (!dirPath) {
      return;
    }

    try {
      rmSync(dirPath, { recursive: true, force: true });

      // Remove from tree
      store.removeDirectory(dirPath);
    } catch (error) {
      console.error("Failed to delete directory:", error);
    }
  }, [dirPath, store]);

  const openModal = useCallback(() => {
    if (dirPath) {
      setDeleteDirName(basename(dirPath));
      setDeleteDirCallback(() => deleteDirectory);
      openDeleteDirModal();
    }
  }, [dirPath, deleteDirectory, setDeleteDirCallback, setDeleteDirName, openDeleteDirModal]);

  return {
    openModal,
  };
};
