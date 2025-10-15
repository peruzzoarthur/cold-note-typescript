import { db } from './database';

export function initializeDatabase() {
  const createTagsTable = `
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createConfigTable = `
    CREATE TABLE IF NOT EXISTS config (
      obsidian_vault TEXT UNIQUE NOT NULL,
      templates_dir  TEXT UNIQUE NOT NULL
    )
  `

  const createUpdatedAtTrigger = `
    CREATE TRIGGER IF NOT EXISTS tags_updated_at
    AFTER UPDATE ON tags
    BEGIN
      UPDATE tags SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `;

  db.run(createTagsTable);
  db.run(createConfigTable);
  db.run(createUpdatedAtTrigger);

}

export function runMigrations() {
  initializeDatabase();
}
