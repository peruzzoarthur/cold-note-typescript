import { NoteNameInput } from "../note-name-input";
import { DirSelect } from "../dir-select";
import { TemplateSelect } from "../template-select";
import { TagsSelect } from "../tags-select";
import { AliasesInput } from "../aliases-input";
import { CreateNote } from "../create-note";
import type { LayoutProps } from "./types";
import { LAYOUT } from "../../constants";

export const NarrowScreenLayout = ({
  isConfigMenuOpen,
  isDebugMenuOpen,
  isAnyModalOpen,
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
  const canFocus = !isConfigMenuOpen && !isDebugMenuOpen && !isAnyModalOpen;

  return (
    <box
      style={{
        height: LAYOUT.DIMENSIONS.NARROW_SCREEN_HEIGHT,
        width: LAYOUT.DIMENSIONS.NARROW_SCREEN_WIDTH,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isNameTabActive() && (
        <NoteNameInput
          focused={canFocus}
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}

      {isDirsTabActive() && (
        <DirSelect
          focused={canFocus}
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}

      {isTemplateTabActive() && (
        <TemplateSelect
          focused={canFocus}
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}

      {isTagsTabActive() && (
        <TagsSelect
          focused={canFocus}
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}

      {isAliasesTabActive() && (
        <AliasesInput
          focused={canFocus}
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      )}

      {isCreateTabActive() && (
        <CreateNote
          isWideScreen={false}
          focused={canFocus}
        />
      )}
    </box>
  );
};
