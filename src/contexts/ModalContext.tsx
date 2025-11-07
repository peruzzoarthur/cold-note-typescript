import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalContextType = {
  isCreateDirModalOpen: boolean;
  openCreateDirModal: () => void;
  closeCreateDirModal: () => void;
  createDirCallback: ((dirName: string) => void) | null;
  setCreateDirCallback: (callback: (dirName: string) => void) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isCreateDirModalOpen, setIsCreateDirModalOpen] = useState(false);
  const [createDirCallback, setCreateDirCallback] = useState<
    ((dirName: string) => void) | null
  >(null);

  const openCreateDirModal = () => setIsCreateDirModalOpen(true);
  const closeCreateDirModal = () => {
    setIsCreateDirModalOpen(false);
    setCreateDirCallback(null);
  };

  return (
    <ModalContext.Provider
      value={{
        isCreateDirModalOpen,
        openCreateDirModal,
        closeCreateDirModal,
        createDirCallback,
        setCreateDirCallback,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
