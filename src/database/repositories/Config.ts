import { db } from '../database';
import type { Config } from '../types';

export class ConfigRepository {
  private insertConfig!: ReturnType<typeof db.prepare>;
  private selectConfig!: ReturnType<typeof db.prepare>;
  private updateConfig!: ReturnType<typeof db.prepare>;

  constructor() {
    this.initStatements();
  }

  private initStatements() {
    this.insertConfig = db.prepare(`INSERT INTO config (obsidian_vault, templates_dir) VALUES (?, ?)`);
    this.selectConfig = db.prepare(`SELECT * FROM config LIMIT 1`);
    this.updateConfig = db.prepare(`UPDATE config SET obsidian_vault = ?, templates_dir = ? WHERE rowid = 1`);
  }

  create(config: Config): boolean {
    try {
      this.insertConfig.run(config.obsidian_vault, config.templates_dir);
      return true;
    } catch {
      return false;
    }
  }

  find(): Config | null {
    return this.selectConfig.get() as Config | null;
  }

  update(config: Config): boolean {
    try {
      this.updateConfig.run(config.obsidian_vault, config.templates_dir);
      return true;
    } catch {
      return false;
    }
  }
}