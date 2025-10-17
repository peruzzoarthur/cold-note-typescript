import { TextAttributes } from "@opentui/core";
import { useKeyboard, useRenderer } from "@opentui/react";
import { spawn } from "bun-pty";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { useState } from "react";
import { useNoteContext } from "../contexts/NoteContext";
import { useAppMenus } from "../hooks/useAppMenus";

export const CreateNote = () => {
  const { noteData } = useNoteContext();
  const [test, setTest] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<number>(0);
  const [nvimRunning, setNvimRunning] = useState<boolean>(false);
  const renderer = useRenderer();
  const { addDebugLog } = useAppMenus();

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

    // Destroy renderer BEFORE messing with stdin
    renderer.destroy();

    // Small delay to ensure renderer cleanup is complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    setNvimRunning(true);

    // Store ALL original stdin state
    const originalListeners = process.stdin.listeners("data");
    const originalRawMode = process.stdin.isRaw;

    // Remove all data listeners
    process.stdin.removeAllListeners("data");

    // Ensure stdin is resumed and in raw mode
    process.stdin.resume();
    process.stdin.setRawMode(true);

    // Clear screen and hide cursor
    process.stdout.write("\x1b[?25l\x1b[2J\x1b[H");

    // Create PTY for nvim
    const nvimPty = spawn("nvim", [fullPath], {
      name: "xterm-256color",
      cols: process.stdout.columns || 80,
      rows: process.stdout.rows || 24,
      cwd: dirPath, // Use the note's directory as cwd
    });

    // Pipe PTY output to stdout
    nvimPty.onData((data) => {
      process.stdout.write(data);
    });

    // Pipe stdin to PTY - make sure this is working
    const stdinHandler = (data: Buffer) => {
      nvimPty.write(data.toString());
    };

    process.stdin.on("data", stdinHandler);

    // Handle resize events
    const resizeHandler = () => {
      if (process.stdout.columns && process.stdout.rows) {
        nvimPty.resize(process.stdout.columns, process.stdout.rows);
      }
    };
    process.stdout.on("resize", resizeHandler);

    // Handle nvim exit
    nvimPty.onExit(() => {
      // Clean up stdin handler
      process.stdin.removeListener("data", stdinHandler);
      process.stdout.removeListener("resize", resizeHandler);

      // Restore stdin state
      process.stdin.setRawMode(originalRawMode);

      // Restore original listeners
      originalListeners.forEach((listener: any) => {
        process.stdin.on("data", listener);
      });

      // Clear screen and show cursor
      process.stdout.write("\x1b[2J\x1b[H\x1b[?25h");

      // Re-enable the UI
      setNvimRunning(false);
    });
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
