import { createContext, useContext, type ReactNode, useCallback, useState } from 'react';
import type { KeyEvent } from '@opentui/core';

type GlobalKeyHandler = (key: KeyEvent) => boolean; 

interface GlobalKeyboardContextType {
  registerGlobalHandler: (handler: GlobalKeyHandler) => void;
  handleGlobalKey: (key: KeyEvent) => boolean;
}

const GlobalKeyboardContext = createContext<GlobalKeyboardContextType | undefined>(undefined);

export const useGlobalKeyboard = () => {
  const context = useContext(GlobalKeyboardContext);
  if (!context) {
    throw new Error('useGlobalKeyboard must be used within a GlobalKeyboardProvider');
  }
  return context;
};

export const GlobalKeyboardProvider = ({ children }: { children: ReactNode }) => {
  const [globalHandler, setGlobalHandler] = useState<GlobalKeyHandler | null>(null);

  const registerGlobalHandler = useCallback((handler: GlobalKeyHandler) => {
    setGlobalHandler(() => handler);
  }, []);

  const handleGlobalKey = useCallback((key: KeyEvent): boolean => {
    if (globalHandler) {
      return globalHandler(key);
    }
    return false;
  }, [globalHandler]);

  const handleRootKeyDown = useCallback((key: KeyEvent) => {
    handleGlobalKey(key);
  }, [handleGlobalKey]);

  return (
    <GlobalKeyboardContext.Provider value={{ registerGlobalHandler, handleGlobalKey }}>
      <box onKeyDown={handleRootKeyDown} style={{ flexGrow: 1 }}>
        {children}
      </box>
    </GlobalKeyboardContext.Provider>
  );
};
