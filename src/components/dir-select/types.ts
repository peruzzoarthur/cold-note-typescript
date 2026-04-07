import type { SelectOption } from "@opentui/core";

export interface DirectoryNode {
  dirName: string;
  dirPath: string;
  parentPath: string | null;
  childrenPaths: string[];
  nextPath: string | null;
  selectedChildIndex: number;
}

export interface NavigationTree {
  nodes: Map<string, DirectoryNode>;
  vaultPath: string;
  currentPath: string;
}

export interface UseYaziNavigationReturn {
  tree: NavigationTree | null;
  currentNode: DirectoryNode | null;
  options: SelectOption[];
  navigateToChild: (childName?: string) => boolean;
  navigateToParent: () => boolean;
  selectChild: (index: number) => void;
  refreshTree: () => void;
  addDirectory: (parentPath: string, dirName: string) => void;
  removeDirectory: (dirPath: string) => void;
  renameDirectory: (oldPath: string, newName: string) => void;
}
