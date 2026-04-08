import { readdirSync, statSync, mkdirSync, rmdirSync, renameSync } from "fs";
import { join, basename } from "path";
import type { SelectOption } from "@opentui/core";
import type { DirectoryNode, NavigationTree } from "../types";

// Helper to get children of a directory (lazy loading)
function getDirectoryChildren(dirPath: string): string[] {
  try {
    const entries = readdirSync(dirPath);
    return entries
      .filter((entry) => {
        try {
          const fullPath = join(dirPath, entry);
          return (
            statSync(fullPath).isDirectory() && !entry.startsWith(".")
          );
        } catch {
          return false;
        }
      })
      .sort()
      .map((entry) => join(dirPath, entry));
  } catch {
    // Directory might not be readable
    return [];
  }
}

export function buildDirectoryTree(vaultPath: string): NavigationTree {
  const nodes = new Map<string, DirectoryNode>();
  
  // Normalize vault path - remove trailing slash for consistency
  const normalizedVaultPath = vaultPath.endsWith('/') && vaultPath !== '/' 
    ? vaultPath.slice(0, -1) 
    : vaultPath;
  
  // Only load the root node initially, children are loaded on demand
  const rootChildren = getDirectoryChildren(normalizedVaultPath);
  
  const rootNode: DirectoryNode = {
    dirName: basename(normalizedVaultPath),
    dirPath: normalizedVaultPath,
    parentPath: null,
    childrenPaths: rootChildren,
    nextPath: rootChildren[0] || null,
    selectedChildIndex: 0,
  };
  
  nodes.set(normalizedVaultPath, rootNode);
  
  return {
    nodes,
    vaultPath: normalizedVaultPath,
    currentPath: normalizedVaultPath,
  };
}

// Lazy load a directory's children when first accessed
function ensureNodeLoaded(tree: NavigationTree, dirPath: string): DirectoryNode | null {
  // Normalize the path
  const normalizedPath = dirPath.endsWith('/') && dirPath !== '/' 
    ? dirPath.slice(0, -1) 
    : dirPath;
    
  let node = tree.nodes.get(normalizedPath);
  
  if (!node) {
    // Node doesn't exist, need to load it
    // Calculate parent path
    const lastSlashIndex = normalizedPath.lastIndexOf('/');
    if (lastSlashIndex <= 0) {
      // Root directory or invalid path
      return null;
    }
    
    const parentPath = normalizedPath.substring(0, lastSlashIndex);
    const parent = tree.nodes.get(parentPath);
    
    if (!parent) {
      console.error("[ensureNodeLoaded] Parent not found:", parentPath, "for child:", normalizedPath);
      return null;
    }
    
    if (!parent.childrenPaths.includes(normalizedPath)) {
      console.error("[ensureNodeLoaded] Path not in parent's children. Parent:", parentPath, "Children:", parent.childrenPaths, "Looking for:", normalizedPath);
      return null;
    }
    
    // Create the node
    const children = getDirectoryChildren(normalizedPath);
    node = {
      dirName: basename(normalizedPath),
      dirPath: normalizedPath,
      parentPath,
      childrenPaths: children,
      nextPath: children[0] || null,
      selectedChildIndex: 0,
    };
    
    tree.nodes.set(normalizedPath, node);
  }
  
  return node;
}

export function getNode(tree: NavigationTree, path: string): DirectoryNode | undefined {
  return tree.nodes.get(path);
}

// Helper to update a node immutably
function updateNode(
  tree: NavigationTree, 
  path: string, 
  updates: Partial<DirectoryNode>
): DirectoryNode | null {
  const node = tree.nodes.get(path);
  if (!node) return null;
  
  const updatedNode = { ...node, ...updates };
  tree.nodes.set(path, updatedNode);
  return updatedNode;
}

