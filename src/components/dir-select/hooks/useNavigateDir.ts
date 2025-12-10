import type { KeyEvent } from "@opentui/core";

export const useNavigateDir = (
  setPath: React.Dispatch<React.SetStateAction<string | undefined>>,
  rootPath?: string,
) => {
  const handleNavigateDir = (key: KeyEvent, name: string): void => {
    if (key.name === "o" || key.name === "l") {
      setPath(name);
    }

    if ((key.name === "-" || key.name === "h") && name !== rootPath) {
      const pathParts = name.split('/').filter(Boolean);
      pathParts.pop();
      const parentPath = '/' + pathParts.join('/');
      setPath(parentPath);
    }
  };

  return { handleNavigateDir };
};
