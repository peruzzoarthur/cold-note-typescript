import type { KeyEvent } from "@opentui/core";
import { useGlobalKeyboard } from "../contexts/GlobalKeyboardContext";
import { useCallback } from "react";

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
    <box
      style={{
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "80%",
        height: "80%",
        border: true,
        backgroundColor: "#2A2A40",
        zIndex: 1000
      }}
    >
      <box flexDirection="column" padding={1}>
        <text marginBottom={1}>
          Debug Logs (Ctrl+D to close, Escape to close)
        </text>
        <scrollbox
          style={{
            rootOptions: {
              backgroundColor: "#24283b",
            },
            wrapperOptions: {
              backgroundColor: "#1f2335",
            },
            viewportOptions: {
              backgroundColor: "#1a1b26",
            },
            contentOptions: {
              backgroundColor: "#16161e",
            },
            scrollbarOptions: {
              showArrows: true,
              trackOptions: {
                foregroundColor: "#7aa2f7",
                backgroundColor: "#414868",
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
                backgroundColor: index % 2 === 0 ? "#292e42" : "#2f3449" 
              }}
            >
              <text content={log} />
            </box>
          ))}
        </scrollbox>
      </box>
    </box>
  );
};
