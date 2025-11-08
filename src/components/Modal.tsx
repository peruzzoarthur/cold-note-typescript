import { RGBA } from "@opentui/core";
import { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  width?: string;
  height?: string;
  top?: string;
  left?: string;
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
  borderColor = "#CBA6F7",
  backgroundColor = "#1E1E2F",
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
            zIndex: 999,
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
          zIndex: 1000,
        }}
      >
        {children}
      </box>
    </>
  );
};
