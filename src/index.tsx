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

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const tabSelectRef = useRef<TabSelectRenderable>(null);
  const [noteName, setNoteName] = useState<string | null>(null);
  const [dirPath, setDirPath] = useState<string | null>(null);
  const [templatePath, setTemplatePath] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [aliases, setAliases] = useState<string | null>(null);

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
  ];

  const isNameTabActive = () => tabOptions[selectedTab]?.name === "Name";
  const isDirsTabActive = () => tabOptions[selectedTab]?.name === "Directory";
  const isTemplateTabActive = () =>
    tabOptions[selectedTab]?.name === "Template";
  const isTagsTabActive = () => tabOptions[selectedTab]?.name === "Tags";
  const isAliasesTabActive = () => tabOptions[selectedTab]?.name === "Aliases";

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
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      backgroundColor="#1E1E2F"
    >
      <box justifyContent="center" alignItems="center" gap={2}>
        <Header />

        <TabSelect
          tabSelectRef={tabSelectRef}
          tabOptions={tabOptions}
          handleTabChange={handleTabChange}
        />

        {isNameTabActive() && (
          <NoteNameInput
            focused={true}
            noteName={noteName}
            setNoteName={setNoteName}
            tabOptions={tabOptions}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        )}

        {isDirsTabActive() && (
          <DirSelect
            focused={true}
            dirPath={dirPath}
            setDirPath={setDirPath}
            tabOptions={tabOptions}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        )}

        {isTemplateTabActive() && (
          <TemplateSelect
            focused={true}
            templatePath={templatePath}
            setTemplatePath={setTemplatePath}
            tabOptions={tabOptions}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        )}

        {isTagsTabActive() && (
          <TagsSelect
            focused={true}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            tabOptions={tabOptions}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        )}

        {isAliasesTabActive() && (
          <AliasesInput
            focused={true}
            aliases={aliases}
            setAliases={setAliases}
          />
        )}
        <Footer />
      </box>
    </box>
  );
}

render(<App />);
