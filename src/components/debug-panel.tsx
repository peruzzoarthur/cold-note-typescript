import type { KeyEvent } from "@opentui/core";
import { useGlobalKeyboard } from "../contexts/AppStateContext";
import { useCallback } from "react";
import { Modal } from "./modal";
import { theme } from "../theme";
import { LAYOUT } from "../constants";

type DebugPanelProps = {
  isDebugOpen: boolean;
  debugLogs: string[];
};

export const DebugPanel = ({ isDebugOpen, debugLogs }: DebugPanelProps) => {
  const { handleGlobalKey } = useGlobalKeyboard();

  const handleDebugKeyDown = useCallback((key: KeyEvent) => {
    if (handleGlobalKey(key)) {
      return;
    }
  }, [handleGlobalKey]);

  if (!isDebugOpen) return null;

  return (
    <Modal
      width={LAYOUT.MODAL.DEBUG_WIDTH}
      height={LAYOUT.MODAL.DEBUG_HEIGHT}
      top={LAYOUT.MODAL.DEBUG_TOP}
      left={LAYOUT.MODAL.DEBUG_LEFT}
      backgroundColor={theme.inactiveBg}
    >
      <box flexDirection="column" padding={LAYOUT.SPACING.SMALL}>
        <text marginBottom={LAYOUT.SPACING.SMALL}>
          Debug Logs (Ctrl+D to close, Escape to close)
        </text>
        <scrollbox
          style={{
            rootOptions: {
              backgroundColor: theme.scrollRoot,
            },
            wrapperOptions: {
              backgroundColor: theme.scrollWrapper,
            },
            viewportOptions: {
              backgroundColor: theme.scrollViewport,
            },
            contentOptions: {
              backgroundColor: theme.scrollContent,
            },
            scrollbarOptions: {
              showArrows: true,
              trackOptions: {
                foregroundColor: theme.scrollbarTrack,
                backgroundColor: theme.scrollbarBg,
              },
            },
          }}
          focused
          onKeyDown={handleDebugKeyDown}
        >
          {debugLogs.map((log, index) => (
            <box
              key={index}
              style={{
                width: "100%",
                padding: LAYOUT.SPACING.SMALL,
                marginBottom: LAYOUT.SPACING.SMALL,
                backgroundColor: index % 2 === 0 ? theme.logEven : theme.logOdd,
              }}
            >
              <text content={log} />
            </box>
          ))}
        </scrollbox>
      </box>
    </Modal>
  );
};
