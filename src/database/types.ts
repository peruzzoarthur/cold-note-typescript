export interface Tag {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Config {
  obsidian_vault: string;
  templates_dir: string;
}
