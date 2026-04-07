import { useEffect } from "react";
import { useDirNavigationStore } from "../store";
import type { UseYaziNavigationReturn } from "../types";

interface UseYaziNavigationProps {
  vaultPath: string | null;
}

export function useYaziNavigation({ vaultPath }: UseYaziNavigationProps): UseYaziNavigationReturn {
  const store = useDirNavigationStore();
  
  // Initialize vault path on mount or when it changes
  useEffect(() => {
    if (vaultPath !== store.vaultPath) {
      store.setVaultPath(vaultPath);
    }
  }, [vaultPath, store.vaultPath, store.setVaultPath]);
  
  return {
    tree: store.tree,
    currentNode: store.currentNode,
    options: store.options,
    navigateToChild: store.navigateToChild,
    navigateToParent: store.navigateToParent,
    selectChild: store.selectChild,
    refreshTree: store.refreshTree,
    addDirectory: store.addDirectory,
    removeDirectory: store.removeDirectory,
    renameDirectory: store.renameDirectory,
  };
}
