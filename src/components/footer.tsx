import { TextAttributes } from "@opentui/core";

export const Footer = () => {
  return (
    <>
      <text attributes={TextAttributes.DIM}>
        Tab Navigation: h/l (vim), Tab (next), Shift+Tab (prev) | Focus:{" "}
      </text>
    </>
  );
};
