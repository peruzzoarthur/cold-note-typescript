import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { runMigrations, TagRepository } from "../database";

interface NoteData {
  noteName: string | null;
  dirPath: string | null;
  templatePath: string | null;
  selectedTags: string[];
  aliases: string | null;
}

interface NoteContextType {
  noteData: NoteData;
  setNoteName: (name: string | null) => void;
  setDirPath: (path: string | null) => void;
  setTemplatePath: (path: string | null) => void;
  setSelectedTags: (tags: string[]) => void;
  setAliases: (aliases: string | null) => void;
  tagRepository: TagRepository | null;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNoteContext must be used within a NoteProvider");
  }
  return context;
};

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider = ({ children }: NoteProviderProps) => {
  const [noteData, setNoteData] = useState<NoteData>({
    noteName: null,
    dirPath: null,
    templatePath: null,
    selectedTags: [],
    aliases: null,
  });

  const [tagRepository, setTagRepository] = useState<TagRepository | null>(null);

  useEffect(() => {
    try {
      runMigrations();
      setTagRepository(new TagRepository());
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  }, []);

  const setNoteName = (name: string | null) => {
    setNoteData(prev => ({ ...prev, noteName: name }));
  };

  const setDirPath = (path: string | null) => {
    setNoteData(prev => ({ ...prev, dirPath: path }));
  };

  const setTemplatePath = (path: string | null) => {
    setNoteData(prev => ({ ...prev, templatePath: path }));
  };

  const setSelectedTags = (tags: string[]) => {
    setNoteData(prev => ({ ...prev, selectedTags: tags }));
  };

  const setAliases = (aliases: string | null) => {
    setNoteData(prev => ({ ...prev, aliases }));
  };


  return (
    <NoteContext.Provider
      value={{
        noteData,
        setNoteName,
        setDirPath,
        setTemplatePath,
        setSelectedTags,
        setAliases,
        tagRepository,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
