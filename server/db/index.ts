import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sqlite = new Database(path.join(dataDir, 'sqlite.db'));
export const db = drizzle(sqlite, { schema });

// Initialize database schema (simple sync for this environment)
// In a real production app, use drizzle-kit migrate
export function initDb() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS workspace_members (
      workspace_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      joined_at INTEGER NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS provider_configs (
      workspace_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      model TEXT,
      encrypted_api_key TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      validated_at INTEGER,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );
    CREATE TABLE IF NOT EXISTS youtube_connections (
      workspace_id TEXT NOT NULL,
      channel_input TEXT NOT NULL,
      channel_id TEXT,
      youtube_api_mode TEXT NOT NULL,
      encrypted_key_or_token TEXT NOT NULL,
      last_sync_at INTEGER,
      status TEXT NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );
    CREATE TABLE IF NOT EXISTS channels (
      workspace_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      title TEXT NOT NULL,
      subscribers INTEGER NOT NULL,
      total_views INTEGER NOT NULL,
      metadata TEXT,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );
    CREATE TABLE IF NOT EXISTS channel_snapshots (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      collected_at INTEGER NOT NULL,
      subscribers INTEGER NOT NULL,
      total_views INTEGER NOT NULL,
      total_videos INTEGER NOT NULL,
      est_revenue REAL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );
    CREATE TABLE IF NOT EXISTS videos (
      workspace_id TEXT NOT NULL,
      channel_id TEXT NOT NULL,
      video_id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      published_at INTEGER NOT NULL,
      views INTEGER NOT NULL,
      likes INTEGER,
      comments INTEGER,
      tags TEXT,
      raw_json TEXT,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );
    CREATE TABLE IF NOT EXISTS analysis_runs (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      model TEXT NOT NULL,
      query TEXT NOT NULL,
      prompt_version TEXT,
      status TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      completed_at INTEGER,
      error_message TEXT,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );
    CREATE TABLE IF NOT EXISTS analysis_outputs (
      analysis_run_id TEXT NOT NULL,
      normalized_json TEXT,
      raw_text TEXT,
      token_usage INTEGER,
      latency_ms INTEGER,
      FOREIGN KEY (analysis_run_id) REFERENCES analysis_runs(id)
    );
    CREATE TABLE IF NOT EXISTS planner_items (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      target_date INTEGER,
      priority TEXT NOT NULL,
      ai_status TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );
    CREATE TABLE IF NOT EXISTS canvas_items (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      x REAL NOT NULL,
      y REAL NOT NULL,
      color TEXT,
      created_at INTEGER NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );
    CREATE TABLE IF NOT EXISTS competitors (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      name TEXT NOT NULL,
      subs TEXT,
      growth TEXT,
      freq TEXT,
      keywords_json TEXT,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );
    CREATE TABLE IF NOT EXISTS trends (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      icon TEXT NOT NULL,
      name TEXT NOT NULL,
      subtitle TEXT,
      badge TEXT,
      badge_color TEXT,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );
    CREATE TABLE IF NOT EXISTS rulebook (
      workspace_id TEXT PRIMARY KEY,
      goal TEXT NOT NULL,
      persona_age_group TEXT,
      persona_motivation TEXT,
      toggles_json TEXT,
      constraints_json TEXT,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );
    CREATE TABLE IF NOT EXISTS canvas_state (
      workspace_id TEXT PRIMARY KEY,
      theme TEXT NOT NULL,
      notes_json TEXT,
      updated_at INTEGER NOT NULL,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );
    CREATE TABLE IF NOT EXISTS app_events (
      id TEXT PRIMARY KEY,
      workspace_id TEXT,
      user_id TEXT,
      event_name TEXT NOT NULL,
      event_time INTEGER NOT NULL,
      session_id TEXT,
      platform TEXT,
      source TEXT,
      properties_json TEXT
    );
    CREATE TABLE IF NOT EXISTS sync_job_runs (
      id TEXT PRIMARY KEY,
      workspace_id TEXT NOT NULL,
      job_type TEXT NOT NULL,
      trigger TEXT NOT NULL,
      status TEXT NOT NULL,
      started_at INTEGER NOT NULL,
      finished_at INTEGER,
      error TEXT,
      stats_json TEXT,
      FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    );
  `);

  // Seed default workspace and user if not exists
  const defaultWorkspaceId = 'ws_default';
  const defaultUserId = 'usr_default';
  
  const hasWorkspace = sqlite.prepare('SELECT id FROM workspaces WHERE id = ?').get(defaultWorkspaceId);
  if (!hasWorkspace) {
    sqlite.prepare('INSERT INTO workspaces (id, name, created_at) VALUES (?, ?, ?)').run(defaultWorkspaceId, 'Default Workspace', Date.now());
    sqlite.prepare('INSERT INTO users (id, email, name, created_at) VALUES (?, ?, ?, ?)').run(defaultUserId, 'demo@creatorpulse.com', 'Demo User', Date.now());
    sqlite.prepare('INSERT INTO workspace_members (workspace_id, user_id, role, joined_at) VALUES (?, ?, ?, ?)').run(defaultWorkspaceId, defaultUserId, 'admin', Date.now());
  }
}
