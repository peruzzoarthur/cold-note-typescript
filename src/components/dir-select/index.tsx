import type { KeyEvent, SelectOption, SelectRenderable } from "@opentui/core";
import { useRef, useCallback, useEffect } from "react";
import { theme } from "../../theme";
import { useGlobalKeyboard, useModal, useAppMenus } from "../../contexts/AppStateContext";
import { useNoteContext } from "../../contexts/NoteContext";
import { useTabNavigation } from "../../hooks/useTabNavigation";
import type { TabSelectObject } from "../../types";
import { useDirNavigationStore } from "./store";
import { useVaultConfig } from "./hooks/useVaultConfig";
import { useCreateDir } from "./hooks/useCreateDir";
import { useDeleteDir } from "./hooks/useDeleteDir";
import { useRenameDir } from "./hooks/useRenameDir";
import { LAYOUT } from "../../constants";
import { getSelectedIndex } from "./utils/tree";

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
  const { handleKeyDown } = useTabNavigation(selectedTab, setSelectedTab, tabOptions);
  const { handleGlobalKey } = useGlobalKeyboard();
  const { vaultRoot } = useVaultConfig();
  const { addDebugLog } = useAppMenus();
  
  // Get state and actions from Zustand store
  const store = useDirNavigationStore();
  const { currentNode, options } = store;

  // DEBUG: Log component render state
  useEffect(() => {
    addDebugLog(`[DirSelect] Render - currentNode: ${currentNode?.dirPath || 'null'}, selectedChildIdx: ${currentNode?.selectedChildIndex}, children: ${currentNode?.childrenPaths.length}`);
  }, [currentNode?.dirPath, currentNode?.selectedChildIndex, currentNode?.childrenPaths.length, addDebugLog]);

  // Ref for the select component to control cursor position
  const selectRef = useRef<SelectRenderable | null>(null);
  
  // Track whether we're restoring cursor from effect (to prevent onChange overwriting nextPath)
  const isRestoringCursor = useRef(false);

  // Initialize vault path synchronously during render (same pattern as original).
  // useEffect causes a delayed init that leaves store.tree = null on first render,
  // making navigateToChild() return false silently until the effect fires.
  const initialized = useRef(false);
  if (!initialized.current && vaultRoot) {
    store.setVaultPath(vaultRoot);
    initialized.current = true;
  }

  // Restore cursor position when navigating to a different directory.
  // Dep is dirPath only — firing on store.tree would loop: setSelectedIndex
  // → onChange → selectChild → cloneTree → new tree ref → effect again.
  useEffect(() => {
    if (!selectRef.current || !store.tree || !store.currentNode) return;
    const idx = getSelectedIndex(store.tree, store.currentNode.dirPath);
    isRestoringCursor.current = true;
    selectRef.current.setSelectedIndex(idx);
    // Reset flag after a tick to allow onChange to fire but skip the update
    setTimeout(() => { 
      isRestoringCursor.current = false;
    }, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.currentNode?.dirPath]);
  
  // Compute the path of the highlighted (selected) child — this is what d/r should act on.
  // Create should still act on the current directory (the parent).
  const highlightedChildPath =
    currentNode &&
    currentNode.childrenPaths.length > 0 &&
    currentNode.selectedChildIndex >= 0 &&
    currentNode.selectedChildIndex < currentNode.childrenPaths.length
      ? currentNode.childrenPaths[currentNode.selectedChildIndex]
      : undefined;

  // DEBUG: Log highlighted child path
  useEffect(() => {
    addDebugLog(`[DirSelect] highlightedChildPath: ${highlightedChildPath || 'undefined'}`);
  }, [highlightedChildPath, addDebugLog]);

  // Create modals
  const { openModal: openCreateDirModal } = useCreateDir({
    currentPath: currentNode?.dirPath || vaultRoot || undefined,
  });

  const { openModal: openDeleteDirModal } = useDeleteDir({
    dirPath: highlightedChildPath,
  });

  const { openModal: openRenameDirModal } = useRenameDir({
    dirPath: highlightedChildPath,
    selectedDirPath: noteData.dirPath,
    setSelectedDirPath: setDirPath,
  });

  const { isCreateDirModalOpen, isDeleteDirModalOpen, isRenameDirModalOpen } = useModal();

  // Handle keyboard navigation
  const handleNavigationKeyDown = useCallback(
    (key: KeyEvent) => {
      // Handle global keys first
      if (handleGlobalKey(key)) {
        return;
      }

      // Navigate to child directory (l or right)
      if (key.name === "l" && !key.ctrl && !key.meta) {
        const success = store.navigateToChild();
        if (success && store.currentNode) {
          setDirPath(store.currentNode.dirPath);
        }
        return;
      }

      // Navigate to parent directory (h, -, or left)
      // Only allow if not at vault root
      if ((key.name === "-" || key.name === "h" || key.name === "left") && currentNode?.parentPath) {
        const success = store.navigateToParent();
        if (success && store.currentNode) {
          setDirPath(store.currentNode.dirPath);
        }
        return;
      }

      // Create directory (a or +)
      if ((key.name === "a" || key.name === "+") && openCreateDirModal) {
        addDebugLog(`[DirSelect] Opening create dir modal - currentPath: ${currentNode?.dirPath || vaultRoot || 'undefined'}`);
        openCreateDirModal();
        return;
      }

      // Delete highlighted child directory (d or delete)
      if ((key.name === "d" || key.name === "delete") && highlightedChildPath && openDeleteDirModal) {
        addDebugLog(`[DirSelect] Opening delete dir modal - dirPath: ${highlightedChildPath}`);
        openDeleteDirModal();
        return;
      }

      // Rename highlighted child directory (r)
      if (key.name === "r" && highlightedChildPath && openRenameDirModal) {
        addDebugLog(`[DirSelect] Opening rename dir modal - dirPath: ${highlightedChildPath}`);
        openRenameDirModal();
        return;
      }

      // Tab navigation
      handleKeyDown(key);
    },
    [
      handleGlobalKey,
      store,
      currentNode,
      highlightedChildPath,
      openCreateDirModal,
      openDeleteDirModal,
      openRenameDirModal,
      handleKeyDown,
      setDirPath,
    ]
  );

  // Handle selection change — only tracks which child is highlighted.
  // go-back navigation is handled exclusively by the h/- key handler.
  const handleChange = useCallback(
    (_index: number, option: SelectOption | null) => {
      addDebugLog(`[DirSelect] handleChange called - _index: ${_index}, option.value: ${option?.value}, option.name: ${option?.name}`);
      // Skip if we're restoring cursor from effect (to prevent overwriting nextPath)
      if (isRestoringCursor.current) {
        addDebugLog(`[DirSelect] handleChange SKIPPED - isRestoringCursor is true`);
        return;
      }
      if (!option || !store.tree || option.name === "Press '-' to go back...") {
        addDebugLog(`[DirSelect] handleChange SKIPPED - !option: ${!option}, !store.tree: ${!store.tree}`);
        return;
      }
      const index = options.findIndex(opt => opt.value === option.value);
      addDebugLog(`[DirSelect] handleChange - found index in options: ${index}, calling store.selectChild(${index})`);
      if (index >= 0) {
        store.selectChild(index);
        setDirPath(option.value ?? null);
        addDebugLog(`[DirSelect] handleChange completed - setDirPath to: ${option.value}`);
      }
    },
    [store, options, setDirPath, addDebugLog]
  );

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
          onChange={handleChange}
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
