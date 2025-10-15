import { useState, ReactNode, useCallback, useRef } from 'react';
import { AppMenusContext_Export } from '../hooks/useAppMenus';

interface AppMenusProviderProps {
  children: ReactNode;
}

export const AppMenusProvider = ({ children }: AppMenusProviderProps) => {
  const [isConfigMenuOpen, setIsConfigMenuOpen] = useState(false);
  const [isDebugMenuOpen, setIsDebugMenuOpen] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const activeTabFocusRef = useRef<React.RefObject<any> | null>(null);

  const openConfigMenu = useCallback(() => setIsConfigMenuOpen(true), []);
  const closeConfigMenu = useCallback(() => {
    setIsConfigMenuOpen(false);
    // Restore focus after a brief delay to ensure menu is closed
    setTimeout(() => {
      if (activeTabFocusRef.current?.current?.focus) {
        activeTabFocusRef.current.current.focus();
      }
    }, 50);
  }, []);
  const toggleConfigMenu = useCallback(() => setIsConfigMenuOpen(prev => !prev), []);

  const openDebugMenu = useCallback(() => setIsDebugMenuOpen(true), []);
  const closeDebugMenu = useCallback(() => {
    setIsDebugMenuOpen(false);
    // Restore focus after a brief delay to ensure menu is closed
    setTimeout(() => {
      if (activeTabFocusRef.current?.current?.focus) {
        activeTabFocusRef.current.current.focus();
      }
    }, 50);
  }, []);
  const toggleDebugMenu = useCallback(() => setIsDebugMenuOpen(prev => !prev), []);

  const addDebugLog = useCallback((message: string) => {
    setDebugLogs(prev => [...prev.slice(-19), `${new Date().toLocaleTimeString()}: ${message}`]);
  }, []);

  const setActiveTabFocusRef = useCallback((ref: React.RefObject<any>) => {
    activeTabFocusRef.current = ref;
  }, []);

  const restoreFocus = useCallback(() => {
    if (activeTabFocusRef.current?.current?.focus) {
      activeTabFocusRef.current.current.focus();
    }
  }, []);

  const value = {
    isConfigMenuOpen,
    openConfigMenu,
    closeConfigMenu,
    toggleConfigMenu,
    isDebugMenuOpen,
    openDebugMenu,
    closeDebugMenu,
    toggleDebugMenu,
    addDebugLog,
    debugLogs,
    setActiveTabFocusRef,
    restoreFocus
  };

  return (
    <AppMenusContext_Export.Provider value={value}>
      {children}
    </AppMenusContext_Export.Provider>
  );
};