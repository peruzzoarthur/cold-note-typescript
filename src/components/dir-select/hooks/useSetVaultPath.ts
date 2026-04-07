import { readdirSync, statSync } from "fs";
import { join } from "path";
import { useEffect, useState } from "react";
import { ConfigRepository } from "../../../database/repositories/Config";
import { expandVaultPath } from "../../../utils";
import type { SelectOption } from "@opentui/core";

type UseSetVaultPathProps = {
  path?: string;
  setOptions: React.Dispatch<React.SetStateAction<SelectOption[]>>;
  setCurrentOption?: (option: SelectOption | null) => void;
};

export const useSetVaultPath = ({ path, setOptions, setCurrentOption }: UseSetVaultPathProps) => {
  const [configRepo] = useState(() => new ConfigRepository());

  useEffect(() => {
    try {
      const config = configRepo.find();
      if (config?.obsidian_vault && !path) {
        const vaultPath = expandVaultPath(config.obsidian_vault);
        if (!vaultPath) {
          console.error("Invalid vault path: path traversal detected");
          setOptions([
            {
              name: "Error",
              value: "",
              description: "Invalid vault path configuration. Path traversal detected.",
            },
          ]);
          return;
        }
        try {
          const entries = readdirSync(vaultPath);
          const dirs = entries
            .filter((entry) => {
              try {
                const fullPath = join(vaultPath, entry);
                return (
                  statSync(fullPath).isDirectory() && !entry.startsWith(".")
                );
              } catch {
                return false;
              }
            })
            .sort()
            .map((dir) => ({
              name: dir,
              value: join(vaultPath, dir),
              description: `Directory in ${config.obsidian_vault}`,
            }));

          setOptions(dirs);
          // Reset current option to first item when loading new directory
          const firstDir = dirs[0];
          if (firstDir && setCurrentOption) {
            setCurrentOption(firstDir);
          }
        } catch (error) {
          console.error("Failed to read vault directory:", error);
          setOptions([
            {
              name: "Error",
              value: "",
              description: "Could not read vault directory. Check config.",
            },
          ]);
        }
      } else if (config?.obsidian_vault && !!path) {
        try {
          const vaultPath = expandVaultPath(config.obsidian_vault);
          if (!vaultPath) {
            console.error("Invalid vault path: path traversal detected");
            setOptions([
              {
                name: "Error",
                value: "",
                description: "Invalid vault path configuration. Path traversal detected.",
              },
            ]);
            return;
          }

          const entries = readdirSync(path);
          const dirs = entries
            .filter((entry) => {
              try {
                const fullPath = join(path, entry);
                return (
                  statSync(fullPath).isDirectory() && !entry.startsWith(".")
                );
              } catch {
                return false;
              }
            })
            .sort()
            .map((dir) => ({
              name: dir,
              value: join(path, dir),
              description: `Directory in ${path}`,
            }));

          const options: SelectOption[] = [];
          if (path !== vaultPath) {
            const pathParts = path.split('/').filter(Boolean);
            pathParts.pop();
            const parentPath = '/' + pathParts.join('/');
            options.push({
              name: "Press '-' to go back...",
              value: parentPath,
              description: "Parent directory",
            });
          }

          const allOptions = [...options, ...dirs];
          setOptions(allOptions);
          // Reset current option to first actual directory (skip "go back" option)
          const firstDirOption = dirs[0];
          if (firstDirOption && setCurrentOption) {
            setCurrentOption(firstDirOption);
          } else if (allOptions[0] && setCurrentOption) {
            // If no directories, select the "go back" option
            setCurrentOption(allOptions[0]);
          }
        } catch (error) {
          console.error("Failed to read vault directory:", error);
          setOptions([
            {
              name: "Error",
              value: "",
              description: "Could not read vault directory. Check config.",
            },
          ]);
        }
      } else {
        setOptions([
          {
            name: "No vault configured",
            value: "",
            description: "Open config (Ctrl+P) to set Obsidian vault path",
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to load config:", error);
      setOptions([]);
    }
  }, [configRepo, path]);
};
