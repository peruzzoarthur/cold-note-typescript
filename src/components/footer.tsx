import { TextAttributes } from "@opentui/core";

export const Footer = () => {
  return (
    <box alignItems="center">
      <text attributes={TextAttributes.DIM}>
        Vim Navigation: h/j/k/l, Tab (next), Shift+Tab (prev)
      </text>
    </box>
  );
};
