import { createContext, useContext, useState, type ReactNode } from "react";

export type ModalType = "createDir" | "deleteDir" | "renameDir" | "config" | "debug" | null;

type ModalContextType = {
  openModal: ModalType;
  isAnyModalOpen: boolean;
  isCreateDirModalOpen: boolean;
  isDeleteDirModalOpen: boolean;
  isRenameDirModalOpen: boolean;
  isConfigModalOpen: boolean;
  isDebugModalOpen: boolean;
  openCreateDirModal: () => void;
  openDeleteDirModal: () => void;
  openRenameDirModal: () => void;
  openConfigModal: () => void;
  openDebugModal: () => void;
  closeModal: () => void;
  closeCreateDirModal: () => void;
  closeDeleteDirModal: () => void;
  closeRenameDirModal: () => void;
  closeConfigModal: () => void;
  closeDebugModal: () => void;
  createDirCallback: ((dirName: string) => void) | null;
  setCreateDirCallback: (callback: (dirName: string) => void) => void;
  deleteDirCallback: (() => void) | null;
  setDeleteDirCallback: (callback: () => void) => void;
  deleteDirName: string | null;
  setDeleteDirName: (name: string) => void;
  renameDirCallback: ((newName: string) => void) | null;
  setRenameDirCallback: (callback: (newName: string) => void) => void;
  renameDirOldName: string | null;
  setRenameDirOldName: (name: string) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [openModal, setOpenModal] = useState<ModalType>(null);
  const [createDirCallback, setCreateDirCallback] = useState<
    ((dirName: string) => void) | null
  >(null);
  const [deleteDirCallback, setDeleteDirCallback] = useState<
    (() => void) | null
  >(null);
  const [deleteDirName, setDeleteDirName] = useState<string | null>(null);
  const [renameDirCallback, setRenameDirCallback] = useState<
    ((newName: string) => void) | null
  >(null);
  const [renameDirOldName, setRenameDirOldName] = useState<string | null>(null);

  const isAnyModalOpen = openModal !== null;
  const isCreateDirModalOpen = openModal === "createDir";
  const isDeleteDirModalOpen = openModal === "deleteDir";
  const isRenameDirModalOpen = openModal === "renameDir";
  const isConfigModalOpen = openModal === "config";
  const isDebugModalOpen = openModal === "debug";

  const openCreateDirModal = () => setOpenModal("createDir");
  const openDeleteDirModal = () => setOpenModal("deleteDir");
  const openRenameDirModal = () => setOpenModal("renameDir");
  const openConfigModal = () => setOpenModal("config");
  const openDebugModal = () => setOpenModal("debug");

  const closeModal = () => {
    setOpenModal(null);
    setCreateDirCallback(null);
    setDeleteDirCallback(null);
    setDeleteDirName(null);
    setRenameDirCallback(null);
    setRenameDirOldName(null);
  };

  const closeCreateDirModal = closeModal;
  const closeDeleteDirModal = closeModal;
  const closeRenameDirModal = closeModal;
  const closeConfigModal = closeModal;
  const closeDebugModal = closeModal;

  return (
    <ModalContext.Provider
      value={{
        openModal,
        isAnyModalOpen,
        isCreateDirModalOpen,
        isDeleteDirModalOpen,
        isRenameDirModalOpen,
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
        openDeleteDirModal,
        closeDeleteDirModal,
        deleteDirCallback,
        setDeleteDirCallback,
        deleteDirName,
        setDeleteDirName,
        openRenameDirModal,
        closeRenameDirModal,
        renameDirCallback,
        setRenameDirCallback,
        renameDirOldName,
        setRenameDirOldName,
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
