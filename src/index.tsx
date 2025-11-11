import { KeyEvent, TabSelectRenderable } from "@opentui/core";
import { render, useTerminalDimensions } from "@opentui/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigation } from "./hooks/useNavigation";
import { TabSelect } from "./components/tab-select";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { NoteProvider } from "./contexts/NoteContext";
import { tabOptions } from "./utils";
import { ConfigMenu } from "./components/config-menu";
import { DebugPanel } from "./components/debug-panel";
import {
  GlobalKeyboardProvider,
  useGlobalKeyboard,
} from "./contexts/GlobalKeyboardContext";
import { AppMenusProvider } from "./contexts/AppMenusContext";
import { useAppMenus } from "./hooks/useAppMenus";
import { runMigrations } from "./database";
import { WideScreenLayout } from "./components/layouts/WideScreenLayout";
import { NarrowScreenLayout } from "./components/layouts/NarrowScreenLayout";
import { ModalProvider, useModal } from "./contexts/ModalContext";
import { CreateDirModal } from "./components/dir-select/create-dir-modal";
import { DeleteDirModal } from "./components/dir-select/delete-dir-modal";
import { RenameDirModal } from "./components/dir-select/rename-dir-modal";

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const tabSelectRef = useRef<TabSelectRenderable>(null);

  const { registerGlobalHandler } = useGlobalKeyboard();
  const {
    isConfigMenuOpen,
    toggleConfigMenu,
    closeConfigMenu,
    isDebugMenuOpen,
    toggleDebugMenu,
    closeDebugMenu,
    addDebugLog,
    debugLogs,
  } = useAppMenus();

  const {
    isAnyModalOpen,
    isCreateDirModalOpen,
    closeCreateDirModal,
    createDirCallback,
    isDeleteDirModalOpen,
    closeDeleteDirModal,
    deleteDirCallback,
    deleteDirName,
    isRenameDirModalOpen,
    closeRenameDirModal,
    renameDirCallback,
    renameDirOldName,
  } = useModal();

  const { width, height } = useTerminalDimensions()
  
  const isWideScreen = width >= 120;

  const isNameTabActive = () => tabOptions[selectedTab]?.name === "Name";
  const isDirsTabActive = () => tabOptions[selectedTab]?.name === "Directory";
  const isTemplateTabActive = () =>
    tabOptions[selectedTab]?.name === "Template";
  const isTagsTabActive = () => tabOptions[selectedTab]?.name === "Tags";
  const isAliasesTabActive = () => tabOptions[selectedTab]?.name === "Aliases";
  const isCreateTabActive = () => tabOptions[selectedTab]?.name === "Create";

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  useEffect(() => {
    if (tabSelectRef.current) {
      tabSelectRef.current.setSelectedIndex(selectedTab);
    }
  }, [selectedTab]);

  useNavigation({
    onTab: () => {
      if (!isConfigMenuOpen && !isAnyModalOpen) {
        const newIndex = (selectedTab + 1) % tabOptions.length;
        setSelectedTab(newIndex);
      }
    },
    onShiftTab: () => {
      if (!isConfigMenuOpen && !isAnyModalOpen) {
        const newIndex =
          (selectedTab - 1 + tabOptions.length) % tabOptions.length;
        setSelectedTab(newIndex);
      }
    },
  });

  const handleGlobalKeys = useCallback(
    (key: KeyEvent): boolean => {
      // Block tab navigation when modals or menus are open
      if (key.name === "tab" && (isConfigMenuOpen || isCreateDirModalOpen || isDeleteDirModalOpen)) {
        return true;
      }

      if (key.ctrl && key.name === "d") {
        toggleDebugMenu();
        return true;
      }
      if ((key.ctrl && (key.name === "p")) || key.name === "f1") {
        toggleConfigMenu();
        return true;
      }
      if (key.name === "escape") {
        if (isCreateDirModalOpen) {
          closeCreateDirModal();
          return true;
        }
        if (isDeleteDirModalOpen) {
          closeDeleteDirModal();
          return true;
        }
        if (isRenameDirModalOpen) {
          closeRenameDirModal();
          return true;
        }
        if (isConfigMenuOpen || isDebugMenuOpen) {
          closeConfigMenu();
          closeDebugMenu();
          return true;
        }
        return false;
      }
      return false;
    },
    [
      addDebugLog,
      toggleDebugMenu,
      toggleConfigMenu,
      closeConfigMenu,
      closeDebugMenu,
      isConfigMenuOpen,
      isDebugMenuOpen,
      isCreateDirModalOpen,
      closeCreateDirModal,
      isDeleteDirModalOpen,
      closeDeleteDirModal,
      isRenameDirModalOpen,
      closeRenameDirModal,
    ],
  );

  useEffect(() => {
    addDebugLog(`dimensions: w=${width} h=${height}`);
  }, [width, height, addDebugLog]);

  useEffect(() => {
    registerGlobalHandler(handleGlobalKeys);
  }, [registerGlobalHandler, handleGlobalKeys]);

  return (
    <box
      backgroundColor="#1E1E2F"
      flexGrow={1}
      border={true}
      justifyContent="space-between"
    >
      <ConfigMenu
        isMenuOpen={isConfigMenuOpen}
        setIsMenuOpen={closeConfigMenu}
      />
      <DebugPanel isDebugOpen={isDebugMenuOpen} debugLogs={debugLogs} />
      {isCreateDirModalOpen && createDirCallback && (
        <CreateDirModal
          onSubmit={(dirName) => {
            createDirCallback(dirName);
            closeCreateDirModal();
          }}
          onCancel={closeCreateDirModal}
        />
      )}
      {isDeleteDirModalOpen && deleteDirCallback && deleteDirName && (
        <DeleteDirModal
          dirName={deleteDirName}
          onConfirm={() => {
            deleteDirCallback();
            closeDeleteDirModal();
          }}
          onCancel={closeDeleteDirModal}
        />
      )}
      {isRenameDirModalOpen && renameDirCallback && renameDirOldName && (
        <RenameDirModal
          oldName={renameDirOldName}
          onSubmit={(newName) => {
            renameDirCallback(newName);
            closeRenameDirModal();
          }}
          onCancel={closeRenameDirModal}
        />
      )}
      <box
        backgroundColor="#1E1E2F"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
        width="100%"
        maxWidth={width - 2}
        marginTop={isWideScreen ? 2 : 0}
      >
        <Header />

        <TabSelect
          tabSelectRef={tabSelectRef}
          tabOptions={tabOptions}
          handleTabChange={handleTabChange}
          isWideScreen={isWideScreen}
        />

        {isWideScreen ? (
          <WideScreenLayout
            isConfigMenuOpen={isConfigMenuOpen}
            isDebugMenuOpen={isDebugMenuOpen}
            isAnyModalOpen={isAnyModalOpen}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabOptions={tabOptions}
            isNameTabActive={isNameTabActive}
            isDirsTabActive={isDirsTabActive}
            isTemplateTabActive={isTemplateTabActive}
            isTagsTabActive={isTagsTabActive}
            isAliasesTabActive={isAliasesTabActive}
            isCreateTabActive={isCreateTabActive}
          />
        ) : (
          <NarrowScreenLayout
            isConfigMenuOpen={isConfigMenuOpen}
            isDebugMenuOpen={isDebugMenuOpen}
            isAnyModalOpen={isAnyModalOpen}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            tabOptions={tabOptions}
            isNameTabActive={isNameTabActive}
            isDirsTabActive={isDirsTabActive}
            isTemplateTabActive={isTemplateTabActive}
            isTagsTabActive={isTagsTabActive}
            isAliasesTabActive={isAliasesTabActive}
            isCreateTabActive={isCreateTabActive}
          />
        )}
      </box>
      <Footer />
    </box>
  );
}

runMigrations();

render(
  <GlobalKeyboardProvider>
    <AppMenusProvider>
      <ModalProvider>
        <NoteProvider>
          <App />
        </NoteProvider>
      </ModalProvider>
    </AppMenusProvider>
  </GlobalKeyboardProvider>,
);
