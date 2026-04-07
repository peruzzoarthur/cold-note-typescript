import type { TabSelectRenderable } from "@opentui/core";
import type { TabSelectObject } from "../types";
import { theme } from "../theme";
import { LAYOUT } from "../constants";

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
        width={isWideScreen ? LAYOUT.DIMENSIONS.TAB_SELECT_WIDTH_WIDE : LAYOUT.DIMENSIONS.TAB_SELECT_WIDTH_NARROW}
        height={LAYOUT.DIMENSIONS.TAB_SELECT_HEIGHT}
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
