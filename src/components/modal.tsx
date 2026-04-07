import { RGBA } from "@opentui/core";
import { type ReactNode } from "react";
import { theme } from "../theme";
import { LAYOUT } from "../constants";

type ModalProps = {
  children: ReactNode;
  width?: number | "auto" | `${number}%`;
  height?: number | "auto" | `${number}%`;
  top?: number | "auto" | `${number}%`;
  left?: number | "auto" | `${number}%`;
  borderColor?: string;
  backgroundColor?: string;
  showBackdrop?: boolean;
  backdropOpacity?: number;
};

export const Modal = ({
  children,
  width = "70%",
  height = "40%",
  top = "20%",
  left = "15%",
  borderColor = theme.accent,
  backgroundColor = theme.bg,
  showBackdrop = true,
  backdropOpacity = 128, // 0-255, default 50%
}: ModalProps) => {
  return (
    <>
      {showBackdrop && (
        <box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: RGBA.fromInts(0, 0, 0, backdropOpacity),
            zIndex: LAYOUT.Z_INDEX.BACKDROP,
          }}
        />
      )}
      <box
        style={{
          position: "absolute",
          top,
          left,
          width,
          height,
          border: true,
          borderColor,
          backgroundColor,
          zIndex: LAYOUT.Z_INDEX.MODAL,
        }}
      >
        {children}
      </box>
    </>
  );
};
