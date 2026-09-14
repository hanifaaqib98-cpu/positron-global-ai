import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { PositronEngine, reconcile } from './src/server/engine.js';
import { global2026Catalog } from './src/server/catalog.js';
import { ChannelSpec, GatewayEnvelope, ScheduledTask, SkillSpec, Evidence } from './src/types/positron.js';

const PORT = 3000;
const engine = new PositronEngine();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // 1. Health endpoint (matching Python app.py)
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', system: 'positron', version: '1.0.0' });
  });

  // 2. Run endpoint (matching Python app.py)
  app.post('/run', (req, res) => {
    const { user_input, session_id } = req.body || {};
    if (!user_input) {
      return res.status(400).json({ detail: 'user_input is required' });
    }
    const result = engine.run(user_input, session_id || 'default');
    res.json(result);
  });

  // 3. Approval endpoint (matching Python app.py)
  app.post('/approval', (req, res) => {
    const { task_id, approved } = req.body || {};
    if (!task_id || typeof approved !== 'boolean') {
      return res.status(400).json({ detail: 'task_id and approved boolean required' });
    }
    const result = engine.resolveApproval(task_id, approved);
    if (!result) {
      return res.status(404).json({ detail: 'approval not found' });
    }
    res.json(result);
  });

  // 4. API State overview for UI
  app.get('/api/state', (req, res) => {
    const catalog = global2026Catalog();
    const channels = Array.from(engine.gateway.channels.values());
    const skills = Array.from(engine.skills.skills.values());
    const schedules = Array.from(engine.scheduler.tasks.values());
    const tasks = Array.from(engine.tasks.values());
    const approvals = Array.from(engine.approvals.values());

    res.json({
      stats: {
        total_tasks: tasks.length,
        pending_approvals: approvals.filter((a) => a.status === 'pending').length,
        events_count: engine.events.length,
        channels_active: channels.filter((c) => c.enabled).length,
        catalog_count: catalog.entries.length,
        checkpoints_count: engine.checkpoints.length
      },
      events: engine.events.slice(0, 50),
      tasks: tasks.slice(-20).reverse(),
      approvals: approvals.slice(-20).reverse(),
      channels,
      skills,
      schedules,
      outbox: engine.gateway.outbox.slice(-20).reverse(),
      consciousness: engine.consciousness.introspect(),
      checkpoints: engine.checkpoints.slice(0, 10)
    });
  });

  // 5. Gateway Ingress
  app.post('/api/gateway/receive', (req, res) => {
    const envelope: GatewayEnvelope = req.body;
    const result = engine.gateway.receive(envelope);
    res.json(result);
  });

  // 6. Gateway Outgress
  app.post('/api/gateway/outbound', (req, res) => {
    const { channel, content, approved } = req.body;
    const result = engine.gateway.queueOutbound(channel, content, Boolean(approved));
    res.json(result);
  });

  // 7. Channel Configuration Toggle
  app.post('/api/gateway/channels', (req, res) => {
    const spec: ChannelSpec = req.body;
    if (!spec || !spec.channel_id) {
      return res.status(400).json({ error: 'Valid ChannelSpec required' });
    }
    engine.gateway.registerChannel(spec);
    res.json({ success: true, channel: spec });
  });

  // 8. Skill Toggle / Register
  app.post('/api/skills/toggle', (req, res) => {
    const { skill_id, enabled } = req.body;
    const skill = engine.skills.skills.get(skill_id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    skill.enabled = Boolean(enabled);
    res.json({ success: true, skill });
  });

  // 9. Scheduler Register
  app.post('/api/scheduler/register', (req, res) => {
    const task: ScheduledTask = req.body;
    if (!task || !task.schedule_id) {
      return res.status(400).json({ error: 'Valid ScheduledTask required' });
    }
    engine.scheduler.register(task);
    res.json({ success: true, task });
  });

  // 10. Epistemic Reconcile
  app.post('/api/epistemic/reconcile', (req, res) => {
    const evidences: Evidence[] = req.body?.evidences || [];
    const result = reconcile(evidences);
    res.json(result);
  });

  // 11. AI Epistemic Synthesizer (Gemini powered with algorithmic fallback)
  app.post('/api/ai/epistemic-synthesize', async (req, res) => {
    const evidences: Evidence[] = req.body?.evidences || [];
    const baseResult = reconcile(evidences);
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        ...baseResult,
        ai_powered: false,
        model: 'heuristic_reconciliation',
        note: 'Operating in deterministic epistemic mode. To activate Gemini 3.8 Flash, supply GEMINI_API_KEY in environment.'
      });
    }

    try {
      const prompt = `You are the Epistemic Reconciliation Engine for the Positron Autonomous Agent Architecture.
Evaluate these evidence claims:
${JSON.stringify(evidences, null, 2)}

Existing deterministic analysis:
- Contradiction detected: ${baseResult.contradiction}
- Computed confidence: ${baseResult.confidence}
- Synthesized view: ${baseResult.synthesized_view}

Provide a concise (2-3 sentences) critical synthesis evaluating conflicting sources, potential deceptive failure modes, and constitutional epistemic bounds.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });

      return res.json({
        ...baseResult,
        ai_powered: true,
        model: 'gemini-3.8-flash',
        synthesized_view: response.text?.trim() || baseResult.synthesized_view
      });
    } catch (err: any) {
      console.warn('Gemini synthesis failed, using fallback:', err.message);
      return res.json({
        ...baseResult,
        ai_powered: false,
        model: 'heuristic_fallback',
        error: err.message
      });
    }
  });

  // 12. AI Status
  app.get('/api/ai/status', (req, res) => {
    const keyPresent = Boolean(process.env.GEMINI_API_KEY);
    res.json({
      active: keyPresent,
      model: 'gemini-3.8-flash',
      mode: keyPresent ? 'Gemini 3.8 Flash Active' : 'Deterministic Heuristic Mode'
    });
  });

  // 13. Scheduler Trigger Run
  app.post('/api/scheduler/trigger', (req, res) => {
    const { schedule_id } = req.body || {};
    if (!schedule_id) {
      return res.status(400).json({ error: 'schedule_id is required' });
    }
    const dueTask = engine.scheduler.due(schedule_id);
    if (!dueTask) {
      return res.status(404).json({ error: `Scheduled task '${schedule_id}' not found or inactive` });
    }
    // Positron architectural invariant: scheduled tasks enter the exact same 13-stage runtime pipeline
    const runResult = engine.run(dueTask.objective, `scheduler_${schedule_id}`);
    res.json({
      scheduled_task: dueTask,
      execution: runResult
    });
  });

  // 14. Reset Engine State
  app.post('/api/state/reset', (req, res) => {
    engine.reset();
    res.json({ success: true, message: 'Positron engine state successfully reset' });
  });

  // 15. 2026 Ecosystem Catalog
  app.get('/api/ecosystem', (req, res) => {
    const cat = global2026Catalog();
    res.json({
      entries: cat.entries,
      capabilities: Array.from(cat.capabilities())
    });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Positron Global AI running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Positron server:', err);
  process.exit(1);
});
