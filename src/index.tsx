import {  TextAttributes, TabSelectRenderable } from "@opentui/core";
import { render } from "@opentui/react";
import { useState, useRef, useEffect } from "react";
import { useNavigation } from "./hooks/useNavigation";
import type { TabSelectObject } from "./types";
import { NoteNameInput } from "./components/note-name-input";
import { SelectDir } from "./components/select-dir";

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const tabSelectRef = useRef<TabSelectRenderable>(null);
  const [noteName, setNoteName] = useState<string | null>(null);
  
  const isNameTabActive = () => tabOptions[selectedTab]?.name === "Name";
  const isTagsTabActive = () => tabOptions[selectedTab]?.name === "Tags";

  const tabOptions: TabSelectObject[] = [
    { name: "Name", description: "Manage your notes" },
    { name: "Tags", description: "Configure app settings" },
  ];


  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  // Sync React state with TabSelect component
  useEffect(() => {
    if (tabSelectRef.current) {
      tabSelectRef.current.setSelectedIndex(selectedTab);
    }
  }, [selectedTab]);

  useNavigation({
    onTab: () => {
      // Tab moves to next tab (forward)
      const newIndex = (selectedTab + 1) % tabOptions.length;
      setSelectedTab(newIndex);
    },
    onShiftTab: () => {
      // Shift+Tab moves to previous tab (backward)
      const newIndex = (selectedTab - 1 + tabOptions.length) % tabOptions.length;
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
        <ascii-font font="tiny" text="ColdNote" />
        <text attributes={TextAttributes.DIM}>
          Create your notes in the terminal
        </text>

        <box>
          <tab-select
            ref={tabSelectRef}
            options={tabOptions}
            onSelect={handleTabChange}
            focused={false}
            width={60}
            height={1}
            showDescription={false}
            showUnderline={false}
            backgroundColor="#2A2A3A"
            textColor="#FFFFFF"
            selectedBackgroundColor="#5A5A6A"
            selectedTextColor="#CBA6F7"
          />
        </box>

        {isNameTabActive() && 
          <NoteNameInput focused={true} noteName={noteName} setNoteName={setNoteName} />
        }

        {isTagsTabActive() && 
          <box padding={1} backgroundColor="#444444">
            <SelectDir />
            <text>Tags content - focused and ready for interaction</text>
          </box>
        }

        <text>Selected tab: {tabOptions[selectedTab]?.name}</text>
        <text attributes={TextAttributes.DIM}>
          Tab Navigation: h/l (vim), Tab (next), Shift+Tab (prev) | Focus: {tabOptions[selectedTab]?.name} content
        </text>
      </box>
    </box>
  );
}

render(<App />);
