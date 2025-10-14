import { db } from '../database';
import type { Tag } from '../types';

export class TagRepository {
  private insertTag: any;
  private selectTagById: any;
  private selectTagByName: any;
  private selectAllTags: any;
  private updateTag: any;
  private deleteTag: any;
  private searchTags: any;

  constructor() {
    this.initStatements();
  }

  private initStatements() {
    this.insertTag = db.prepare(`INSERT INTO tags (name) VALUES (?)`);
    this.selectTagById = db.prepare(`SELECT * FROM tags WHERE id = ?`);
    this.selectTagByName = db.prepare(`SELECT * FROM tags WHERE name = ?`);
    this.selectAllTags = db.prepare(`SELECT * FROM tags ORDER BY name`);
    this.updateTag = db.prepare(`UPDATE tags SET name = ? WHERE id = ?`);
    this.deleteTag = db.prepare(`DELETE FROM tags WHERE id = ?`);
    this.searchTags = db.prepare(`SELECT * FROM tags WHERE name LIKE ? ORDER BY name`);
  }

  create(name: string): number {
    this.insertTag.run(name);
    const result = db.prepare("SELECT last_insert_rowid() as id").get() as { id: number };
    return result.id;
  }

  findOrCreate(name: string): Tag {
    let tag = this.findByName(name);
    if (!tag) {
      const id = this.create(name);
      tag = { id, name };
    }
    return tag;
  }

  findById(id: number): Tag | null {
    return this.selectTagById.get(id) as Tag | null;
  }

  findByName(name: string): Tag | null {
    return this.selectTagByName.get(name) as Tag | null;
  }

  findAll(): Tag[] {
    return this.selectAllTags.all() as Tag[];
  }

  search(query: string): Tag[] {
    return this.searchTags.all(`%${query}%`) as Tag[];
  }

  update(id: number, name: string): boolean {
    try {
      this.updateTag.run(name, id);
      return true;
    } catch {
      return false;
    }
  }

  delete(id: number): boolean {
    try {
      this.deleteTag.run(id);
      return true;
    } catch {
      return false;
    }
  }

  exists(name: string): boolean {
    return this.findByName(name) !== null;
  }
}