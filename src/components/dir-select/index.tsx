import type { KeyEvent, SelectOption, SelectRenderable } from "@opentui/core";
import { useRef, useCallback, useEffect } from "react";
import { theme } from "../../theme";
import { useGlobalKeyboard, useModal } from "../../contexts/AppStateContext";
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
  
  // Get state and actions from Zustand store
  const store = useDirNavigationStore();
  const { currentNode, options } = store;

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
    if (store.currentNode.childrenPaths.length === 0) return; // placeholder shown, nothing to restore
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

  // Create modals - hooks now set up callbacks via useEffect
  const { openModal: openCreateDirModal } = useCreateDir({
    currentPath: currentNode?.dirPath || vaultRoot || undefined,
  });

  const { openModal: openDeleteDirModal } = useDeleteDir();

  const { openModal: openRenameDirModal } = useRenameDir({
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

      // Navigate to child directory (l or right) — always consume, only act if there are children
      if (key.name === "l" && !key.ctrl && !key.meta) {
        if (currentNode?.childrenPaths.length) {
          const success = store.navigateToChild();
          if (success && store.currentNode) {
            setDirPath(store.currentNode.dirPath);
          }
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
        openCreateDirModal();
        return;
      }

      // Delete highlighted child directory (d or delete)
      if ((key.name === "d" || key.name === "delete") && highlightedChildPath) {
        openDeleteDirModal(highlightedChildPath);
        return;
      }

      // Rename highlighted child directory (r)
      if (key.name === "r" && highlightedChildPath) {
        openRenameDirModal(highlightedChildPath);
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
      // Skip if we're restoring cursor from effect (to prevent overwriting nextPath)
      if (isRestoringCursor.current) return;
      // Skip null, special options, and the empty-dir placeholder
      if (!option || !store.tree || !option.value || option.name === "Press '-' to go back...") return;
      const index = options.findIndex(opt => opt.value === option.value);
      if (index >= 0) {
        store.selectChild(index);
        setDirPath(option.value ?? null);
      }
    },
    [store, options, setDirPath]
  );

  // Never pass an empty options array to Select — an empty list corrupts its internal
  // cursor state and breaks all subsequent key events until navigation restores it.
  const displayOptions = options.length > 0
    ? options
    : [{ name: "—  no subdirectories  —", value: "", description: "" }];

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
          options={displayOptions}
          style={{ flexGrow: 1 }}
        />
      </box>
    </box>
  );
};
