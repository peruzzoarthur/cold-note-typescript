import { rmSync } from "fs";
import { useCallback } from "react";
import { useModal } from "../../../contexts/ModalContext";
import { basename } from "path";

type UseDeleteDirProps = {
  dirPath?: string;
  setOptions: React.Dispatch<React.SetStateAction<any[]>>;
};

export const useDeleteDir = ({ dirPath, setOptions }: UseDeleteDirProps) => {
  const { openDeleteDirModal, setDeleteDirCallback, setDeleteDirName } = useModal();

  const deleteDirectory = useCallback(() => {
    if (!dirPath) {
      return;
    }

    try {
      rmSync(dirPath, { recursive: true, force: true });

      setOptions((prevOptions) => {
        // Remove the deleted directory from options
        return prevOptions.filter(opt => opt.value !== dirPath);
      });
    } catch (error) {
      console.error("Failed to delete directory:", error);
    }
  }, [dirPath, setOptions]);

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
