import { useMemo } from "react";
import { useTerminalDimensions } from "@opentui/react";
import { NoteNameInput } from "../note-name-input";
import { DirSelect } from "../dir-select";
import { TemplateSelect } from "../template-select";
import { TagsSelect } from "../tags-select";
import { AliasesInput } from "../aliases-input";
import { CreateNote } from "../create-note";
import type { LayoutProps } from "./types";
import { LAYOUT } from "../../constants";

export const WideScreenLayout = ({
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
  const { width } = useTerminalDimensions();
  const canFocus = !isConfigMenuOpen && !isDebugMenuOpen && !isAnyModalOpen;

  const containerStyle = useMemo(() => ({
    flexDirection: "column" as const,
    justifyContent: "flex-start" as const,
    alignItems: "center" as const,
    width: "100%" as `${number}%`,
    maxWidth: width,
    padding: LAYOUT.SPACING.MEDIUM,
  }), [width]);

  const firstRowStyle = useMemo(() => ({
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
    gap: LAYOUT.SPACING.MEDIUM,
    width: "50%" as `${number}%`,
    minHeight: LAYOUT.MIN_HEIGHT.FIRST_ROW,
  }), []);

  const secondRowStyle = useMemo(() => ({
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    alignItems: "flex-start" as const,
    gap: LAYOUT.SPACING.LARGE,
    width: "100%" as `${number}%`,
  }), []);

  const thirdRowStyle = useMemo(() => ({
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    alignItems: "flex-start" as const,
    gap: LAYOUT.SPACING.LARGE,
    width: "100%" as `${number}%`,
  }), []);

  const createNoteBoxStyle = useMemo(() => ({
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    width: LAYOUT.DIMENSIONS.FIRST_ROW_WIDTH,
    minHeight: LAYOUT.DIMENSIONS.SELECT_HEIGHT,
  }), []);

  return (
    <box style={containerStyle}>
      {/* First row - Name and Directory */}
      <box style={firstRowStyle}>
        <NoteNameInput
          focused={canFocus && isNameTabActive()}
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <AliasesInput
          focused={canFocus && isAliasesTabActive()}
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </box>

      {/* Second row - Template and Tags */}
      <box style={secondRowStyle}>
        <DirSelect
          focused={canFocus && isDirsTabActive()}
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <TemplateSelect
          focused={canFocus && isTemplateTabActive()}
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </box>

      {/* Third row - Aliases */}
      <box style={thirdRowStyle}>
        <TagsSelect
          focused={canFocus && isTagsTabActive()}
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <box style={createNoteBoxStyle}>
          <CreateNote
            isWideScreen={true}
            focused={canFocus && isCreateTabActive()}
          />
        </box>
      </box>
    </box>
  );
};
