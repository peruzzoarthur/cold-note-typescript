import type { TabSelectRenderable } from "@opentui/core";

type TabSelectProps = {
  tabSelectRef: React.RefObject<TabSelectRenderable | null>;
};
export const TabSelect = ({tabSelectRef}: TabSelectProps) => {
  return (
    <box>
      <tab-select
        ref={tabSelectRef}
        width={60}
        height={5}
        textColor="#FFFFFF"
        selectedBackgroundColor="#5A5A6A"
        selectedTextColor="#CBA6F7"
      />
    </box>
  );
};
