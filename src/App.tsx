import React, { useState, useEffect } from 'react';
import {
  Shield,
  Activity,
  Network,
  Globe,
  Brain,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers
} from 'lucide-react';
import {
  ApprovalRecord,
  ChannelSpec,
  Checkpoint,
  ConsciousnessState,
  EcosystemEntry,
  Evidence,
  RuntimeEvent,
  ScheduledTask,
  SkillSpec
} from './types/positron';
import { RuntimePipeline } from './components/RuntimePipeline';
import { GuardianApprovals } from './components/GuardianApprovals';
import { GatewayManager } from './components/GatewayManager';
import { EcosystemSweep } from './components/EcosystemSweep';
import { EpistemicConsciousness } from './components/EpistemicConsciousness';
import { SkillsScheduler } from './components/SkillsScheduler';

type Tab = 'runtime' | 'guardian' | 'gateway' | 'ecosystem' | 'epistemic' | 'skills';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('runtime');
  const [loading, setLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [activeStage, setActiveStage] = useState<string>('');

  // State
  const [stats, setStats] = useState({
    total_tasks: 0,
    pending_approvals: 0,
    events_count: 0,
    channels_active: 0,
    catalog_count: 0,
    checkpoints_count: 0,
  });
  const [events, setEvents] = useState<RuntimeEvent[]>([]);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRecord[]>([]);
  const [channels, setChannels] = useState<ChannelSpec[]>([]);
  const [skills, setSkills] = useState<SkillSpec[]>([]);
  const [schedules, setSchedules] = useState<ScheduledTask[]>([]);
  const [outbox, setOutbox] = useState<any[]>([]);
  const [consciousness, setConsciousness] = useState<ConsciousnessState>({
    subjective_consciousness_status: 'not established',
    attended_focus: null,
    perceived_items: [],
    reflections: [],
    experience_log: [],
  });
  const [catalogEntries, setCatalogEntries] = useState<EcosystemEntry[]>([]);
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [systemHealthy, setSystemHealthy] = useState<boolean>(true);

  // Fetch state
  const refreshState = async () => {
    try {
      const [stateRes, ecoRes, healthRes] = await Promise.all([
        fetch('/api/state'),
        fetch('/api/ecosystem'),
        fetch('/health')
      ]);

      if (stateRes.ok) {
        const data = await stateRes.json();
        setStats(data.stats);
        setEvents(data.events || []);
        setCheckpoints(data.checkpoints || []);
        setApprovals(data.approvals || []);
        setChannels(data.channels || []);
        setSkills(data.skills || []);
        setSchedules(data.schedules || []);
        setOutbox(data.outbox || []);
        if (data.consciousness) setConsciousness(data.consciousness);
      }

      if (ecoRes.ok) {
        const eco = await ecoRes.json();
        setCatalogEntries(eco.entries || []);
        setCapabilities(eco.capabilities || []);
      }

      if (healthRes.ok) {
        setSystemHealthy(true);
      }
    } catch (err) {
      console.error('Failed to sync Positron state:', err);
      setSystemHealthy(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshState();
    const interval = setInterval(refreshState, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleTriggerRun = async (userInput: string) => {
    setIsExecuting(true);
    setActiveStage('OBSERVE');

    // Simulate pipeline stage progression visual cue
    const stageSequence = ['OBSERVE', 'CONTEXT', 'REASON', 'PLAN', 'RSCL', 'VALUE/RISK', 'GUARDIAN'];
    let currentIdx = 0;
    const timer = setInterval(() => {
      if (currentIdx < stageSequence.length) {
        setActiveStage(stageSequence[currentIdx]);
        currentIdx++;
      }
    }, 180);

    try {
      const res = await fetch('/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: userInput, session_id: 'console_user' }),
      });
      const data = await res.json();

      if (data.status === 'paused_for_approval') {
        setActiveStage('AUTHORIZE');
      } else {
        setActiveStage('LEARN');
      }

      await refreshState();
      return data;
    } catch (err) {
      console.error('Execution error:', err);
    } finally {
      clearInterval(timer);
      setTimeout(() => {
        setIsExecuting(false);
        setActiveStage('');
      }, 800);
    }
  };

  const handleResolveApproval = async (taskId: string, approved: boolean) => {
    setIsResolving(true);
    try {
      await fetch('/approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, approved }),
      });
      await refreshState();
    } finally {
      setIsResolving(false);
    }
  };

  const handleToggleChannel = async (spec: ChannelSpec) => {
    await fetch('/api/gateway/channels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spec),
    });
    await refreshState();
  };

  const handleTestEnvelope = async (channel: string, sender: string, content: string, auth: boolean) => {
    const res = await fetch('/api/gateway/receive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel,
        sender_ref: sender,
        content,
        authenticated: auth,
      }),
    });
    await refreshState();
    return res.json();
  };

  const handleToggleSkill = async (skillId: string, enabled: boolean) => {
    await fetch('/api/skills/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill_id: skillId, enabled }),
    });
    await refreshState();
  };

  const handleReconcile = async (evidences: Evidence[]) => {
    const res = await fetch('/api/epistemic/reconcile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evidences }),
    });
    return res.json();
  };

  const handleAiSynthesize = async (evidences: Evidence[]) => {
    const res = await fetch('/api/ai/epistemic-synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evidences }),
    });
    return res.json();
  };

  const handleResetState = async () => {
    await fetch('/api/state/reset', { method: 'POST' });
    await refreshState();
  };

  const handleTriggerSchedule = async (scheduleId: string) => {
    const res = await fetch('/api/scheduler/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedule_id: scheduleId }),
    });
    const data = await res.json();
    await refreshState();
    return data;
  };

  const handleTestOutbound = async (channel: string, content: string, approved: boolean) => {
    const res = await fetch('/api/gateway/outbound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, content, approved }),
    });
    const data = await res.json();
    await refreshState();
    return data;
  };

  const pendingCount = stats.pending_approvals;

  return (
    <div id="positron-app" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold tracking-tight text-white">POSITRON</h1>
                <span className="text-[10px] bg-slate-800 text-sky-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                  v1.0 MASTER CORE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Autonomous Architecture & Governance Runtime
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${systemHealthy ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
              <span className="text-slate-300">{systemHealthy ? 'PORT 3000 ACTIVE' : 'CONNECTING...'}</span>
            </div>

            {pendingCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('guardian')}
                className="flex items-center space-x-1.5 bg-amber-950/80 text-amber-300 border border-amber-800 px-3 py-1.5 rounded-lg font-bold animate-bounce"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{pendingCount} APPROVAL NEEDED</span>
              </button>
            )}

            <button
              type="button"
              onClick={refreshState}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh State"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex space-x-1 overflow-x-auto text-xs font-medium scrollbar-thin">
          <button
            type="button"
            onClick={() => setActiveTab('runtime')}
            className={`flex items-center space-x-2 px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'runtime'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>13-Stage Runtime Loop</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guardian')}
            className={`flex items-center space-x-2 px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'guardian'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Guardian & Approvals</span>
            {pendingCount > 0 && (
              <span className="ml-1 bg-amber-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gateway')}
            className={`flex items-center space-x-2 px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'gateway'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Gateway & Channels ({channels.filter((c) => c.enabled).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ecosystem')}
            className={`flex items-center space-x-2 px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'ecosystem'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>2026 AI Ecosystem Sweep ({catalogEntries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('epistemic')}
            className={`flex items-center space-x-2 px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'epistemic'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Epistemic & Consciousness</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`flex items-center space-x-2 px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'skills'
                ? 'border-sky-400 text-sky-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Skills & Scheduler</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono">Initializing Positron Runtime Subsystems...</span>
          </div>
        ) : (
          <>
            {activeTab === 'runtime' && (
              <RuntimePipeline
                events={events}
                checkpoints={checkpoints}
                onTriggerRun={handleTriggerRun}
                activeStage={activeStage}
                isExecuting={isExecuting}
                onResetState={handleResetState}
                onNavigateToGuardian={() => setActiveTab('guardian')}
              />
            )}

            {activeTab === 'guardian' && (
              <GuardianApprovals
                approvals={approvals}
                onResolveApproval={handleResolveApproval}
                isResolving={isResolving}
              />
            )}

            {activeTab === 'gateway' && (
              <GatewayManager
                channels={channels}
                outbox={outbox}
                onToggleChannel={handleToggleChannel}
                onTestEnvelope={handleTestEnvelope}
                onTestOutbound={handleTestOutbound}
              />
            )}

            {activeTab === 'ecosystem' && (
              <EcosystemSweep
                entries={catalogEntries}
                capabilities={capabilities}
              />
            )}

            {activeTab === 'epistemic' && (
              <EpistemicConsciousness
                consciousness={consciousness}
                onReconcile={handleReconcile}
                onAiSynthesize={handleAiSynthesize}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsScheduler
                skills={skills}
                schedules={schedules}
                onToggleSkill={handleToggleSkill}
                onTriggerSchedule={handleTriggerSchedule}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500 font-mono">
        Positron Global AI Architecture &bull; 23-Layer Governance &bull; Master Reference Implementation &bull; Host: 0.0.0.0:3000
      </footer>
    </div>
  );
}
