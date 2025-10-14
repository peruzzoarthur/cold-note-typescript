import { TextAttributes } from "@opentui/core";

export const Header = () => {
  return (
    <>
      <ascii-font font="tiny" text="ColdNote" />
      <text attributes={TextAttributes.DIM}>
        Create your Obsidian notes in the terminal
      </text>
    </>
  );
};
