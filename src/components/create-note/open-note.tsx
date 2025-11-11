import { spawn } from "child_process";
import { useRenderer } from "@opentui/react";

type OpenNoteParams = {
  fullPath: string;
  dirPath: string;
};

export const useOpenNote = () => {
  const renderer = useRenderer();

  const openNote = async ({ fullPath, dirPath }: OpenNoteParams) => {
    const terminalCommands = [
      ["kitty", "nvim", fullPath],
      ["konsole", "-e", "nvim", fullPath],
      ["gnome-terminal", "--", "nvim", fullPath],
      ["xterm", "-e", "nvim", fullPath],
      ["alacritty", "-e", "nvim", fullPath],
      ["wezterm", "start", "--", "nvim", fullPath],
      ["x-terminal-emulator", "-e", "nvim", fullPath],
    ];

    let launched = false;

    for (const [terminal, ...args] of terminalCommands) {
      try {
        const child = spawn(terminal as string, args as string[], {
          cwd: dirPath || undefined,
          detached: true,
          stdio: "ignore",
        });

        await new Promise((resolve, reject) => {
          child.on("error", reject);
          child.on("spawn", () => {
            launched = true;
            console.log(`Opened nvim in ${terminal}`);
            child.unref();
            resolve(void 0);
          });

          setTimeout(() => {
            if (!launched) {
              reject(new Error("Timeout"));
            }
          }, 1000);
        });

        if (launched) break;
      } catch (error) {
        continue;
      }
    }

    if (!launched) {
      console.log(
        "No terminal emulator found, opening nvim in current terminal...",
      );

      // Fallback: Open nvim directly in the current terminal (blocking)
      try {
        renderer.stop();

        const nvimProcess = spawn("nvim", [fullPath], {
          cwd: dirPath || undefined,
          stdio: "inherit",
        });

        await new Promise<void>((resolve, reject) => {
          nvimProcess.on("exit", (code) => {
            if (code === 0 || code === null) {
              console.log("Editor closed");
              resolve();
            } else {
              reject(new Error(`nvim exited with code ${code}`));
            }
          });

          nvimProcess.on("error", (error) => {
            reject(error);
          });
        });
      } catch (error) {
        console.error("Failed to open nvim:", error);
        console.log(`You can manually run: nvim "${fullPath}"`);
      }
    }
  };

  return openNote;
};
