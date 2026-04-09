import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import type { KeyEvent } from '@opentui/core';
import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export type ModalType = 'createDir' | 'deleteDir' | 'renameDir' | 'noteExists' | null;

type GlobalKeyHandler = (key: KeyEvent) => boolean;

interface ModalCallbacks {
  createDir: ((name: string) => void) | null;
  deleteDir: (() => void) | null;
  renameDir: ((name: string) => void) | null;
  noteExists: (() => void) | null;
}

interface ModalData {
  deleteDirName: string | null;
  renameDirOldName: string | null;
  noteExistsName: string | null;
}

interface AppState {
  // UI State
  ui: {
    isConfigOpen: boolean;
    isDebugOpen: boolean;
    debugLogs: string[];
    activeModal: ModalType;
    activeTab: number;
  };
  // Modal callbacks (ephemeral)
  modalCallbacks: ModalCallbacks;
  modalData: ModalData;
}

interface AppStateContextType {
  // UI State
  ui: AppState['ui'];
  modalCallbacks: ModalCallbacks;
  modalData: ModalData;
  
  // UI Actions
  openConfig: () => void;
  closeConfig: () => void;
  toggleConfig: () => void;
  openDebug: () => void;
  closeDebug: () => void;
  toggleDebug: () => void;
  addDebugLog: (message: string) => void;
  setActiveTab: (tab: number) => void;
  
  // Modal Actions
  openModal: (type: Exclude<ModalType, null>) => void;
  closeModal: () => void;
  setModalCallback: <K extends keyof ModalCallbacks>(
    type: K,
    callback: ModalCallbacks[K]
  ) => void;
  setModalData: <K extends keyof ModalData>(
    key: K,
    value: ModalData[K]
  ) => void;
  
  // Focus Management
  setActiveTabFocusRef: (ref: React.RefObject<any>) => void;
  restoreFocus: () => void;
  
  // Global Keyboard
  registerGlobalHandler: (handler: GlobalKeyHandler) => void;
  handleGlobalKey: (key: KeyEvent) => boolean;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

// Backward-compatible hooks
export const useAppMenus = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppMenus must be used within an AppStateProvider');
  }
  
  return {
    isConfigMenuOpen: context.ui.isConfigOpen,
    openConfigMenu: context.openConfig,
    closeConfigMenu: context.closeConfig,
    toggleConfigMenu: context.toggleConfig,
    isDebugMenuOpen: context.ui.isDebugOpen,
    openDebugMenu: context.openDebug,
    closeDebugMenu: context.closeDebug,
    toggleDebugMenu: context.toggleDebug,
    addDebugLog: context.addDebugLog,
    debugLogs: context.ui.debugLogs,
    setActiveTabFocusRef: context.setActiveTabFocusRef,
    restoreFocus: context.restoreFocus,
  };
};

export const useModal = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useModal must be used within an AppStateProvider');
  }
  
  const { ui, modalCallbacks, modalData, openModal, closeModal, setModalCallback, setModalData } = context;
  
  return {
    openModal: ui.activeModal,
    isAnyModalOpen: ui.activeModal !== null,
    isCreateDirModalOpen: ui.activeModal === 'createDir',
    isDeleteDirModalOpen: ui.activeModal === 'deleteDir',
    isRenameDirModalOpen: ui.activeModal === 'renameDir',
    isNoteExistsModalOpen: ui.activeModal === 'noteExists',
    openCreateDirModal: () => openModal('createDir'),
    openDeleteDirModal: () => openModal('deleteDir'),
    openRenameDirModal: () => openModal('renameDir'),
    openNoteExistsModal: () => openModal('noteExists'),
    closeModal,
    closeCreateDirModal: closeModal,
    closeDeleteDirModal: closeModal,
    closeRenameDirModal: closeModal,
    closeNoteExistsModal: closeModal,
    createDirCallback: modalCallbacks.createDir,
    setCreateDirCallback: (callback: ((dirName: string) => void)) => setModalCallback('createDir', callback),
    deleteDirCallback: modalCallbacks.deleteDir,
    setDeleteDirCallback: (callback: () => void) => setModalCallback('deleteDir', callback),
    deleteDirName: modalData.deleteDirName,
    setDeleteDirName: (name: string) => setModalData('deleteDirName', name),
    renameDirCallback: modalCallbacks.renameDir,
    setRenameDirCallback: (callback: ((newName: string) => void)) => setModalCallback('renameDir', callback),
    renameDirOldName: modalData.renameDirOldName,
    setRenameDirOldName: (name: string) => setModalData('renameDirOldName', name),
    noteExistsCallback: modalCallbacks.noteExists,
    setNoteExistsCallback: (callback: () => void) => setModalCallback('noteExists', callback),
    noteExistsName: modalData.noteExistsName,
    setNoteExistsName: (name: string) => setModalData('noteExistsName', name),
  };
};

export const useGlobalKeyboard = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useGlobalKeyboard must be used within an AppStateProvider');
  }
  
  return {
    registerGlobalHandler: context.registerGlobalHandler,
    handleGlobalKey: context.handleGlobalKey,
  };
};

interface AppStateProviderProps {
  children: ReactNode;
}

