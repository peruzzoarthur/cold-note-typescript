import { mkdirSync } from "fs";
import { join } from "path";
import { useCallback } from "react";
import { useModal } from "../../../contexts/ModalContext";

type UseCreateDirProps = {
  currentPath?: string;
  setOptions: React.Dispatch<React.SetStateAction<any[]>>;
};

export const useCreateDir = ({ currentPath, setOptions }: UseCreateDirProps) => {
  const { openCreateDirModal, setCreateDirCallback } = useModal();

  const createDirectory = useCallback(
    (dirName: string) => {
      if (!currentPath || !dirName.trim()) {
        return;
      }

      try {
        const newDirPath = join(currentPath, dirName);
        mkdirSync(newDirPath, { recursive: false });

        // Refresh the options to show the new directory
        setOptions((prevOptions) => {
          const newOption = {
            name: dirName,
            value: newDirPath,
            description: `Directory in ${currentPath}`,
          };
          return [...prevOptions, newOption].sort((a, b) =>
            a.name.localeCompare(b.name),
          );
        });
      } catch (error) {
        console.error("Failed to create directory:", error);
      }
    },
    [currentPath, setOptions],
  );

  const openModal = useCallback(() => {
    setCreateDirCallback(() => createDirectory);
    openCreateDirModal();
  }, [createDirectory, setCreateDirCallback, openCreateDirModal]);

  return {
    openModal,
  };
};
