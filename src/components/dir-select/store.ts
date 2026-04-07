import { create } from 'zustand';
import type { SelectOption } from "@opentui/core";
import type { DirectoryNode, NavigationTree } from "./types";
import {
  buildDirectoryTree,
  navigateToChildNode,
  navigateToParentNode,
  selectChildNode,
  nodesToOptions,
  addNodeToTree,
  removeNodeFromTree,
  renameNodeInTree,
} from "./utils/tree";

interface DirNavigationState {
  // State
  tree: NavigationTree | null;
  currentNode: DirectoryNode | null;
  options: SelectOption[];
  vaultPath: string | null;
  
  // Actions
  setVaultPath: (vaultPath: string | null) => void;
  navigateToChild: (childName?: string) => boolean;
  navigateToParent: () => boolean;
  selectChild: (index: number) => void;
  refreshTree: () => void;
  addDirectory: (parentPath: string, dirName: string) => void;
  removeDirectory: (dirPath: string) => void;
  renameDirectory: (oldPath: string, newName: string) => void;
}

// Helper to create a new tree reference with cloned nodes Map
function cloneTree(tree: NavigationTree): NavigationTree {
  return {
    vaultPath: tree.vaultPath,
    currentPath: tree.currentPath,
    nodes: new Map(tree.nodes),
  };
}

export const useDirNavigationStore = create<DirNavigationState>((set, get) => ({
  // Initial state
  tree: null,
  currentNode: null,
  options: [],
  vaultPath: null,
  
  // Set vault path and build tree
  setVaultPath: (vaultPath: string | null) => {
    if (!vaultPath) {
      set({ tree: null, currentNode: null, options: [], vaultPath: null });
      return;
    }
    
    const tree = buildDirectoryTree(vaultPath);
    const currentNode = tree.nodes.get(tree.currentPath) || null;
    const options = currentNode ? nodesToOptions(tree, currentNode.dirPath) : [];
    
    set({ tree, currentNode, options, vaultPath });
  },
  
  // Navigate to child directory
  navigateToChild: (childName?: string): boolean => {
    const { tree } = get();
    if (!tree) return false;
    
    const childNode = navigateToChildNode(tree, childName);
    if (!childNode) return false;
    
    // Clone tree to trigger update
    const newTree = cloneTree(tree);
    const options = nodesToOptions(newTree, childNode.dirPath);
    
    set({ tree: newTree, currentNode: childNode, options });
    
    return true;
  },
  
  // Navigate to parent directory
  navigateToParent: (): boolean => {
    const { tree } = get();
    if (!tree) return false;
    
    const parentNode = navigateToParentNode(tree);
    if (!parentNode) return false;
    
    // Clone tree to trigger update
    const newTree = cloneTree(tree);
    const options = nodesToOptions(newTree, parentNode.dirPath);
    
    set({ tree: newTree, currentNode: parentNode, options });
    
    return true;
  },
  
  // Select a child (updates selected index but doesn't navigate)
  selectChild: (index: number): void => {
    const { tree, currentNode } = get();
    if (!tree || !currentNode) return;
    
    // Adjust index to account for "go back" option
    const adjustedIndex = currentNode.parentPath ? index - 1 : index;
    
    if (selectChildNode(tree, adjustedIndex)) {
      // Clone tree to trigger update
      const newTree = cloneTree(tree);
      set({ tree: newTree });
    }
  },
  
  // Refresh tree from filesystem
  refreshTree: (): void => {
    const { vaultPath, tree: oldTree } = get();
    if (!vaultPath) return;
    
    const currentPath = oldTree?.currentPath;
    const tree = buildDirectoryTree(vaultPath);
    
    // Try to restore current path
    if (currentPath && tree.nodes.has(currentPath)) {
      tree.currentPath = currentPath;
    }
    
    const currentNode = tree.nodes.get(tree.currentPath) || null;
    const options = currentNode ? nodesToOptions(tree, currentNode.dirPath) : [];
    
    set({ tree, currentNode, options });
  },
  
  // Add new directory
  addDirectory: (parentPath: string, dirName: string): void => {
    const { tree, currentNode } = get();
    if (!tree) return;
    
    addNodeToTree(tree, parentPath, dirName);
    
    // Clone tree and refresh state
    const newTree = cloneTree(tree);
    const updatedNode = currentNode 
      ? newTree.nodes.get(currentNode.dirPath) || null
      : null;
    const options = updatedNode 
      ? nodesToOptions(newTree, updatedNode.dirPath) 
      : [];
    
    set({ tree: newTree, currentNode: updatedNode, options });
  },
  
  // Remove directory
  removeDirectory: (dirPath: string): void => {
    const { tree } = get();
    if (!tree) return;
    
    removeNodeFromTree(tree, dirPath);
    
    // Clone tree and refresh state
    const newTree = cloneTree(tree);
    const currentNode = newTree.nodes.get(newTree.currentPath) || null;
    const options = currentNode ? nodesToOptions(newTree, currentNode.dirPath) : [];
    
    set({ tree: newTree, currentNode, options });
  },
  
  // Rename directory
  renameDirectory: (oldPath: string, newName: string): void => {
    const { tree } = get();
    if (!tree) return;
    
    renameNodeInTree(tree, oldPath, newName);
    
    // Clone tree and refresh state
    const newTree = cloneTree(tree);
    const currentNode = newTree.nodes.get(newTree.currentPath) || null;
    const options = currentNode ? nodesToOptions(newTree, currentNode.dirPath) : [];
    
    set({ tree: newTree, currentNode, options });
  },
}));
