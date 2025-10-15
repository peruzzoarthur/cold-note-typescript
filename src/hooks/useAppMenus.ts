import { createContext, useContext } from 'react';

interface AppMenusContextType {
  // Config menu
  isConfigMenuOpen: boolean;
  openConfigMenu: () => void;
  closeConfigMenu: () => void;
  toggleConfigMenu: () => void;
  
  // Debug menu
  isDebugMenuOpen: boolean;
  openDebugMenu: () => void;
  closeDebugMenu: () => void;
  toggleDebugMenu: () => void;
  addDebugLog: (message: string) => void;
  debugLogs: string[];
  
  // Focus management
  setActiveTabFocusRef: (ref: React.RefObject<any>) => void;
  restoreFocus: () => void;
}

const AppMenusContext = createContext<AppMenusContextType | undefined>(undefined);

export const useAppMenus = () => {
  const context = useContext(AppMenusContext);
  if (!context) {
    throw new Error('useAppMenus must be used within an AppMenusProvider');
  }
  return context;
};

export const AppMenusContext_Export = AppMenusContext;