import { KeyEvent, TabSelectRenderable } from "@opentui/core";
import { render } from "@opentui/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigation } from "./hooks/useNavigation";
import { NoteNameInput } from "./components/note-name-input";
import { DirSelect } from "./components/dir-select";
import { TabSelect } from "./components/tab-select";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { TemplateSelect } from "./components/template-select";
import { TagsSelect } from "./components/tags-select";
import { AliasesInput } from "./components/aliases-input";
import { NoteProvider } from "./contexts/NoteContext";
import { CreateNote } from "./components/create-note";
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
      // Don't handle tab navigation if config menu is open
      if (!isConfigMenuOpen) {
        const newIndex = (selectedTab + 1) % tabOptions.length;
        setSelectedTab(newIndex);
      }
    },
    onShiftTab: () => {
      // Don't handle shift+tab navigation if config menu is open
      if (!isConfigMenuOpen) {
        const newIndex =
          (selectedTab - 1 + tabOptions.length) % tabOptions.length;
        setSelectedTab(newIndex);
      }
    },
  });

  const handleGlobalKeys = useCallback(
    (key: KeyEvent): boolean => {
      // If config menu is open, don't handle tab navigation
      if (isConfigMenuOpen && key.name === "tab") {
        return false; // Let the config menu handle it
      }
      
      if (key.ctrl && key.name === "d") {
        toggleDebugMenu();
        return true;
      }
      if (key.ctrl && (key.name === "," || key.name === "p")) {
        toggleConfigMenu();
        return true;
      }
      if (key.name === "escape") {
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
    ],
  );

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
      <box
        backgroundColor="#1E1E2F"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
      >
        <Header />

        <TabSelect
          tabSelectRef={tabSelectRef}
          tabOptions={tabOptions}
          handleTabChange={handleTabChange}
        />

        <box
          style={{
            height: 15,
            width: 60,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isNameTabActive() && (
            <NoteNameInput
              focused={!isConfigMenuOpen && !isDebugMenuOpen}
              tabOptions={tabOptions}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}

          {isDirsTabActive() && (
            <DirSelect
              focused={!isConfigMenuOpen && !isDebugMenuOpen}
              tabOptions={tabOptions}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}

          {isTemplateTabActive() && (
            <TemplateSelect
              focused={!isConfigMenuOpen && !isDebugMenuOpen}
              tabOptions={tabOptions}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}

          {isTagsTabActive() && (
            <TagsSelect
              focused={!isConfigMenuOpen && !isDebugMenuOpen}
              tabOptions={tabOptions}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}

          {isAliasesTabActive() && (
            <AliasesInput
              focused={!isConfigMenuOpen && !isDebugMenuOpen}
              tabOptions={tabOptions}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}
          {isCreateTabActive() && <CreateNote />}
        </box>
      </box>
      <Footer />
    </box>
  );
}

runMigrations();

render(
  <GlobalKeyboardProvider>
    <AppMenusProvider>
      <NoteProvider>
        <App />
      </NoteProvider>
    </AppMenusProvider>
  </GlobalKeyboardProvider>,
);
