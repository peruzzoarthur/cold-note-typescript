import React, { createContext, useContext, useState, ReactNode } from "react";

export type ModalType = "createDir" | "config" | "debug" | null;

type ModalContextType = {
  openModal: ModalType;
  isAnyModalOpen: boolean;
  isCreateDirModalOpen: boolean;
  isConfigModalOpen: boolean;
  isDebugModalOpen: boolean;
  openCreateDirModal: () => void;
  openConfigModal: () => void;
  openDebugModal: () => void;
  closeModal: () => void;
  closeCreateDirModal: () => void;
  closeConfigModal: () => void;
  closeDebugModal: () => void;
  createDirCallback: ((dirName: string) => void) | null;
  setCreateDirCallback: (callback: (dirName: string) => void) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [createDirCallback, setCreateDirCallback] = useState<
    ((dirName: string) => void) | null
  >(null);

  const isAnyModalOpen = openModal !== null;
  const isCreateDirModalOpen = openModal === "createDir";
  const isConfigModalOpen = openModal === "config";
  const isDebugModalOpen = openModal === "debug";

  const openCreateDirModal = () => setOpenModal("createDir");
  const openConfigModal = () => setOpenModal("config");
  const openDebugModal = () => setOpenModal("debug");

  const closeModal = () => {
    setOpenModal(null);
    setCreateDirCallback(null);
  };

  const closeCreateDirModal = closeModal;
  const closeConfigModal = closeModal;
  const closeDebugModal = closeModal;

  return (
    <ModalContext.Provider
      value={{
        openModal,
        isAnyModalOpen,
        isCreateDirModalOpen,
        isConfigModalOpen,
        isDebugModalOpen,
        openCreateDirModal,
        openConfigModal,
        openDebugModal,
        closeModal,
        closeCreateDirModal,
        closeConfigModal,
        closeDebugModal,
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
