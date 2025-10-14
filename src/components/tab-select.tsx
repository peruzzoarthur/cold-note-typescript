import type { TabSelectRenderable } from "@opentui/core";
import type { TabSelectObject } from "../types";

type TabSelectProps = {
  tabSelectRef: React.RefObject<TabSelectRenderable | null>;
  tabOptions: TabSelectObject[];
  handleTabChange: (index: number) => void;
};
export const TabSelect = ({
  tabSelectRef,
  tabOptions,
  handleTabChange,
}: TabSelectProps) => {
  return (
    <box>
      <tab-select
        ref={tabSelectRef}
        options={tabOptions}
        onSelect={handleTabChange}
        focused={false}
        width={80}
        height={1}
        flexGrow={1}
        showDescription={false}
        showUnderline={true}
        backgroundColor="#2A2A3A"
        textColor="#FFFFFF"
        selectedBackgroundColor="#5A5A6A"
        selectedTextColor="#CBA6F7"
      />
    </box>
  );
};
