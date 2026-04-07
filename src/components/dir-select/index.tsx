import type { KeyEvent } from "@opentui/core";
import { theme } from "../../theme";
import { useGlobalKeyboard, useModal } from "../../contexts/AppStateContext";
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
import { useDeleteDir } from "./hooks/useDeleteDir";
import { useRenameDir } from "./hooks/useRenameDir";
import { LAYOUT } from "../../constants";

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
  const {
    options,
    setOptions,
    path,
    setPath,
    currentOption,
    setCurrentOption,
  } = useDirSelection();

  const { handleNavigateDir } = useNavigateDir(setPath, vaultRoot || undefined);

  useSetVaultPath({ path, setOptions });

  const { selectRef } = useSelectSync({
    options,
    selectedPath: noteData.dirPath,
  });

  const { openModal: openCreateDirModal } = useCreateDir({
    currentPath: path || vaultRoot || undefined,
    setOptions,
  });

  const { openModal: openDeleteDirModal } = useDeleteDir({
    dirPath: currentOption?.value,
    setOptions,
  });

  const { openModal: openRenameDirModal } = useRenameDir({
    dirPath: currentOption?.value,
    setOptions,
    selectedDirPath: noteData.dirPath,
    setSelectedDirPath: setDirPath,
  });

  const { isCreateDirModalOpen, isDeleteDirModalOpen, isRenameDirModalOpen } =
    useModal();

  const { handleNavigationKeyDown } = useDirNavigationHandlers({
    currentOption,
    path,
    handleNavigateDir,
    handleGlobalKey,
    handleKeyDown,
    onCreateDir: openCreateDirModal,
    onDeleteDir: openDeleteDirModal,
    onRenameDir: openRenameDirModal,
  });

  return (
    <box style={{ paddingLeft: LAYOUT.SPACING.SMALL, paddingRight: LAYOUT.SPACING.SMALL }}>
      <box
        style={{
          height: LAYOUT.DIMENSIONS.SELECT_HEIGHT,
          width: LAYOUT.DIMENSIONS.SELECT_WIDTH,
          marginBottom: LAYOUT.SPACING.SMALL,
          border: true,
        }}
      >
        <select
          ref={selectRef}
          focused={
            focused &&
            !isCreateDirModalOpen &&
            !isDeleteDirModalOpen &&
            !isRenameDirModalOpen
          }
          onChange={(_, option) => {
            setCurrentOption(option || null);
            setDirPath(option?.value);
          }}
          onKeyDown={handleNavigationKeyDown}
          selectedTextColor={theme.accent}
          showScrollIndicator
          options={options}
          style={{ flexGrow: 1 }}
        />
      </box>
    </box>
  );
};
