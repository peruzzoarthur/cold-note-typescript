# Yazi-Style Navigation Tree Implementation

This implementation provides a persistent directory tree structure that mimics yazi's navigation behavior.

## Architecture

### DirectoryNode Structure
Each directory in the vault is represented as a node with:
```typescript
interface DirectoryNode {
  dirName: string;              // Display name (e.g., "notes", "projects")
  dirPath: string;              // Full absolute path
  parentPath: string | null;    // Parent directory path (null for vault root)
  childrenPaths: string[];      // Paths to all child directories
  nextPath: string | null;      // Last visited child path (for persistence)
  selectedChildIndex: number;   // Currently selected child index
}
```

### NavigationTree
```typescript
interface NavigationTree {
  nodes: Map<string, DirectoryNode>;  // All directory nodes indexed by path
  vaultPath: string;                  // Root vault path
  currentPath: string;                // Current navigation position
}
```

## Key Features

1. **Persistent Selection**: When you navigate deep into a directory tree, go back, then navigate elsewhere, the tree remembers which child you had selected at each level.

2. **Fast Navigation**: The entire tree is built upfront when the app starts. No filesystem reads during navigation (except for tree updates).

3. **Session Memory**: The `nextPath` field remembers which child you last entered from each directory, so pressing 'l' twice navigates deeper without manual selection.

4. **Tree Updates**: When directories are created, deleted, or renamed through the app, the tree is automatically updated to reflect changes.

5. **Vault Root**: The vault root has `parentPath: null` and cannot be navigated past or deleted.

## Usage Example

```typescript
// In DirSelect component
const { 
  tree, 
  currentNode, 
  options,
  navigateToChild, 
  navigateToParent,
  selectChild 
} = useYaziNavigation({ vaultPath: '/home/user/vault' });

// Navigate to selected child (uses selectedChildIndex)
navigateToChild();  // Press 'l'

// Navigate to specific child by name
navigateToChild('projects');  // Press 'l' with specific target

// Navigate to parent
navigateToParent();  // Press 'h' or '-'

// Select a different child (doesn't navigate, just changes selection)
selectChild(2);  // Use arrow keys/j/k to move selection

// Options for the select component
console.log(options);  // Includes "go back" + children
```

## Navigation Flow

```
Initial State:
Vault Root (/home/user/vault)
├── notes/           <- selectedChildIndex: 0
├── projects/        <- selectedChildIndex: 1 (let's say user selected this)
└── archive/         <- selectedChildIndex: 2

User presses 'l':
1. navigateToChild() called
2. Moves to projects node
3. projects.nextPath remembers where to go
4. currentPath updated to /home/user/vault/projects

User presses 'l' again:
1. navigateToChild() called again
2. If projects has children, navigates to the selected one
3. Selection persists based on selectedChildIndex

User presses 'h':
1. navigateToParent() called
2. Updates parent's nextPath to point to the child we came from
3. Updates parent's selectedChildIndex to match
4. Returns to vault root
5. projects is now the "nextPath" 
6. Pressing 'l' again goes back to projects

## nextPath Behavior

The `nextPath` field is crucial for yazi-style navigation:

1. **When navigating down** (`navigateToChild`): 
   - Parent's `nextPath` is set to the child we're entering
   - This remembers "where we were going"

2. **When navigating up** (`navigateToParent`):
   - Parent's `nextPath` is set to the child we just came from
   - This remembers "where we came from"

3. **Navigation priority**:
   - If `nextPath` exists and is valid, use it first
   - Otherwise fall back to `selectedChildIndex`
   - This ensures smooth bidirectional navigation

Example:
```
A (vault root)
├── B
│   └── C
└── D

Navigate: A → B → C (nextPath of B is now C)
Navigate: C → B (press 'h')
          B's parent (A) updates nextPath to B
Navigate: B → C (press 'l', uses B's nextPath which is C)
Navigate: C → B → A (press 'h' twice)
Navigate: A → B (press 'l', uses A's nextPath which is B)
```
```

## Tree Operations

### Directory Creation
```typescript
addDirectory('/home/user/vault', 'new-folder');
// - Creates directory on filesystem
// - Adds node to tree
// - Updates parent's childrenPaths
// - Adjusts selection index if needed
```

### Directory Deletion
```typescript
removeDirectory('/home/user/vault/old-folder');
// - Removes from filesystem
// - Removes node and all descendants from tree
// - Updates parent's childrenPaths
// - Adjusts selection index
// - Updates currentPath if needed
```

### Directory Rename
```typescript
renameDirectory('/home/user/vault/old-name', 'new-name');
// - Renames on filesystem
// - Updates node path
// - Updates all descendant paths
// - Updates parent's childrenPaths
// - Updates currentPath references
```

## Integration with DirSelect

The `useYaziNavigation` hook replaces the old navigation hooks:
- `useDirSelection` → Replaced by tree state
- `useSetVaultPath` → Replaced by tree builder
- `useNavigateDir` → Replaced by navigateToChild/navigateToParent
- `useSelectSync` → Selection managed by tree

The DirSelect component now uses:
1. `useYaziNavigation` to manage the tree
2. `options` from the hook for the select component
3. `navigateToChild/Parent` for 'l'/'h' key handlers
4. `selectChild` for arrow key navigation

## Benefits Over Previous Implementation

1. **No State Desync**: Previous implementation had bugs where `currentOption` didn't update when options changed
2. **Persistent Navigation**: Tree remembers your position at every level
3. **Efficient**: Built once, no repeated filesystem calls
4. **Robust**: Handles directory CRUD operations gracefully
5. **Yazi-Style UX**: Matches familiar file manager behavior
