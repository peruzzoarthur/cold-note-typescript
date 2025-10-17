import { KeyEvent, type SelectOption, type SelectRenderable } from "@opentui/core";
import { useRef, useState, useEffect, useCallback } from "react";
import type { TabSelectObject } from "../types";
import { useTabNavigation } from "../hooks/useTabNavigation";
import { useNoteContext } from "../contexts/NoteContext";
import { useGlobalKeyboard } from "../contexts/GlobalKeyboardContext";
import type { Tag } from "../database";
import "./ui/create-button";

type TagsSelectProps = {
  focused: boolean;
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  tabOptions: TabSelectObject[];
};

export const TagsSelect = ({
  focused,
  selectedTab,
  setSelectedTab,
  tabOptions,
}: TagsSelectProps) => {
  const { noteData, setSelectedTags, tagRepository } = useNoteContext();
  const { handleKeyDown: handleTabNavigation } = useTabNavigation(
    selectedTab,
    setSelectedTab,
    tabOptions,
  );
  const { handleGlobalKey } = useGlobalKeyboard();

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isInputMode, setIsInputMode] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [activeButton, setActiveButton] = useState(0); // 0 for add, 1 for search

  useEffect(() => {
    if (tagRepository) {
      loadTags();
    }
  }, [tagRepository]);

  const loadTags = useCallback(() => {
    if (!tagRepository) return;
    
    try {
      const tags = tagRepository.findAll();
      setAvailableTags(tags);
      setFilteredTags(tags);
    } catch (error) {
      console.error("Failed to load tags:", error);
    }
  }, [tagRepository]);

  const handleSearch = useCallback(
    (query: string) => {
      if (!tagRepository) return;
      
      if (!query.trim()) {
        setFilteredTags(availableTags);
      } else {
        try {
          const searchResults = tagRepository.search(query);
          setFilteredTags(searchResults);
        } catch (error) {
          console.error("Search failed:", error);
          setFilteredTags([]);
        }
      }
    },
    [tagRepository, availableTags],
  );

  useEffect(() => {
    handleSearch(searchInput);
  }, [searchInput, handleSearch]);

  const displayOptions: SelectOption[] = filteredTags.map((tag) => {
    const isSelected = noteData.selectedTags.includes(tag.name);
    const prefix = isSelected ? "● " : "○ ";

    return {
      name: `${prefix}${tag.name}`,
      value: tag.name,
      description: `Tag: ${tag.name}`,
    };
  });

  const selectRef = useRef<SelectRenderable | null>(null);

  const handleTagToggle = (index: number, option: SelectOption | null) => {
    if (!option) return;

    const actualTag = filteredTags[index];
    if (!actualTag) return;

    const tagName = actualTag.name;
    setSelectedTags(
      noteData.selectedTags.includes(tagName)
        ? noteData.selectedTags.filter((tag) => tag !== tagName)
        : [...noteData.selectedTags, tagName],
    );
  };

  const handleAddTag = async () => {
    if (!newTagInput.trim() || !tagRepository) return;

    try {
      if (!tagRepository.exists(newTagInput.trim())) {
        tagRepository.create(newTagInput.trim());
        loadTags();
      }

      // Add to selected tags if not already selected
      if (!noteData.selectedTags.includes(newTagInput.trim())) {
        setSelectedTags([...noteData.selectedTags, newTagInput.trim()]);
      }

      setNewTagInput("");
      setIsInputMode(false);
    } catch (error) {
      console.error("Failed to add tag:", error);
    }
  };

  const handleInputKeyDown = (key: any) => {
    // Check global keys first
    if (handleGlobalKey(key)) {
      return;
    }
    
    if (key.name === "return" || key.name === "enter") {
      if (activeButton === 0) {
        handleAddTag();
      }
    } else if (key.name === "escape") {
      setIsInputMode(false);
      setNewTagInput("");
    } else if (key.name === "tab") {
      handleTabNavigation(key);
    }
  };

  const handleSearchKeyDown = (key: KeyEvent) => {
    // Check global keys first
    if (handleGlobalKey(key)) {
      return;
    }
    
    if (key.name === "escape") {
      setIsSearchMode(false);
      setSearchInput("");
      setFilteredTags(availableTags);
    } else if (key.name === "tab") {
      handleTabNavigation(key);
    }
  };

  const handleTagsKeyDown = (key: KeyEvent) => {
    // Check global keys first
    if (handleGlobalKey(key)) {
      return;
    }
    
    if (key.name === "space") {
      const currentIndex = selectRef.current?.getSelectedIndex?.() || 0;
      const currentOption = displayOptions[currentIndex] ?? null;
      handleTagToggle(currentIndex, currentOption);
    } else if (key.name === "return" || key.name === "enter") {
      handleTabNavigation(key);
    } else if (key.name === "n") {
      setIsInputMode(true);
    } else if (key.name === "s") {
      setIsSearchMode(true);
    } else if (key.name === "left") {
      setActiveButton(0);
    } else if (key.name === "right") {
      setActiveButton(1);
    }
  };

  const handleButtonNavigation = (key: KeyEvent) => {
    // Check global keys first
    if (handleGlobalKey(key)) {
      return;
    }
    
    if (key.name === "left") {
      setActiveButton(0);
    } else if (key.name === "right") {
      setActiveButton(1);
    } else if (key.name === "return" || key.name === "enter") {
      if (activeButton === 0) {
        setIsInputMode(true);
      } else if (activeButton === 1) {
        setIsSearchMode(true);
      }
    } else if (key.name === "tab") {
      handleTabNavigation(key);
    }
  };

  if (!tagRepository) {
    return (
      <box style={{ paddingLeft: 1, paddingRight: 1 }}>
        <box style={{ flexDirection: "column", alignItems: "center" }}>
          <text>Loading tags database...</text>
        </box>
      </box>
    );
  }

  if (isSearchMode) {
    return (
      <box style={{ paddingLeft: 1, paddingRight: 1 }}>
        <box style={{ flexDirection: "column", alignItems: "center" }}>
          <box style={{ border: true, width: 40, height: 3 }}>
            <input
              placeholder="Search tags..."
              value={searchInput}
              focused={focused}
              onKeyDown={handleSearchKeyDown}
              onInput={setSearchInput}
            />
          </box>
          <text>
            Found {filteredTags.length} tag(s) | Escape to clear search
          </text>
        </box>
      </box>
    );
  }

  if (isInputMode) {
    return (
      <box style={{ paddingLeft: 1, paddingRight: 1 }}>
        <box style={{ flexDirection: "column", alignItems: "center" }}>
          <box style={{ border: true, width: 40, height: 3 }}>
            <input
              placeholder="Enter new tag name..."
              value={newTagInput}
              focused={focused}
              onKeyDown={handleInputKeyDown}
              onInput={setNewTagInput}
            />
          </box>
          <box style={{ flexDirection: "row" }}>
            <createButton
              label="Add Tag"
              focused={activeButton === 0}
              width={20}
            />
            <createButton
              label="Cancel"
              focused={activeButton === 1}
              width={20}
            />
          </box>
          <text>Press Enter to add, Escape to cancel</text>
        </box>
      </box>
    );
  }

  return (
    <box style={{ paddingLeft: 1, paddingRight: 1 }}>
      <box style={{ flexDirection: "column" }}>
        <box
          style={{
            height: 10,
            width: 60,
            border: true,
          }}
        >
          <select
            ref={selectRef}
            focused={focused && !isInputMode}
            onSelect={handleTagToggle}
            onKeyDown={handleTagsKeyDown}
            showDescription={false}
            selectedTextColor="#CBA6F7"
            showScrollIndicator
            options={displayOptions}
            style={{ flexGrow: 1 }}
          />
        </box>
        <box style={{ flexDirection: "row", justifyContent: "center" }}>
          {/* <createButton */}
          {/*   label="New Tag (n)" */}
          {/*   focused={focused && !isInputMode && !isSearchMode && activeButton === 0} */}
          {/*   width={20} */}
          {/*   onKeyDown={handleButtonNavigation} */}
          {/* /> */}
          {/* <createButton */}
          {/*   label="Search (s)" */}
          {/*   focused={focused && !isInputMode && !isSearchMode && activeButton === 1} */}
          {/*   width={20} */}
          {/*   onKeyDown={handleButtonNavigation} */}
          {/* /> */}
        </box>
        <text>Space: toggle | n: new | s: search | Enter: next</text>
      </box>
    </box>
  );
};
