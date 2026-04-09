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
  tree: NavigationTree | null;
  currentNode: DirectoryNode | null;
  options: SelectOption[];
  vaultPath: string | null;
  
  setVaultPath: (vaultPath: string | null) => void;
  navigateToChild: (childName?: string) => boolean;
  navigateToParent: () => boolean;
  selectChild: (index: number) => void;
  refreshTree: () => void;
  addDirectory: (parentPath: string, dirName: string) => void;
  removeDirectory: (dirPath: string) => void;
  renameDirectory: (oldPath: string, newName: string) => void;
}

function cloneTree(tree: NavigationTree): NavigationTree {
  return {
    vaultPath: tree.vaultPath,
    currentPath: tree.currentPath,
    nodes: new Map(tree.nodes),
  };
}

export const useDirNavigationStore = create<DirNavigationState>((set, get) => ({
  tree: null,
  currentNode: null,
  options: [],
  vaultPath: null,
  
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
  
  navigateToChild: (childName?: string): boolean => {
    const { tree } = get();
    if (!tree) return false;
    
    const childNode = navigateToChildNode(tree, childName);
    if (!childNode) return false;
    
    const newTree = cloneTree(tree);
    const options = nodesToOptions(newTree, childNode.dirPath);
    
    set({ tree: newTree, currentNode: childNode, options });
    
    return true;
  },
  
  navigateToParent: (): boolean => {
    const { tree } = get();
    if (!tree) return false;
    
    const parentNode = navigateToParentNode(tree);
    if (!parentNode) return false;
    
    const newTree = cloneTree(tree);
    const options = nodesToOptions(newTree, parentNode.dirPath);
    
    set({ tree: newTree, currentNode: parentNode, options });
    
    return true;
  },
  
  selectChild: (index: number): void => {
    console.log(`[store.selectChild] Called with index: ${index}`);
    const { tree, currentNode } = get();
    if (!tree || !currentNode) {
      console.log(`[store.selectChild] ABORT - tree: ${tree}, currentNode: ${currentNode}`);
      return;
    }
    
    console.log(`[store.selectChild] currentNode.dirPath: ${currentNode.dirPath}, childrenPaths.length: ${currentNode.childrenPaths.length}, current selectedChildIndex: ${currentNode.selectedChildIndex}`);
    
    if (selectChildNode(tree, index)) {
      console.log(`[store.selectChild] selectChildNode succeeded, cloning tree`);
      const newTree = cloneTree(tree);
      set({ tree: newTree });
      console.log(`[store.selectChild] Tree updated`);
    } else {
      console.log(`[store.selectChild] selectChildNode returned false`);
    }
  },
  
  refreshTree: (): void => {
    const { vaultPath, tree: oldTree } = get();
    if (!vaultPath) return;
    
    const currentPath = oldTree?.currentPath;
    const tree = buildDirectoryTree(vaultPath);
    
    if (currentPath && tree.nodes.has(currentPath)) {
      tree.currentPath = currentPath;
    }
    
    const currentNode = tree.nodes.get(tree.currentPath) || null;
    const options = currentNode ? nodesToOptions(tree, currentNode.dirPath) : [];
    
    set({ tree, currentNode, options });
  },
  
  addDirectory: (parentPath: string, dirName: string): void => {
    console.log(`[store.addDirectory] Called with parentPath: ${parentPath}, dirName: ${dirName}`);
    const { tree, currentNode } = get();
    if (!tree) {
      console.log(`[store.addDirectory] ABORT - tree is null`);
      return;
    }
    
    console.log(`[store.addDirectory] Calling addNodeToTree`);
    const newNode = addNodeToTree(tree, parentPath, dirName);
    if (!newNode) {
      console.log(`[store.addDirectory] ABORT - addNodeToTree returned null`);
      return; // filesystem or tree op failed — bail without phantom re-render
    }
    console.log(`[store.addDirectory] addNodeToTree succeeded, newNode.path: ${newNode.dirPath}`);
    
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
    console.log(`[store.removeDirectory] Called with dirPath: ${dirPath}`);
    const { tree } = get();
    if (!tree) {
      console.log(`[store.removeDirectory] ABORT - tree is null`);
      return;
    }
    
    console.log(`[store.removeDirectory] Calling removeNodeFromTree`);
    const success = removeNodeFromTree(tree, dirPath);
    if (!success) {
      console.log(`[store.removeDirectory] ABORT - removeNodeFromTree returned false`);
      return; // filesystem or tree op failed — bail without phantom re-render
    }
    console.log(`[store.removeDirectory] removeNodeFromTree succeeded`);
    
    // Clone tree and refresh state
    const newTree = cloneTree(tree);
    const currentNode = newTree.nodes.get(newTree.currentPath) || null;
    const options = currentNode ? nodesToOptions(newTree, currentNode.dirPath) : [];
    
    set({ tree: newTree, currentNode, options });
  },
  
  // Rename directory
  renameDirectory: (oldPath: string, newName: string): void => {
    console.log(`[store.renameDirectory] Called with oldPath: ${oldPath}, newName: ${newName}`);
    const { tree } = get();
    if (!tree) {
      console.log(`[store.renameDirectory] ABORT - tree is null`);
      return;
    }
    
    console.log(`[store.renameDirectory] Calling renameNodeInTree`);
    const renamedNode = renameNodeInTree(tree, oldPath, newName);
    if (!renamedNode) {
      console.log(`[store.renameDirectory] ABORT - renameNodeInTree returned null`);
      return; // filesystem or tree op failed — bail without phantom re-render
    }
    console.log(`[store.renameDirectory] renameNodeInTree succeeded, renamedNode.path: ${renamedNode.dirPath}`);
    
    // Clone tree and refresh state — currentPath may have been updated by renameNodeInTree
    const newTree = cloneTree(tree);
    const currentNode = newTree.nodes.get(newTree.currentPath) || null;
    const options = currentNode ? nodesToOptions(newTree, currentNode.dirPath) : [];
    
    set({ tree: newTree, currentNode, options });
  },
}));
