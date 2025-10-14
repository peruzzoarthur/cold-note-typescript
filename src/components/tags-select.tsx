import {
  type SelectOption,
  type SelectRenderable,
} from "@opentui/core";
import { useRef } from "react";
import type { TabSelectObject } from "../types";
import { useTabNavigation } from "../hooks/useTabNavigation";
import { useNoteContext } from "../contexts/NoteContext";

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
  const { noteData, setSelectedTags } = useNoteContext();
  const { handleKeyDown: handleTabNavigation } = useTabNavigation(selectedTab, setSelectedTab, tabOptions);
  const options: SelectOption[] = [
    {
      name: "Javascript",
      value: "javascript",
      description: "JavaScript programming language",
    },
    { name: "Linux", value: "linux", description: "Linux operating system" },
    {
      name: "Arch Linux",
      value: "arch-linux",
      description: "Arch Linux distribution",
    },
    {
      name: "Typescript",
      value: "typescript",
      description: "TypeScript programming language",
    },
    { name: "React", value: "react", description: "React JavaScript library" },
    {
      name: "NestJs",
      value: "nestjs",
      description: "NestJS Node.js framework",
    },
    { name: "AWS", value: "aws", description: "Amazon Web Services" },
    {
      name: "Programming",
      value: "programming",
      description: "General programming concepts",
    },
    { name: "Github", value: "github", description: "GitHub version control" },
    { name: "Docker", value: "docker", description: "Docker containerization" },
    {
      name: "Frontend",
      value: "frontend",
      description: "Frontend development",
    },
    { name: "nvim", value: "nvim", description: "Neovim text editor" },
    { name: "Next", value: "next", description: "Next.js React framework" },
    { name: "git", value: "git", description: "Git version control" },
    {
      name: "Graphql",
      value: "graphql",
      description: "GraphQL query language",
    },
    { name: "brave", value: "brave", description: "Brave web browser" },
    { name: "nix", value: "nix", description: "Nix package manager" },
    { name: "NixOS", value: "nixos", description: "NixOS operating system" },
    {
      name: "vercel",
      value: "vercel",
      description: "Vercel deployment platform",
    },
    {
      name: "python",
      value: "python",
      description: "Python programming language",
    },
    { name: "DiDi", value: "didi", description: "DiDi ride-sharing service" },
  ];

  const displayOptions: SelectOption[] = options.map((option) => {
    const isSelected = noteData.selectedTags.includes(option.value);
    const prefix = isSelected ? "● " : "○ ";
    
    return {
      ...option,
      name: `${prefix}${option.name}`,
    };
  });

  const selectRef = useRef<SelectRenderable | null>(null);

  const handleTagToggle = (index: number, option: SelectOption | null) => {
    if (!option) return;

    const actualOption = options[index];
    if (!actualOption) return;

    const tagValue = actualOption.value;
    setSelectedTags(
      noteData.selectedTags.includes(tagValue)
        ? noteData.selectedTags.filter((tag) => tag !== tagValue)
        : [...noteData.selectedTags, tagValue],
    );
  };

  const handleTagsKeyDown = (key: any) => {
    if (key.name === "space") {
      const currentIndex = selectRef.current?.getSelectedIndex?.() || 0;
      const currentOption = displayOptions[currentIndex] ?? null;
      handleTagToggle(currentIndex, currentOption);
    } else if (key.name === "return" || key.name === "enter") {
      handleTabNavigation(key);
    }
  };

  return (
    <box style={{ paddingLeft: 1, paddingRight: 1 }}>
      <box
        style={{
          height: 12,
          width: 60,
          marginBottom: 1,
          border: true,
        }}
      >
        <select
          ref={selectRef}
          focused={focused}
          onSelect={handleTagToggle}
          onKeyDown={handleTagsKeyDown}
          showDescription={false}
          backgroundColor="#CBA6F7"
          selectedTextColor="#CBA6F7"
          showScrollIndicator
          options={displayOptions}
          style={{ flexGrow: 1 }}
        />
      </box>
    </box>
  );
};
