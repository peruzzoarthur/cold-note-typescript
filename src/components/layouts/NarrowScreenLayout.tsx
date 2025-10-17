import { NoteNameInput } from "../note-name-input";
import { DirSelect } from "../dir-select";
import { TemplateSelect } from "../template-select";
import { TagsSelect } from "../tags-select";
import { AliasesInput } from "../aliases-input";
import { CreateNote } from "../create-note";
import type { LayoutProps } from "./types";

export const NarrowScreenLayout = ({
  isConfigMenuOpen,
  isDebugMenuOpen,
  selectedTab,
  setSelectedTab,
  tabOptions,
  isNameTabActive,
  isDirsTabActive,
  isTemplateTabActive,
  isTagsTabActive,
  isAliasesTabActive,
  isCreateTabActive,
}: LayoutProps) => {
  return (
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

      {isCreateTabActive() && (
        <CreateNote 
          isWideScreen={false} 
          focused={!isConfigMenuOpen && !isDebugMenuOpen} 
        />
      )}
    </box>
  );
};