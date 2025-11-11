import { useTerminalDimensions } from "@opentui/react";
import { NoteNameInput } from "../note-name-input";
import { DirSelect } from "../dir-select";
import { TemplateSelect } from "../template-select";
import { TagsSelect } from "../tags-select";
import { AliasesInput } from "../aliases-input";
import { CreateNote } from "../create-note";
import type { LayoutProps } from "./types";

export const WideScreenLayout = ({
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
  const { width } = useTerminalDimensions();

  return (
    <box
      style={{
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        maxWidth: width,
        padding: 2,
      }}
    >
      {/* First row - Name and Directory */}
      <box
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          width: "50%",
          minHeight: 5,
        }}
      >
        <NoteNameInput
          focused={!isConfigMenuOpen && !isDebugMenuOpen && isNameTabActive()}
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <AliasesInput
          focused={
            !isConfigMenuOpen && !isDebugMenuOpen && isAliasesTabActive()
          }
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </box>

      {/* Second row - Template and Tags */}
      <box
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 4,
          width: "100%",
        }}
      >
        <DirSelect
          focused={!isConfigMenuOpen && !isDebugMenuOpen && isDirsTabActive()}
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <TemplateSelect
          focused={
            !isConfigMenuOpen && !isDebugMenuOpen && isTemplateTabActive()
          }
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </box>

      {/* Third row - Aliases */}
      <box
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 4,
          width: "100%",
        }}
      >
        <TagsSelect
          focused={!isConfigMenuOpen && !isDebugMenuOpen && isTagsTabActive()}
          tabOptions={tabOptions}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        <box
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: 62,
            minHeight: 10,
          }}
        >
          {isCreateTabActive() ? (
            <CreateNote isWideScreen={true} focused={true} />
          ) : (
              <CreateNote isWideScreen={true} focused={false} />
            )}
        </box>
      </box>
    </box>
  );
};