export function addNodeToTree(
  tree: NavigationTree, 
  parentPath: string, 
  dirName: string
): DirectoryNode | null {
  const parent = tree.nodes.get(parentPath);
  if (!parent) return null;
  
  const newPath = join(parentPath, dirName);
  
  // Create directory on filesystem
  try {
    mkdirSync(newPath);
  } catch (error) {
    console.error("Failed to create directory:", error);
    return null;
  }
  
  // Create node
  const newNode: DirectoryNode = {
    dirName,
    dirPath: newPath,
    parentPath,
    childrenPaths: [],
    nextPath: null,
    selectedChildIndex: 0,
  };
  
  tree.nodes.set(newPath, newNode);
  
  // Update parent's children (create new array)
  const newChildrenPaths = [...parent.childrenPaths, newPath].sort();
  updateNode(tree, parentPath, { childrenPaths: newChildrenPaths });
  
  return newNode;
}

export function removeNodeFromTree(tree: NavigationTree, dirPath: string): boolean {
  const node = tree.nodes.get(dirPath);
  if (!node) return false;
  
  // Cannot remove vault root
  if (dirPath === tree.vaultPath) return false;
  
  // Remove from filesystem
  try {
    rmdirSync(dirPath);
  } catch (error) {
    console.error("Failed to remove directory:", error);
    return false;
  }
  
  // Remove from parent
  if (node.parentPath) {
    const parent = tree.nodes.get(node.parentPath);
    if (parent) {
      const index = parent.childrenPaths.indexOf(dirPath);
      if (index >= 0) {
        // Create new array without this child
        const newChildrenPaths = parent.childrenPaths.filter((_, i) => i !== index);
        
        // Adjust selected index
        let newSelectedIndex = parent.selectedChildIndex;
        if (newSelectedIndex > index) {
          newSelectedIndex--;
        } else if (newSelectedIndex >= newChildrenPaths.length) {
          newSelectedIndex = Math.max(0, newChildrenPaths.length - 1);
        }
        
        // Update parent
        updateNode(tree, node.parentPath, {
          childrenPaths: newChildrenPaths,
          selectedChildIndex: newSelectedIndex,
          nextPath: newChildrenPaths[newSelectedIndex] || null,
        });
      }
    }
  }
  
  // Remove node and all descendants from memory
  const removeDescendants = (targetPath: string) => {
    const n = tree.nodes.get(targetPath);
    if (n) {
      for (const childPath of n.childrenPaths) {
        removeDescendants(childPath);
      }
      tree.nodes.delete(targetPath);
    }
  };
  
  removeDescendants(dirPath);
  
  // Update current path if needed
  if (tree.currentPath === dirPath || tree.currentPath.startsWith(dirPath + "/")) {
    tree.currentPath = node.parentPath || tree.vaultPath;
  }
  
  return true;
}

export function renameNodeInTree(
  tree: NavigationTree, 
  oldPath: string, 
  newName: string
): DirectoryNode | null {
  const node = tree.nodes.get(oldPath);
  if (!node) return null;
  
  // Cannot rename vault root
  if (oldPath === tree.vaultPath) return null;
  
  const parentPath = node.parentPath;
  if (!parentPath) return null;
  
  const newPath = join(parentPath, newName);
  
  // Rename on filesystem
  try {
    renameSync(oldPath, newPath);
  } catch (error) {
    console.error("Failed to rename directory:", error);
    return null;
  }
  
  // Update all descendant paths in the tree
  const updateDescendantPaths = (oldP: string, newP: string) => {
    const n = tree.nodes.get(oldP);
    if (!n) return;
    
    // Create new node with updated path
    const updatedNode: DirectoryNode = {
      ...n,
      dirPath: newP,
      dirName: basename(newP),
      childrenPaths: n.childrenPaths.map(childOldPath => {
        const relativePath = childOldPath.slice(oldP.length + 1);
        return join(newP, relativePath);
      }),
    };
    
    tree.nodes.delete(oldP);
    tree.nodes.set(newP, updatedNode);
    
    // Recursively update children
    for (let i = 0; i < n.childrenPaths.length; i++) {
      const childOldPath = n.childrenPaths[i];
      const childNewPath = updatedNode.childrenPaths[i];
      if (childOldPath && childNewPath) {
        updateDescendantPaths(childOldPath, childNewPath);
      }
    }
  };
  
  updateDescendantPaths(oldPath, newPath);
  
  // Update parent's childrenPaths
  const parent = tree.nodes.get(parentPath);
  if (parent) {
    const newChildrenPaths = parent.childrenPaths.map(p => 
      p === oldPath ? newPath : p
    ).sort();
    
    updateNode(tree, parentPath, { childrenPaths: newChildrenPaths });
  }
  
  // Update currentPath if needed
  if (tree.currentPath === oldPath) {
    tree.currentPath = newPath;
  } else if (tree.currentPath.startsWith(oldPath + "/")) {
    tree.currentPath = newPath + tree.currentPath.slice(oldPath.length);
  }
  
  return tree.nodes.get(newPath) || null;
}

