import { resolve, normalize } from "path";
import type { KeyEvent } from "@opentui/core";
import type { TabSelectObject } from "./types";

export const handleKeyDown = (
  key: KeyEvent,
  selectedTab: number,
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>,
  tabOptions: TabSelectObject[],
): void => {
  if (key.name === "return" || key.name === "enter") {
    const newIndex = (selectedTab + 1) % tabOptions.length;
    setSelectedTab(newIndex);
  }
};

export const tabOptions: TabSelectObject[] = [
  { name: "Name", description: "Manage your notes" },
  {
    name: "Aliases",
    description: "Select aliases to be applied to the note",
  },
  {
    name: "Directory",
    description: "Select the directory to save your note",
  },
  {
    name: "Template",
    description: "Select note template",
  },
  {
    name: "Tags",
    description: "Select tags to be applied to the note",
  },
  {
    name: "Create",
    description: "Create note",
  },
];

/**
 * Validates and normalizes a vault path, ensuring it doesn't escape the allowed directory.
 * Replaces ~ with the user's home directory before validation.
 *
 * @param vaultPath - The raw vault path from config (may contain ~)
 * @param allowedBasePath - The base directory that the vault must be within
 * @returns The validated and resolved path, or null if validation fails
 */
export function validateVaultPath(
  vaultPath: string,
  allowedBasePath: string,
): string | null {
  // Replace ~ with home directory
  const expandedPath = vaultPath.replace(/^~/, process.env.HOME || "");

  const resolvedPath = resolve(normalize(expandedPath));
  const resolvedBase = resolve(normalize(allowedBasePath));

  // Ensure the path is within the allowed base directory
  if (!resolvedPath.startsWith(resolvedBase)) {
    return null; // Path escapes allowed directory
  }

  return resolvedPath;
}

/**
 * Safely expands a vault path from config, replacing ~ with home directory.
 *
 * @param vaultPath - The raw vault path from config (may contain ~)
 * @returns The expanded path or null if invalid
 */
export function expandVaultPath(vaultPath: string): string | null {
  const expandedPath = vaultPath.replace(/^~/, process.env.HOME || "");

  // Validate no path traversal attempts
  const normalized = normalize(expandedPath);
  if (normalized.includes("..")) {
    return null;
  }

  return expandedPath;
}
