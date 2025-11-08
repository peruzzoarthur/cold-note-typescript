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

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const tabSelectRef = useRef<TabSelectRenderable>(null);

  const { registerGlobalHandler } = useGlobalKeyboard();
  const {
    addDebugLog,
    debugLogs,
  } = useAppMenus();

  const {
    isAnyModalOpen,
    isCreateDirModalOpen,
    isConfigModalOpen,
    isDebugModalOpen,
    openConfigModal,
    openDebugModal,
    closeModal,
    closeCreateDirModal,
    closeConfigModal,
    closeDebugModal,
    createDirCallback,
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
      if (!isAnyModalOpen) {
        const newIndex = (selectedTab + 1) % tabOptions.length;
        setSelectedTab(newIndex);
      }
    },
    onShiftTab: () => {
      if (!isAnyModalOpen) {
        const newIndex =
          (selectedTab - 1 + tabOptions.length) % tabOptions.length;
        setSelectedTab(newIndex);
      }
    },
  });

  const handleGlobalKeys = useCallback(
    (key: KeyEvent): boolean => {
      // If any modal is open and tab is pressed, don't handle tab navigation
      if (isAnyModalOpen && key.name === "tab") {
        return false; // Let the modal handle it
      }

      if (key.ctrl && key.name === "d") {
        if (isDebugModalOpen) {
          closeDebugModal();
        } else {
          openDebugModal();
        }
        return true;
      }
      if (key.ctrl && (key.name === "," || key.name === "p")) {
        if (isConfigModalOpen) {
          closeConfigModal();
        } else {
          openConfigModal();
        }
        return true;
      }
      if (key.name === "escape") {
        if (isAnyModalOpen) {
          closeModal();
          return true;
        }
        return false;
      }
      return false;
    },
    [
      isAnyModalOpen,
      isConfigModalOpen,
      isDebugModalOpen,
      openConfigModal,
      openDebugModal,
      closeModal,
      closeConfigModal,
      closeDebugModal,
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
        isMenuOpen={isConfigModalOpen}
        setIsMenuOpen={closeConfigModal}
      />
      <DebugPanel isDebugOpen={isDebugModalOpen} debugLogs={debugLogs} />
      {isCreateDirModalOpen && createDirCallback && (
        <CreateDirModal
          onSubmit={(dirName) => {
            createDirCallback(dirName);
            closeCreateDirModal();
          }}
          onCancel={closeCreateDirModal}
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
            isConfigMenuOpen={isConfigModalOpen}
            isDebugMenuOpen={isDebugModalOpen}
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
            isConfigMenuOpen={isConfigModalOpen}
            isDebugMenuOpen={isDebugModalOpen}
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