export function navigateToChildNode(
  tree: NavigationTree, 
  childName?: string
): DirectoryNode | null {
  const current = tree.nodes.get(tree.currentPath);
  if (!current) {
    return null;
  }
  
  let targetPath: string | null = null;
  
  if (childName) {
    // Navigate to specific child by name
    targetPath = current.childrenPaths.find(path => basename(path) === childName) || null;
  } else if (current.nextPath && current.childrenPaths.includes(current.nextPath)) {
    // Navigate to last visited child (nextPath)
    targetPath = current.nextPath;
  } else {
    // Navigate to first child
    targetPath = current.childrenPaths[0] || null;
  }
  
  if (!targetPath) {
    return null;
  }
  
  // Lazy load the child node if not already loaded
  const childNode = ensureNodeLoaded(tree, targetPath);
  if (!childNode) {
    return null;
  }
  
  // Update tree current path (use normalized path)
  tree.currentPath = childNode.dirPath;
  
  return childNode;
}

export function navigateToParentNode(tree: NavigationTree): DirectoryNode | null {
  const current = tree.nodes.get(tree.currentPath);
  if (!current || !current.parentPath) return null;
  
  const parent = tree.nodes.get(current.parentPath);
  if (!parent) return null;
  
  // Update parent's nextPath to point back to this child
  // This ensures when pressing 'l' from parent, it goes to the last visited child
  updateNode(tree, current.parentPath, {
    nextPath: tree.currentPath,
    selectedChildIndex: parent.childrenPaths.indexOf(tree.currentPath),
  });
  
  tree.currentPath = current.parentPath;
  return tree.nodes.get(current.parentPath) || null;
}

export function selectChildNode(tree: NavigationTree, index: number): boolean {
  const current = tree.nodes.get(tree.currentPath);
  if (!current) return false;
  
  // Adjust for "go back" option
  const adjustedIndex = current.parentPath ? index - 1 : index;
  
  if (adjustedIndex < 0 || adjustedIndex >= current.childrenPaths.length) return false;
  
  const nextPath = current.childrenPaths[adjustedIndex];
  updateNode(tree, tree.currentPath, {
    selectedChildIndex: adjustedIndex,
    nextPath: nextPath ?? null,
  });
  
  return true;
}

export function nodesToOptions(tree: NavigationTree, currentPath: string): SelectOption[] {
  const current = tree.nodes.get(currentPath);
  if (!current) return [];
  
  const options: SelectOption[] = [];
  
  // Add "go back" option if not at vault root
  if (current.parentPath) {
    options.push({
      name: "Press '-' to go back...",
      value: current.parentPath,
      description: "Parent directory",
    });
  }
  
  // Add children
  for (const childPath of current.childrenPaths) {
    const child = tree.nodes.get(childPath);
    if (child) {
      options.push({
        name: child.dirName,
        value: child.dirPath,
        description: `Directory in ${current.dirName}`,
      });
    } else {
      // Child not loaded yet, create a placeholder
      options.push({
        name: basename(childPath),
        value: childPath,
        description: `Directory in ${current.dirName}`,
      });
    }
  }
  
  return options;
}

export function getSelectedIndex(tree: NavigationTree, currentPath: string): number {
  const current = tree.nodes.get(currentPath);
  if (!current) return 0;
  
  // Account for "go back" option at index 0
  return current.parentPath ? current.selectedChildIndex + 1 : current.selectedChildIndex;
}
