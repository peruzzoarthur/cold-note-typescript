import { TabSelectRenderable } from "@opentui/core";
import { render } from "@opentui/react";
import { useState, useRef, useEffect } from "react";
import { useNavigation } from "./hooks/useNavigation";
import type { TabSelectObject } from "./types";
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

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const tabSelectRef = useRef<TabSelectRenderable>(null);

  const tabOptions: TabSelectObject[] = [
    { name: "Name", description: "Manage your notes" },
    {
      name: "Directory",
      description: "Select the directory to save your note",
    },
    {
      name: "Template",
      description: "Select note template",
    },
    {
      name: "Tags",
      description: "Select tags to be applied to the note",
    },
    {
      name: "Aliases",
      description: "Select aliases to be applied to the note",
    },
    {
      name: "Create",
      description: "Create note",
    },
  ];

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
      const newIndex = (selectedTab + 1) % tabOptions.length;
      setSelectedTab(newIndex);
    },
    onShiftTab: () => {
      const newIndex =
        (selectedTab - 1 + tabOptions.length) % tabOptions.length;
      setSelectedTab(newIndex);
    },
  });

  return (
    <box
      style={{ alignItems: "center", justifyContent: "center", flexGrow: 1 }}
      backgroundColor="#1E1E2F"
    >
      <box style={{ justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
        <Header />

        <TabSelect
          tabSelectRef={tabSelectRef}
          tabOptions={tabOptions}
          handleTabChange={handleTabChange}
        />

        <box
          style={{ height: 15, width: 60, flexDirection: "row", justifyContent: "center", alignItems: "center" }}
        >
          {isNameTabActive() && (
            <NoteNameInput
              focused={true}
              tabOptions={tabOptions}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}

          {isDirsTabActive() && (
            <DirSelect
              focused={true}
              tabOptions={tabOptions}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}

          {isTemplateTabActive() && (
            <TemplateSelect
              focused={true}
              tabOptions={tabOptions}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}

          {isTagsTabActive() && (
            <TagsSelect
              focused={true}
              tabOptions={tabOptions}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}

          {isAliasesTabActive() && (
            <AliasesInput
              focused={true}
              tabOptions={tabOptions}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}
          {isCreateTabActive() && (
            <CreateNote />
          )}
        </box>
        <Footer />
      </box>
    </box>
  );
}

render(
  <NoteProvider>
    <App />
  </NoteProvider>
);
