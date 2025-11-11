import { TextAttributes } from "@opentui/core";
import "../ui/create-button";
import { useNoteContext } from "../../contexts/NoteContext";
import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { writeFile, readFile, access } from "fs/promises";
import { join } from "path";
import { constants } from "fs";
import { useAppMenus } from "../../hooks/useAppMenus";
import { useOpenNote } from "./open-note";
import { useModal } from "../../contexts/ModalContext";

type CreateNoteProps = {
  isWideScreen?: boolean;
  focused?: boolean;
};

export const CreateNote = ({ isWideScreen, focused }: CreateNoteProps) => {
  const { noteData } = useNoteContext();
  const [activeButton, setActiveButton] = useState<number>(0); // 0 for create, 1 for cancel
  const { addDebugLog } = useAppMenus();
  const openNote = useOpenNote();
  const {
    isNoteExistsModalOpen,
    openNoteExistsModal,
    closeNoteExistsModal,
    setNoteExistsCallback,
    setNoteExistsName,
  } = useModal();

  const createAndOpenNote = async () => {
    const fileName = noteData.noteName
      ? `${noteData.noteName}.md`
      : "untitled.md";
    const dirPath = noteData.dirPath || process.cwd();
    const fullPath = join(dirPath, fileName);

    // Check if file already exists
    try {
      await access(fullPath, constants.F_OK);
      // File exists, show modal
      setNoteExistsName(fileName);
      setNoteExistsCallback(() => async () => {
        await openNote({ fullPath, dirPath });
      });
      openNoteExistsModal();
      return;
    } catch {
      // File doesn't exist, continue with creation
    }

    let content = "";
    if (noteData.templatePath) {
      try {
        content = await readFile(noteData.templatePath, "utf-8");
        addDebugLog(`content: ${content}`);

        const formatDate = (date: Date, format: string): string => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");

          return format
            .replace("YYYY", String(year))
            .replace("MM", month)
            .replace("DD", day);
        };

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const yamlTags = noteData.selectedTags.length > 0
          ? noteData.selectedTags.map((tag) => `  - ${tag}`).join("\n")
          : "  []";

        const markdownTags = noteData.selectedTags.map((tag) => `#${tag}`).join(" ");

        const aliasesArray = noteData.aliases
          ? noteData.aliases.split(",").map(a => a.trim()).filter(a => a.length > 0)
          : [];

        const yamlAliases = aliasesArray.length > 0
          ? aliasesArray.map((alias) => `  - ${alias}`).join("\n")
          : "  []";

        content = content
          .replace(/{{title}}/g, noteData.noteName || "Untitled")
          .replace(/{{date}}/g, new Date().toISOString())
          .replace(/{{datetime}}/g, new Date().toISOString())
          .replace(/{{date:([\w-]+)}}/g, (match, format) =>
            formatDate(today, format),
          )
          .replace(/{{yesterday:([\w-]+)}}/g, (match, format) =>
            formatDate(yesterday, format),
          )
          .replace(/{{tomorrow:([\w-]+)}}/g, (match, format) =>
            formatDate(tomorrow, format),
          )
          .replace(/{{tags:yaml}}/g, yamlTags)
          .replace(/{{tags}}/g, markdownTags)
          .replace(/{{aliases:yaml}}/g, yamlAliases)
          .replace(/{{aliases}}/g, noteData.aliases ?? "");
      } catch (templateError) {
        console.error("Failed to read template:", templateError);
        content = `# ${noteData.noteName || "Untitled"}\n\n`;
      }
    } else {
      content = `# ${noteData.noteName || "Untitled"}\n\n`;
      if (noteData.selectedTags.length > 0) {
        content += `Tags: ${noteData.selectedTags.map((tag) => `#${tag}`).join(" ")}\n\n`;
      }
    }

    await writeFile(fullPath, content);

    await openNote({ fullPath, dirPath });
  };

  useKeyboard((key) => {
    if (!focused || isNoteExistsModalOpen) return; // Don't handle keys when not focused or modal is open

    if (key.name === "h" || key.name === "left") {
      setActiveButton(0);
    } else if (key.name === "l" || key.name === "right") {
      setActiveButton(1);
    } else if (key.name === "return" || key.name === "enter") {
      if (activeButton === 0) {
        createAndOpenNote();
      } else {
        console.log("Cancel button activated!");
      }
    } else if (key.name === "space") {
      if (!isWideScreen) {
        if (activeButton === 0) {
          createAndOpenNote();
        } else {
          console.log("Cancel button activated!");
        }
      }
    }
  });

  if (isWideScreen) {
    return (
      <>
        <box
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 1,
            paddingRight: 1,
          }}
        >
          <createButton
            label="Create note"
            focused={activeButton === 0}
            width={24}
            backgroundColor={focused ? "#A6E3A2" : "#5A5A6A"}
          />
        </box>
      </>
    );
  }

  return (
    <>
      <box
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <box
          style={{
            border: true,
            width: 60,
            height: 10,
            marginTop: 1,
            flexGrow: 1,
          }}
        >
          <text>
            <strong>Note Creation Context</strong>
          </text>
          <text attributes={TextAttributes.DIM}>
            {`- noteName: ${noteData.noteName}`}
          </text>
          <text attributes={TextAttributes.DIM}>
            {`- dirPath: ${noteData.dirPath}`}
          </text>
          <text attributes={TextAttributes.DIM}>
            {`- templatePath: ${noteData.templatePath}`}
          </text>
          <text attributes={TextAttributes.DIM}>
            {`- selectedTags: ${noteData.selectedTags}`}
          </text>
          <text attributes={TextAttributes.DIM}>
            {`- aliases: ${noteData.aliases}`}
          </text>
        </box>
        <box
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <createButton
            label="Create note"
            focused={activeButton === 0}
            width={24}
          />
          <createButton
            label="Cancel"
            focused={activeButton === 1}
            width={24}
          />
        </box>
      </box>
    </>
  );
};
