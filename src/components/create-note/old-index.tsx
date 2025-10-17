import { TextAttributes } from "@opentui/core";
import "../ui/create-button";
import { useNoteContext } from "../../contexts/NoteContext";
import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { writeFile, readFile } from "fs/promises";
import { useRenderer } from "@opentui/react";
import { join } from "path";
import { useAppMenus } from "../../hooks/useAppMenus";
import { useOpenNote } from "./open-note";

export const CreateNote = () => {
  const { noteData } = useNoteContext();
  const [test, setTest] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<number>(0); // 0 for create, 1 for cancel
  const [nvimRunning, setNvimRunning] = useState<boolean>(false);
  const { addDebugLog } = useAppMenus();
  const openNote = useOpenNote();

  const createAndOpenNote = async () => {
    const fileName = noteData.noteName
      ? `${noteData.noteName}.md`
      : "untitled.md";
    const dirPath = noteData.dirPath || process.cwd();
    const fullPath = join(dirPath, fileName);

    // Read template content if a template is selected
    let content = "";
    if (noteData.templatePath) {
      try {
        content = await readFile(noteData.templatePath, "utf-8");
        addDebugLog(`content: ${content}`);

        content = content
          .replace(/{{title}}/g, noteData.noteName || "Untitled")
          .replace(/{{date}}/g, new Date().toISOString())
          .replace(/{{datetime}}/g, new Date().toISOString())
          .replace(
            /{{tags}}/g,
            noteData.selectedTags.map((tag) => `#${tag}`).join(" "),
          )
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

    await openNote({ setNvimRunning, fullPath, dirPath })

  };
  // Custom keyboard handler that we can control
  useKeyboard((key) => {
    if (nvimRunning) return; // Don't handle keys when nvim is running

    if (key.name === "h" || key.name === "left") {
      setActiveButton(0);
    } else if (key.name === "l" || key.name === "right") {
      setActiveButton(1);
    } else if (
      key.name === "return" ||
      key.name === "enter" ||
      key.name === "space"
    ) {
      if (activeButton === 0) {
        createAndOpenNote();
      } else {
        console.log("Cancel button activated!");
      }
    }
  });

  // Don't render UI when nvim is running
  if (nvimRunning) {
    return null;
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
        {test ? <text>Created</text> : <text>Not created</text>}
      </box>
    </>
  );
};
