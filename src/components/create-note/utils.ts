import { spawn } from "bun-pty";
import { useRenderer } from "@opentui/react";

type OpenNoteProps = {
  setNvimRunning: React.Dispatch<React.SetStateAction<boolean>>;
  fullPath: string;
  dirPath: string;
};

export const useOpenNote = ({
  setNvimRunning,
  fullPath,
  dirPath,
}: OpenNoteProps) => {
  const renderer = useRenderer();

  const openNote = async () => {

    // Destroy renderer BEFORE messing with stdin
    renderer.destroy();

    // Small delay to ensure renderer cleanup is complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    setNvimRunning(true);

    // Store ALL original stdin state
    const originalListeners = process.stdin.listeners("data");
    const originalRawMode = process.stdin.isRaw;

    // Remove all data listeners
    process.stdin.removeAllListeners("data");

    // Ensure stdin is resumed and in raw mode
    process.stdin.resume();
    process.stdin.setRawMode(true);

    // Clear screen and hide cursor
    process.stdout.write("\x1b[?25l\x1b[2J\x1b[H");

    // Create PTY for nvim
    const nvimPty = spawn("nvim", [fullPath], {
      name: "xterm-256color",
      cols: process.stdout.columns || 80,
      rows: process.stdout.rows || 24,
      cwd: dirPath, // Use the note's directory as cwd
    });

    // Pipe PTY output to stdout
    nvimPty.onData((data) => {
      process.stdout.write(data);
    });

    // Pipe stdin to PTY - make sure this is working
    const stdinHandler = (data: Buffer) => {
      nvimPty.write(data.toString());
    };

    process.stdin.on("data", stdinHandler);

    // Handle resize events
    const resizeHandler = () => {
      if (process.stdout.columns && process.stdout.rows) {
        nvimPty.resize(process.stdout.columns, process.stdout.rows);
      }
    };
    process.stdout.on("resize", resizeHandler);

    // Handle nvim exit
    nvimPty.onExit(() => {
      // Clean up stdin handler
      process.stdin.removeListener("data", stdinHandler);
      process.stdout.removeListener("resize", resizeHandler);

      // Restore stdin state
      process.stdin.setRawMode(originalRawMode);

      // Restore original listeners
      originalListeners.forEach((listener: any) => {
        process.stdin.on("data", listener);
      });

      // Clear screen and show cursor
      process.stdout.write("\x1b[2J\x1b[H\x1b[?25h");

      // Re-enable the UI
      setNvimRunning(false);
    });
  };

  return { openNote };
};
