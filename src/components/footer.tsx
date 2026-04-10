import { TextAttributes } from "@opentui/core";

export const Footer = () => {
  return (
    <box alignItems="center">
      <text attributes={TextAttributes.DIM}>
        Tab: ←/→ or Alt+1-6 | Config: Ctrl+P | Debug: Ctrl+D
      </text>
    </box>
  );
};
