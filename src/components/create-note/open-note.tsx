import { spawn } from "child_process";
import { useRenderer } from "@opentui/react";

type OpenNoteParams = {
  setNvimRunning: React.Dispatch<React.SetStateAction<boolean>>;
  fullPath: string;
  dirPath: string;
};

export const useOpenNote = () => {
  const renderer = useRenderer();

  const openNote = async ({
    setNvimRunning,
    fullPath,
    dirPath,
  }: OpenNoteParams) => {

    // Detect available terminal and spawn nvim in a new terminal window
    const terminalCommands = [
      // Try kitty first
      ['kitty', 'nvim', fullPath],
      ['konsole', '-e', 'nvim', fullPath],
      ['gnome-terminal', '--', 'nvim', fullPath],
      ['xterm', '-e', 'nvim', fullPath],
      ['alacritty', '-e', 'nvim', fullPath],
      ['wezterm', 'start', '--', 'nvim', fullPath],
      ['x-terminal-emulator', '-e', 'nvim', fullPath],
    ];

    let launched = false;
    
    for (const [terminal, ...args] of terminalCommands) {
      try {
        const child = spawn(terminal, args, {
          cwd: dirPath,
          detached: true,
          stdio: 'ignore'
        });
        
        // Wait a moment to see if spawn actually succeeds
        await new Promise((resolve, reject) => {
          child.on('error', reject);
          child.on('spawn', () => {
            launched = true;
            console.log(`Opened nvim in ${terminal}`);
            child.unref(); // Don't wait for the terminal to close
            resolve(void 0);
          });
          
          // Timeout after 1 second if no spawn event
          setTimeout(() => {
            if (!launched) {
              reject(new Error('Timeout'));
            }
          }, 1000);
        });
        
        if (launched) break;
      } catch (error) {
        // Try next terminal
        continue;
      }
    }

    if (!launched) {
      console.error('Could not find a suitable terminal to launch nvim');
      console.log(`You can manually run: nvim "${fullPath}"`);
    }
  };

  return openNote;
};
