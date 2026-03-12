import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const workspaces = sqliteTable('workspaces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const workspaceMembers = sqliteTable('workspace_members', {
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  userId: text('user_id').notNull().references(() => users.id),
  role: text('role').notNull(), // 'admin', 'member'
  joinedAt: integer('joined_at', { mode: 'timestamp' }).notNull(),
});

export const providerConfigs = sqliteTable('provider_configs', {
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  provider: text('provider').notNull(), // 'gemini', 'openai', etc.
  model: text('model'),
  encryptedApiKey: text('encrypted_api_key').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  validatedAt: integer('validated_at', { mode: 'timestamp' }),
});

export const youtubeConnections = sqliteTable('youtube_connections', {
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  channelInput: text('channel_input').notNull(),
  channelId: text('channel_id'),
  youtubeApiMode: text('youtube_api_mode').notNull(), // 'key', 'oauth'
  encryptedKeyOrToken: text('encrypted_key_or_token').notNull(),
  lastSyncAt: integer('last_sync_at', { mode: 'timestamp' }),
  status: text('status').notNull(), // 'active', 'error', 'pending'
});

export const channels = sqliteTable('channels', {
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  channelId: text('channel_id').notNull(),
  title: text('title').notNull(),
  subscribers: integer('subscribers').notNull(),
  totalViews: integer('total_views').notNull(),
  metadata: text('metadata'), // JSON string
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const channelSnapshots = sqliteTable('channel_snapshots', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  channelId: text('channel_id').notNull(),
  collectedAt: integer('collected_at', { mode: 'timestamp' }).notNull(),
  subscribers: integer('subscribers').notNull(),
  totalViews: integer('total_views').notNull(),
  totalVideos: integer('total_videos').notNull(),
  estRevenue: real('est_revenue'),
});

export const videos = sqliteTable('videos', {
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  channelId: text('channel_id').notNull(),
  videoId: text('video_id').notNull().primaryKey(),
  title: text('title').notNull(),
  publishedAt: integer('published_at', { mode: 'timestamp' }).notNull(),
  views: integer('views').notNull(),
  likes: integer('likes'),
  comments: integer('comments'),
  tags: text('tags'), // JSON array string
  rawJson: text('raw_json'), // JSON string
});

export const analysisRuns = sqliteTable('analysis_runs', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  provider: text('provider').notNull(),
  model: text('model').notNull(),
  query: text('query').notNull(),
  promptVersion: text('prompt_version'),
  status: text('status').notNull(), // 'pending', 'completed', 'failed'
  startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  errorMessage: text('error_message'),
});

export const analysisOutputs = sqliteTable('analysis_outputs', {
  analysisRunId: text('analysis_run_id').notNull().references(() => analysisRuns.id),
  normalizedJson: text('normalized_json'), // JSON string
  rawText: text('raw_text'),
  tokenUsage: integer('token_usage'),
  latencyMs: integer('latency_ms'),
});

export const plannerItems = sqliteTable('planner_items', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  title: text('title').notNull(),
  status: text('status').notNull(),
  targetDate: integer('target_date', { mode: 'timestamp' }),
  priority: text('priority').notNull(),
  aiStatus: text('ai_status'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const canvasItems = sqliteTable('canvas_items', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  type: text('type').notNull(), // 'sticky', 'text', 'image'
  content: text('content').notNull(),
  x: real('x').notNull(),
  y: real('y').notNull(),
  color: text('color'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const competitors = sqliteTable('competitors', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  name: text('name').notNull(),
  subs: text('subs'),
  growth: text('growth'),
  freq: text('freq'),
  keywordsJson: text('keywords_json'), // JSON string
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const trends = sqliteTable('trends', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  icon: text('icon').notNull(),
  name: text('name').notNull(),
  subtitle: text('subtitle'),
  badge: text('badge'),
  badgeColor: text('badge_color'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const rulebook = sqliteTable('rulebook', {
  workspaceId: text('workspace_id').notNull().primaryKey().references(() => workspaces.id),
  goal: text('goal').notNull(),
  personaAgeGroup: text('persona_age_group'),
  personaMotivation: text('persona_motivation'),
  togglesJson: text('toggles_json'), // JSON string
  constraintsJson: text('constraints_json'), // JSON string
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const canvasState = sqliteTable('canvas_state', {
  workspaceId: text('workspace_id').notNull().primaryKey().references(() => workspaces.id),
  theme: text('theme').notNull(),
  notesJson: text('notes_json'), // JSON string
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const appEvents = sqliteTable('app_events', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id'),
  userId: text('user_id'),
  eventName: text('event_name').notNull(),
  eventTime: integer('event_time', { mode: 'timestamp' }).notNull(),
  sessionId: text('session_id'),
  platform: text('platform'),
  source: text('source'),
  propertiesJson: text('properties_json'),
});

export const syncJobRuns = sqliteTable('sync_job_runs', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  jobType: text('job_type').notNull(),
  trigger: text('trigger').notNull(), // 'manual', 'schedule'
  status: text('status').notNull(), // 'started', 'completed', 'failed'
  startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
  finishedAt: integer('finished_at', { mode: 'timestamp' }),
  error: text('error'),
  statsJson: text('stats_json'),
});
