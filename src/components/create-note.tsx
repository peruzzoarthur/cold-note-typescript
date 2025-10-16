import { TextAttributes } from "@opentui/core";
import "./ui/create-button";
import { useNoteContext } from "../contexts/NoteContext";
import { useNavigation } from "../hooks/useNavigation";
import { useState } from "react";
import { writeFile, readFile } from "fs/promises";
import { spawn } from "child_process";
import { useRenderer } from "@opentui/react";
import { join } from "path";

export const CreateNote = () => {
  const { noteData } = useNoteContext();
  const [test, setTest] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<number>(0); // 0 for create, 1 for cancel
  const renderer = useRenderer();

  const createAndOpenNote = async () => {
    try {
      const fileName = noteData.noteName ? `${noteData.noteName}.md` : 'untitled.md';
      const dirPath = noteData.dirPath || process.cwd();
      const fullPath = join(dirPath, fileName);
      
      // Read template content if a template is selected
      let content = '';
      if (noteData.templatePath) {
        try {
          content = await readFile(noteData.templatePath, 'utf-8');
          
          // Replace template variables
          content = content
            .replace(/{{title}}/g, noteData.noteName || 'Untitled')
            .replace(/{{date}}/g, new Date().toISOString().split('T')[0])
            .replace(/{{datetime}}/g, new Date().toISOString())
            .replace(/{{tags}}/g, noteData.selectedTags.map(tag => `#${tag}`).join(' '))
            .replace(/{{aliases}}/g, noteData.aliases.join(', '));
            
        } catch (templateError) {
          console.error('Failed to read template:', templateError);
          content = `# ${noteData.noteName || 'Untitled'}\n\n`;
        }
      } else {
        // Default content if no template
        content = `# ${noteData.noteName || 'Untitled'}\n\n`;
        if (noteData.selectedTags.length > 0) {
          content += `Tags: ${noteData.selectedTags.map(tag => `#${tag}`).join(' ')}\n\n`;
        }
      }
      
      await writeFile(fullPath, content);
      
      setTest(true);
      console.log(`Created file: ${fullPath}`);
      console.log('Opening in nvim...');
      
      // Clean up the TUI properly
      setTimeout(() => {
        renderer.destroy();
        
        // Open nvim
        const nvimProcess = spawn('nvim', [fullPath], {
          stdio: 'inherit'
        });
        
        // Exit when nvim closes
        nvimProcess.on('close', (code) => {
          process.exit(code || 0);
        });
        
        // Handle nvim launch errors
        nvimProcess.on('error', (error) => {
          console.error('Failed to launch nvim:', error);
          console.log(`File created: ${fullPath}`);
          process.exit(1);
        });
      }, 100); // Small delay to ensure console.log is visible
      
    } catch (error) {
      console.error('Failed to create file:', error);
    }
  };

  useNavigation({
    onLeft: () => {
      setActiveButton(0);
    },
    onRight: () => {
      setActiveButton(1);
    },
    onEnter: () => {
      if (activeButton === 0) {
        createAndOpenNote();
      } else {
        console.log("Cancel button activated!");
      }
    },
    onSpace: () => {
      if (activeButton === 0) {
        createAndOpenNote();
      } else {
        console.log("Cancel button activated!");
      }
    },
  });

  return (
    <>
      <box style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <box
          style={{ border: true, width: 60, height: 10, marginTop: 1, flexGrow: 1 }}
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
          style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}
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
