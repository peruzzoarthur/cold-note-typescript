import { TextAttributes } from "@opentui/core";

export const Footer = () => {
  return (
    <>
      <text attributes={TextAttributes.DIM}>
        Tab Navigation: h/j/k/l (vim), Tab (next), Shift+Tab (prev) | Focus:{" "}
      </text>
    </>
  );
};
