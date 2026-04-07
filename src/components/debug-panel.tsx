import type { KeyEvent } from "@opentui/core";
import { useGlobalKeyboard } from "../contexts/GlobalKeyboardContext";
import { useCallback } from "react";
import { Modal } from "./modal";
import { theme } from "../theme";

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
      width="80%"
      height="80%"
      top="10%"
      left="10%"
      backgroundColor={theme.inactiveBg}
    >
      <box flexDirection="column" padding={1}>
        <text marginBottom={1}>
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
                padding: 1,
                marginBottom: 1,
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
