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

  const createUpdatedAtTrigger = `
    CREATE TRIGGER IF NOT EXISTS tags_updated_at
    AFTER UPDATE ON tags
    BEGIN
      UPDATE tags SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `;

  db.exec(createTagsTable);
  db.exec(createUpdatedAtTrigger);

  console.log('Tags database initialized successfully');
}

export function runMigrations() {
  initializeDatabase();
}