export const AppStateProvider = ({ children }: AppStateProviderProps) => {
  // UI State
  const [ui, setUi] = useState<AppState['ui']>({
    isConfigOpen: false,
    isDebugOpen: false,
    debugLogs: [],
    activeModal: null,
    activeTab: 0,
  });
  
  // Modal callbacks
  const [modalCallbacks, setModalCallbacks] = useState<ModalCallbacks>({
    createDir: null,
    deleteDir: null,
    renameDir: null,
    noteExists: null,
  });
  
  // Modal data
  const [modalData, setModalDataState] = useState<ModalData>({
    deleteDirName: null,
    renameDirOldName: null,
    noteExistsName: null,
  });
  
  // Global keyboard handler
  const [globalHandler, setGlobalHandler] = useState<GlobalKeyHandler | null>(null);
  
  // Focus management refs
  const activeTabFocusRef = useRef<React.RefObject<any> | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // UI Actions
  const openConfig = useCallback(() => {
    setUi(prev => ({ ...prev, isConfigOpen: true }));
  }, []);
  
  const closeConfig = useCallback(() => {
    setUi(prev => ({ ...prev, isConfigOpen: false }));
    timeoutRef.current = setTimeout(() => {
      if (activeTabFocusRef.current?.current?.focus) {
        activeTabFocusRef.current.current.focus();
      }
    }, 50);
  }, []);
  
  const toggleConfig = useCallback(() => {
    setUi(prev => {
      if (!prev.isConfigOpen) {
        return { ...prev, isConfigOpen: true };
      } else {
        timeoutRef.current = setTimeout(() => {
          if (activeTabFocusRef.current?.current?.focus) {
            activeTabFocusRef.current.current.focus();
          }
        }, 50);
        return { ...prev, isConfigOpen: false };
      }
    });
  }, []);
  
  const openDebug = useCallback(() => {
    setUi(prev => ({ ...prev, isDebugOpen: true }));
  }, []);
  
  const closeDebug = useCallback(() => {
    setUi(prev => ({ ...prev, isDebugOpen: false }));
    timeoutRef.current = setTimeout(() => {
      if (activeTabFocusRef.current?.current?.focus) {
        activeTabFocusRef.current.current.focus();
      }
    }, 50);
  }, []);
  
  const toggleDebug = useCallback(() => {
    setUi(prev => {
      if (!prev.isDebugOpen) {
        return { ...prev, isDebugOpen: true };
      } else {
        timeoutRef.current = setTimeout(() => {
          if (activeTabFocusRef.current?.current?.focus) {
            activeTabFocusRef.current.current.focus();
          }
        }, 50);
        return { ...prev, isDebugOpen: false };
      }
    });
  }, []);
  
  const addDebugLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `${timestamp}: ${message}`;
    
    // Update UI state
    setUi(prev => ({
      ...prev,
      debugLogs: [...prev.debugLogs.slice(-19), logEntry]
    }));
    
    // Also write to markdown file
    try {
      const logDir = join(process.cwd(), 'logs');
      if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true });
      }
      const logFile = join(logDir, 'debug.md');
      const date = new Date().toISOString().split('T')[0];
      const entry = `- **${timestamp}** - ${message}\n`;
      appendFileSync(logFile, entry);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }, []);
  
  const setActiveTab = useCallback((tab: number) => {
    setUi(prev => ({ ...prev, activeTab: tab }));
  }, []);
  
  // Modal Actions
  const openModal = useCallback((type: Exclude<ModalType, null>) => {
    setUi(prev => ({ ...prev, activeModal: type }));
  }, []);
  
  const closeModal = useCallback(() => {
    setUi(prev => ({ ...prev, activeModal: null }));
    setModalCallbacks({
      createDir: null,
      deleteDir: null,
      renameDir: null,
      noteExists: null,
    });
    setModalDataState({
      deleteDirName: null,
      renameDirOldName: null,
      noteExistsName: null,
    });
  }, []);
  
  const setModalCallback = useCallback(<K extends keyof ModalCallbacks>(
    type: K,
    callback: ModalCallbacks[K]
  ) => {
    setModalCallbacks(prev => ({ ...prev, [type]: callback }));
  }, []);
  
  const setModalData = useCallback(<K extends keyof ModalData>(
    key: K,
    value: ModalData[K]
  ) => {
    setModalDataState(prev => ({ ...prev, [key]: value }));
  }, []);
  
  // Focus Management
  const setActiveTabFocusRef = useCallback((ref: React.RefObject<any>) => {
    activeTabFocusRef.current = ref;
  }, []);
  
  const restoreFocus = useCallback(() => {
    if (activeTabFocusRef.current?.current?.focus) {
      activeTabFocusRef.current.current.focus();
    }
  }, []);
  
  // Global Keyboard
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
  
  const value: AppStateContextType = {
    ui,
    modalCallbacks,
    modalData,
    openConfig,
    closeConfig,
    toggleConfig,
    openDebug,
    closeDebug,
    toggleDebug,
    addDebugLog,
    setActiveTab,
    openModal,
    closeModal,
    setModalCallback,
    setModalData,
    setActiveTabFocusRef,
    restoreFocus,
    registerGlobalHandler,
    handleGlobalKey,
  };
  
  return (
    <AppStateContext.Provider value={value}>
      <box onKeyDown={handleRootKeyDown} style={{ flexGrow: 1 }}>
        {children}
      </box>
    </AppStateContext.Provider>
  );
};

// Re-export types for convenience
export type { GlobalKeyHandler };
