import { useCallback } from "react";
import { useModal } from "../../../contexts/AppStateContext";
import { basename } from "path";
import { useDirNavigationStore } from "../store";

type UseRenameDirProps = {
  dirPath?: string;
  selectedDirPath: string | null;
  setSelectedDirPath: (path: string | null) => void;
};

export const useRenameDir = ({ dirPath, selectedDirPath, setSelectedDirPath }: UseRenameDirProps) => {
  const { openRenameDirModal, setRenameDirCallback, setRenameDirOldName } = useModal();
  const store = useDirNavigationStore();

  const renameDirectory = useCallback(
    (newName: string) => {
      if (!dirPath || !newName.trim()) {
        return;
      }

      try {
        // Rename in tree
        store.renameDirectory(dirPath, newName);
        
        // Update the selected path if the renamed directory is currently selected
        if (selectedDirPath === dirPath) {
          const parentPath = dirPath.substring(0, dirPath.lastIndexOf('/'));
          const newDirPath = `${parentPath}/${newName}`;
          setSelectedDirPath(newDirPath);
        }
      } catch (error) {
        console.error("Failed to rename directory:", error);
      }
    },
    [dirPath, selectedDirPath, setSelectedDirPath, store],
  );

  const openModal = useCallback(() => {
    if (dirPath) {
      setRenameDirOldName(basename(dirPath));
      setRenameDirCallback(() => renameDirectory);
      openRenameDirModal();
    }
  }, [dirPath, renameDirectory, setRenameDirCallback, setRenameDirOldName, openRenameDirModal]);

  return {
    openModal,
  };
};
