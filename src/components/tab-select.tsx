import type { TabSelectRenderable } from "@opentui/core";
import type { TabSelectObject } from "../types";
import { theme } from "../theme";

type TabSelectProps = {
  tabSelectRef: React.RefObject<TabSelectRenderable | null>;
  tabOptions: TabSelectObject[];
  handleTabChange: (index: number) => void;
  isWideScreen: boolean
};
export const TabSelect = ({
  tabSelectRef,
  tabOptions,
  handleTabChange,
  isWideScreen
}: TabSelectProps) => {
  return (
    <box>
      <tab-select
        ref={tabSelectRef}
        options={tabOptions}
        onSelect={handleTabChange}
        focused={false}
        width={isWideScreen ? 120 : 80}
        height={1}
        flexGrow={1}
        showDescription={false}
        showUnderline={true}
        backgroundColor={theme.inactiveBg}
        textColor={theme.fg}
        selectedBackgroundColor={theme.line}
        selectedTextColor={theme.accent}
      />
    </box>
  );
};
