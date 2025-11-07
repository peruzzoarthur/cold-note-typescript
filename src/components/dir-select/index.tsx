import { useGlobalKeyboard } from "../../contexts/GlobalKeyboardContext";
import { useNoteContext } from "../../contexts/NoteContext";
import { useTabNavigation } from "../../hooks/useTabNavigation";
import type { TabSelectObject } from "../../types";
import { useSetVaultPath } from "./hooks/useSetVaultPath";
import { useNavigateDir } from "./hooks/useNavigateDir";
import { useVaultConfig } from "./hooks/useVaultConfig";
import { useDirSelection } from "./hooks/useDirSelection";
import { useSelectSync } from "./hooks/useSelectSync";
import { useDirNavigationHandlers } from "./hooks/useDirNavigationHandlers";
import { useCreateDir } from "./hooks/useCreateDir";
import { useModal } from "../../contexts/ModalContext";

type DirSelectProps = {
  focused: boolean;
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  tabOptions: TabSelectObject[];
};

export const DirSelect = ({
  focused,
  selectedTab,
  setSelectedTab,
  tabOptions,
}: DirSelectProps) => {
  const { noteData, setDirPath } = useNoteContext();
  const { handleKeyDown } = useTabNavigation(
    selectedTab,
    setSelectedTab,
    tabOptions,
  );
  const { handleGlobalKey } = useGlobalKeyboard();

  const { vaultRoot } = useVaultConfig();
  const { options, setOptions, path, setPath, currentOption, setCurrentOption } =
    useDirSelection();

  const { handleNavigateDir } = useNavigateDir(setPath, vaultRoot);

  useSetVaultPath({ path, setOptions });

  const { selectRef } = useSelectSync({
    options,
    selectedPath: noteData.dirPath,
  });

  const { openModal } = useCreateDir({
    currentPath: path,
    setOptions,
  });

  const { isCreateDirModalOpen } = useModal();

  const { handleNavigationKeyDown } = useDirNavigationHandlers({
    currentOption,
    path,
    handleNavigateDir,
    handleGlobalKey,
    handleKeyDown,
    onCreateDir: openModal,
  });

  return (
    <box style={{ paddingLeft: 1, paddingRight: 1 }}>
      <box
        style={{
          height: 12,
          width: 60,
          marginBottom: 1,
          border: true,
        }}
      >
        <select
          ref={selectRef}
          focused={focused && !isCreateDirModalOpen}
          onChange={(_, option) => {
            setCurrentOption(option || null);
            setDirPath(option?.value);
          }}
          onKeyDown={handleNavigationKeyDown}
          selectedTextColor="#CBA6F7"
          showScrollIndicator
          options={options}
          style={{ flexGrow: 1 }}
        />
      </box>
    </box>
  );
};
