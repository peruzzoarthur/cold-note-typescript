import type { KeyEvent } from "@opentui/core";

export const useNavigateDir = (
  setPath: React.Dispatch<React.SetStateAction<string | undefined>>,
  rootPath?: string,
) => {
  const handleNavigateDir = (key: KeyEvent, name: string): void => {
    if (key.name === "o") {
      setPath(name);
    }

    if (key.name === "-" && name !== rootPath) {
      const pathParts = name.split('/').filter(Boolean);
      pathParts.pop(); 
      const parentPath = '/' + pathParts.join('/');
      setPath(parentPath);
    }
  };

  return { handleNavigateDir };
};
