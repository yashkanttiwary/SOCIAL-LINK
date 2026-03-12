import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { initDb, db } from './server/db';
import { eq, desc } from 'drizzle-orm';
import * as schema from './server/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Initialize DB
  initDb();

  // Mock Authentication Middleware (always uses default workspace for demo)
  const requireAuth = (req: any, res: any, next: any) => {
    req.user = { id: 'usr_default', workspaceId: 'ws_default' };
    next();
  };

  // --- API ROUTES ---

  // Auth & Workspace
  app.get('/api/auth/me', requireAuth, async (req: any, res) => {
    const user = await db.select().from(schema.users).where(eq(schema.users.id, req.user.id)).get();
    res.json({ user, workspaceId: req.user.workspaceId });
  });

  // Config
  app.get('/api/config/current', requireAuth, async (req: any, res) => {
    const aiConfig = await db.select().from(schema.providerConfigs).where(eq(schema.providerConfigs.workspaceId, req.user.workspaceId)).get();
    const ytConfig = await db.select().from(schema.youtubeConnections).where(eq(schema.youtubeConnections.workspaceId, req.user.workspaceId)).get();
    res.json({ ai: aiConfig || null, youtube: ytConfig || null });
  });

  app.post('/api/config/ai', requireAuth, async (req: any, res) => {
    const { provider, model, apiKey } = req.body;
    // In production, encrypt apiKey
    const existing = await db.select().from(schema.providerConfigs).where(eq(schema.providerConfigs.workspaceId, req.user.workspaceId)).get();
    
    if (existing) {
      await db.update(schema.providerConfigs).set({ provider, model, encryptedApiKey: apiKey, validatedAt: new Date() }).where(eq(schema.providerConfigs.workspaceId, req.user.workspaceId));
    } else {
      await db.insert(schema.providerConfigs).values({
        workspaceId: req.user.workspaceId,
        provider,
        model,
        encryptedApiKey: apiKey,
        validatedAt: new Date()
      });
    }
    
    // Track event
    await db.insert(schema.appEvents).values({
      id: uuidv4(),
      workspaceId: req.user.workspaceId,
      userId: req.user.id,
      eventName: 'ai_config_saved',
      eventTime: new Date(),
    });

    res.json({ success: true });
  });

  app.post('/api/config/youtube', requireAuth, async (req: any, res) => {
    const { channelInput, apiKey } = req.body;
    
    const existing = await db.select().from(schema.youtubeConnections).where(eq(schema.youtubeConnections.workspaceId, req.user.workspaceId)).get();
    
    if (existing) {
      await db.update(schema.youtubeConnections).set({ channelInput, youtubeApiMode: 'key', encryptedKeyOrToken: apiKey, status: 'active' }).where(eq(schema.youtubeConnections.workspaceId, req.user.workspaceId));
    } else {
      await db.insert(schema.youtubeConnections).values({
        workspaceId: req.user.workspaceId,
        channelInput,
        youtubeApiMode: 'key',
        encryptedKeyOrToken: apiKey,
        status: 'active'
      });
    }

    // Track event
    await db.insert(schema.appEvents).values({
      id: uuidv4(),
      workspaceId: req.user.workspaceId,
      userId: req.user.id,
      eventName: 'youtube_config_saved',
      eventTime: new Date(),
    });

    res.json({ success: true });
  });

  // Sync
  app.post('/api/sync/youtube/start', requireAuth, async (req: any, res) => {
    const runId = uuidv4();
    await db.insert(schema.syncJobRuns).values({
      id: runId,
      workspaceId: req.user.workspaceId,
      jobType: 'youtube_sync',
      trigger: 'manual',
      status: 'started',
      startedAt: new Date()
    });

    // Simulate background sync (in real app, use BullMQ or similar)
    setTimeout(async () => {
      try {
        const ytConfig = await db.select().from(schema.youtubeConnections).where(eq(schema.youtubeConnections.workspaceId, req.user.workspaceId)).get();
        if (!ytConfig) throw new Error("No YouTube config");

        // Mock fetching data from YouTube API
        const channelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // Google Developers
        
        // Upsert channel
        const existingChannel = await db.select().from(schema.channels).where(eq(schema.channels.workspaceId, req.user.workspaceId)).get();
        if (existingChannel) {
          await db.update(schema.channels).set({
            subscribers: 2340000,
            totalViews: 150000000,
            updatedAt: new Date()
          }).where(eq(schema.channels.workspaceId, req.user.workspaceId));
        } else {
          await db.insert(schema.channels).values({
            workspaceId: req.user.workspaceId,
            channelId,
            title: 'Google Developers',
            subscribers: 2340000,
            totalViews: 150000000,
            updatedAt: new Date()
          });
        }

        // Add snapshot
        await db.insert(schema.channelSnapshots).values({
          id: uuidv4(),
          workspaceId: req.user.workspaceId,
          channelId,
          collectedAt: new Date(),
          subscribers: 2340000,
          totalViews: 150000000,
          totalVideos: 5400,
          estRevenue: 12500.50
        });

        // Mock videos
        const mockVideos = [
          { id: 'v1', title: 'What is new in React 19', views: 120000, publishedAt: new Date(Date.now() - 86400000 * 2) },
          { id: 'v2', title: 'Building AI Apps', views: 85000, publishedAt: new Date(Date.now() - 86400000 * 5) }
        ];

        for (const v of mockVideos) {
          const existingVideo = await db.select().from(schema.videos).where(eq(schema.videos.videoId, v.id)).get();
          if (existingVideo) {
            await db.update(schema.videos).set({ views: v.views }).where(eq(schema.videos.videoId, v.id));
          } else {
            await db.insert(schema.videos).values({
              workspaceId: req.user.workspaceId,
              channelId,
              videoId: v.id,
              title: v.title,
              publishedAt: v.publishedAt,
              views: v.views
            });
          }
        }

        await db.update(schema.syncJobRuns).set({ status: 'completed', finishedAt: new Date() }).where(eq(schema.syncJobRuns.id, runId));
        await db.update(schema.youtubeConnections).set({ lastSyncAt: new Date() }).where(eq(schema.youtubeConnections.workspaceId, req.user.workspaceId));
        
        await db.insert(schema.appEvents).values({
          id: uuidv4(),
          workspaceId: req.user.workspaceId,
          userId: req.user.id,
          eventName: 'youtube_sync_succeeded',
          eventTime: new Date(),
        });
      } catch (error: any) {
        await db.update(schema.syncJobRuns).set({ status: 'failed', finishedAt: new Date(), error: error.message }).where(eq(schema.syncJobRuns.id, runId));
        await db.insert(schema.appEvents).values({
          id: uuidv4(),
          workspaceId: req.user.workspaceId,
          userId: req.user.id,
          eventName: 'youtube_sync_failed',
          eventTime: new Date(),
        });
      }
    }, 2000);

    res.json({ success: true, runId });
  });

  app.get('/api/sync/runs', requireAuth, async (req: any, res) => {
    const runs = await db.select().from(schema.syncJobRuns).where(eq(schema.syncJobRuns.workspaceId, req.user.workspaceId)).orderBy(desc(schema.syncJobRuns.startedAt)).limit(10).all();
    res.json({ runs });
  });

  // Dashboard & Analytics
  app.get('/api/dashboard/summary', requireAuth, async (req: any, res) => {
    const channel = await db.select().from(schema.channels).where(eq(schema.channels.workspaceId, req.user.workspaceId)).get();
    if (!channel) {
      return res.json({ synced: false });
    }

    const recentVideos = await db.select().from(schema.videos).where(eq(schema.videos.workspaceId, req.user.workspaceId)).orderBy(desc(schema.videos.publishedAt)).limit(5).all();
    
    res.json({
      synced: true,
      channel,
      recentVideos
    });
  });

  // Planner
  app.get('/api/planner', requireAuth, async (req: any, res) => {
    const items = await db.select().from(schema.plannerItems).where(eq(schema.plannerItems.workspaceId, req.user.workspaceId)).orderBy(desc(schema.plannerItems.targetDate)).all();
    res.json({ items });
  });

  app.post('/api/planner', requireAuth, async (req: any, res) => {
    const { title, status, targetDate, priority } = req.body;
    const newItem = {
      id: uuidv4(),
      workspaceId: req.user.workspaceId,
      title,
      status: status || 'ideation',
      targetDate: targetDate ? new Date(targetDate) : null,
      priority: priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await db.insert(schema.plannerItems).values(newItem);
    res.json({ item: newItem });
  });

  app.put('/api/planner/:id', requireAuth, async (req: any, res) => {
    const { id } = req.params;
    const { title, status, targetDate, priority } = req.body;
    await db.update(schema.plannerItems).set({
      title,
      status,
      targetDate: targetDate ? new Date(targetDate) : null,
      priority
    }).where(eq(schema.plannerItems.id, id));
    res.json({ success: true });
  });

  app.delete('/api/planner/:id', requireAuth, async (req: any, res) => {
    const { id } = req.params;
    await db.delete(schema.plannerItems).where(eq(schema.plannerItems.id, id));
    res.json({ success: true });
  });

  // Research
  app.get('/api/research/competitors', requireAuth, async (req: any, res) => {
    const competitors = await db.select().from(schema.competitors).where(eq(schema.competitors.workspaceId, req.user.workspaceId)).all();
    res.json({ competitors: competitors.map(c => ({ ...c, keywords: JSON.parse(c.keywordsJson || '[]') })) });
  });

  app.post('/api/research/competitors', requireAuth, async (req: any, res) => {
    const { name, subs, growth, freq, keywords } = req.body;
    const newCompetitor = {
      id: uuidv4(),
      workspaceId: req.user.workspaceId,
      name,
      subs: subs || '0',
      growth: growth || '0%',
      freq: freq || 'N/A',
      keywordsJson: JSON.stringify(keywords || []),
      updatedAt: new Date()
    };
    await db.insert(schema.competitors).values(newCompetitor);
    res.json({ competitor: { ...newCompetitor, keywords: JSON.parse(newCompetitor.keywordsJson) } });
  });

  app.get('/api/research/trends', requireAuth, async (req: any, res) => {
    const trends = await db.select().from(schema.trends).where(eq(schema.trends.workspaceId, req.user.workspaceId)).all();
    res.json({ trends });
  });

  // Rulebook
  app.get('/api/rulebook', requireAuth, async (req: any, res) => {
    const rulebook = await db.select().from(schema.rulebook).where(eq(schema.rulebook.workspaceId, req.user.workspaceId)).get();
    
    res.json({
      goal: rulebook?.goal || '',
      persona: {
        ageGroup: rulebook?.personaAgeGroup || '',
        motivation: rulebook?.personaMotivation || ''
      },
      toggles: JSON.parse(rulebook?.togglesJson || '{}'),
      constraints: JSON.parse(rulebook?.constraintsJson || '[]')
    });
  });

  app.post('/api/rulebook', requireAuth, async (req: any, res) => {
    const { goal, persona, toggles, constraints } = req.body;
    
    const existing = await db.select().from(schema.rulebook).where(eq(schema.rulebook.workspaceId, req.user.workspaceId)).get();
    
    if (existing) {
      await db.update(schema.rulebook).set({
        goal,
        personaAgeGroup: persona.ageGroup,
        personaMotivation: persona.motivation,
        togglesJson: JSON.stringify(toggles),
        constraintsJson: JSON.stringify(constraints),
        updatedAt: new Date()
      }).where(eq(schema.rulebook.workspaceId, req.user.workspaceId));
    } else {
      await db.insert(schema.rulebook).values({
        workspaceId: req.user.workspaceId,
        goal,
        personaAgeGroup: persona.ageGroup,
        personaMotivation: persona.motivation,
        togglesJson: JSON.stringify(toggles),
        constraintsJson: JSON.stringify(constraints),
        updatedAt: new Date()
      });
    }

    res.json({ success: true, message: 'Rulebook saved successfully' });
  });

  // Analytics
  app.get('/api/analytics', requireAuth, async (req: any, res) => {
    const channel = await db.select().from(schema.channels).where(eq(schema.channels.workspaceId, req.user.workspaceId)).get();
    
    if (!channel) {
      // Return empty/mock data if no channel synced
      return res.json({
        metrics: [
          { label: 'Total Views', value: '0', trend: '0%', isPositive: true },
          { label: 'Subscribers', value: '0', trend: '0%', isPositive: true },
          { label: 'Avg Watch Time', value: '0:00', trend: '0%', isPositive: true },
          { label: 'Est. Revenue', value: '$0', trend: '0%', isPositive: true },
        ],
        timeSeriesData: [],
        topVideos: [],
        demoData: [],
        trafficData: []
      });
    }

    const videos = await db.select().from(schema.videos).where(eq(schema.videos.workspaceId, req.user.workspaceId)).orderBy(desc(schema.videos.views)).limit(5).all();

    const metrics = [
      { label: 'Total Views', value: (channel.totalViews / 1000000).toFixed(2) + 'M', trend: '+15.2%', isPositive: true },
      { label: 'Subscribers', value: (channel.subscribers / 1000).toFixed(1) + 'K', trend: '+8.4%', isPositive: true },
      { label: 'Avg Watch Time', value: '4:45', trend: '-2.1%', isPositive: false },
      { label: 'Est. Revenue', value: '$8.4K', trend: '+12%', isPositive: true },
    ];

    const timeSeriesData = Array.from({ length: 30 }).map((_, i) => ({
      date: `Oct ${i + 1}`,
      views: Math.floor(Math.random() * 50000) + 10000,
      subs: Math.floor(Math.random() * 500) + 50,
      revenue: Math.floor(Math.random() * 300) + 50,
    }));

    const topVideos = videos.map(v => ({
      title: v.title,
      views: (v.views / 1000).toFixed(1) + 'K',
      ctr: (Math.random() * 5 + 4).toFixed(1) + '%',
      watchTime: `${Math.floor(Math.random() * 5 + 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
    }));

    const demoData = [
      { name: '18-24', male: 40, female: 20 },
      { name: '25-34', male: 60, female: 30 },
      { name: '35-44', male: 30, female: 15 },
      { name: '45-54', male: 10, female: 5 },
    ];

    const trafficData = [
      { name: 'Search', value: 400 },
      { name: 'Suggested', value: 300 },
      { name: 'Browse', value: 200 },
      { name: 'External', value: 100 },
    ];

    res.json({
      metrics,
      timeSeriesData,
      topVideos,
      demoData,
      trafficData
    });
  });

  // Canvas
  app.get('/api/canvas', requireAuth, async (req: any, res) => {
    const canvas = await db.select().from(schema.canvasState).where(eq(schema.canvasState.workspaceId, req.user.workspaceId)).get();
    
    res.json({ notes: JSON.parse(canvas?.notesJson || '[]'), theme: canvas?.theme || '' });
  });

  app.post('/api/canvas', requireAuth, async (req: any, res) => {
    const { notes, theme } = req.body;
    
    const existing = await db.select().from(schema.canvasState).where(eq(schema.canvasState.workspaceId, req.user.workspaceId)).get();
    
    if (existing) {
      await db.update(schema.canvasState).set({
        theme,
        notesJson: JSON.stringify(notes),
        updatedAt: new Date()
      }).where(eq(schema.canvasState.workspaceId, req.user.workspaceId));
    } else {
      await db.insert(schema.canvasState).values({
        workspaceId: req.user.workspaceId,
        theme,
        notesJson: JSON.stringify(notes),
        updatedAt: new Date()
      });
    }

    res.json({ success: true, message: 'Canvas saved successfully' });
  });

  app.post('/api/ai/insights', requireAuth, async (req: any, res) => {
    const { context } = req.body;
    try {
      const config = await db.select().from(schema.providerConfigs).where(eq(schema.providerConfigs.workspaceId, req.user.workspaceId)).get();
      if (!config || !config.encryptedApiKey) {
        return res.status(400).json({ error: 'AI not configured. Please add your Gemini API key in Settings.' });
      }

      const ai = new GoogleGenAI({ apiKey: config.encryptedApiKey });
      const prompt = `You are an expert YouTube content strategist. Provide 3 brief, actionable insights or ideas based on this context: "${context}".`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'ARRAY',
            items: { type: 'STRING' }
          }
        }
      });
      
      const insights = JSON.parse(response.text || '[]');
      res.json({ insights });
    } catch (error: any) {
      console.error('AI Insights Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Events
  app.post('/api/events/track', requireAuth, async (req: any, res) => {
    const { eventName, propertiesJson, platform, source } = req.body;
    await db.insert(schema.appEvents).values({
      id: uuidv4(),
      workspaceId: req.user.workspaceId,
      userId: req.user.id,
      eventName,
      eventTime: new Date(),
      platform,
      source,
      propertiesJson: propertiesJson ? JSON.stringify(propertiesJson) : null
    });
    res.json({ success: true });
  });

  // AI Generation
  app.post('/api/ai/canvas-suggestion', requireAuth, async (req: any, res) => {
    const { theme } = req.body;
    const aiConfig = await db.select().from(schema.providerConfigs).where(eq(schema.providerConfigs.workspaceId, req.user.workspaceId)).get();
    
    if (!aiConfig || !aiConfig.encryptedApiKey) {
      return res.status(400).json({ error: 'AI not configured. Please configure it in Settings.' });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: aiConfig.encryptedApiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a YouTube content strategist. The creator's current video theme is "${theme}". Provide a single, short, actionable suggestion (under 150 characters) for this video. It could be a hook, a thumbnail idea, or a content angle. Do not use quotes.`,
      });
      
      res.json({ suggestion: response.text });
    } catch (error: any) {
      console.error('AI Generation Error:', error);
      res.status(500).json({ error: 'Failed to generate suggestion. Check your API key.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
