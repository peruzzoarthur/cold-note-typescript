import { renameSync } from "fs";
import { join, dirname, basename } from "path";
import { useCallback } from "react";
import { useModal } from "../../../contexts/ModalContext";

type UseRenameDirProps = {
  dirPath?: string;
  setOptions: React.Dispatch<React.SetStateAction<any[]>>;
  selectedDirPath: string | null;
  setSelectedDirPath: (path: string | null) => void;
};

export const useRenameDir = ({ dirPath, setOptions, selectedDirPath, setSelectedDirPath }: UseRenameDirProps) => {
  const { openRenameDirModal, setRenameDirCallback, setRenameDirOldName } = useModal();

  const renameDirectory = useCallback(
    (newName: string) => {
      if (!dirPath || !newName.trim()) {
        return;
      }

      try {
        const parentDir = dirname(dirPath);
        const newDirPath = join(parentDir, newName);

        renameSync(dirPath, newDirPath);

        // Update the selected path if the renamed directory is currently selected
        if (selectedDirPath === dirPath) {
          setSelectedDirPath(newDirPath);
        }

        setOptions((prevOptions) => {
          // Separate the back button from other options
          const backButton = prevOptions.find(opt => opt.name === "Press '-' to go back...");
          const regularOptions = prevOptions.filter(opt => opt.name !== "Press '-' to go back...");

          // Update the renamed directory
          const updatedOptions = regularOptions.map(opt => {
            if (opt.value === dirPath) {
              return {
                ...opt,
                name: newName,
                value: newDirPath,
                description: `Directory in ${parentDir}`,
              };
            }
            return opt;
          });

          // Sort alphabetically
          const sortedOptions = updatedOptions.sort((a, b) =>
            a.name.localeCompare(b.name),
          );

          // Put back button first if it exists
          return backButton ? [backButton, ...sortedOptions] : sortedOptions;
        });
      } catch (error) {
        console.error("Failed to rename directory:", error);
      }
    },
    [dirPath, setOptions, selectedDirPath, setSelectedDirPath],
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
