import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PositronEngine } from './data/positronEngine';
import { PositronTabId, ApprovalStatus, Evidence, EvidenceStatus, AgiStage } from './types';
import { Navbar } from './components/Navbar';
import { TabBar } from './components/TabBar';
import { RuntimePipelineView } from './components/RuntimePipelineView';
import { GuardianApprovalsView } from './components/GuardianApprovalsView';
import { GatewayManagerView } from './components/GatewayManagerView';
import { EcosystemSweepView } from './components/EcosystemSweepView';
import { EpistemicConsciousnessView } from './components/EpistemicConsciousnessView';
import { SkillsSchedulerView } from './components/SkillsSchedulerView';
import { AgiFutureCoreView } from './components/AgiFutureCoreView';

export function App() {
  const engineRef = useRef<PositronEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new PositronEngine();
  }
  const engine = engineRef.current;

  // Active Tab
  const [activeTab, setActiveTab] = useState<PositronTabId>('runtime');

  // React State Synced from PositronEngine
  const [events, setEvents] = useState([...engine.events]);
  const [checkpoints, setCheckpoints] = useState([...engine.checkpoints]);
  const [approvals, setApprovals] = useState(Array.from(engine.approvals.values()));
  const [channels, setChannels] = useState(engine.gateway.getChannels());
  const [skills, setSkills] = useState(engine.skills.getSkills());
  const [schedules, setSchedules] = useState(engine.scheduler.getTasks());
  const [outbox, setOutbox] = useState([...engine.gateway.outbox]);
  const [consciousness, setConsciousness] = useState({ ...engine.consciousness.state });
  
  const [lastRunResult, setLastRunResult] = useState(null as any);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStage, setActiveStage] = useState('');
  const [filterStage, setFilterStage] = useState('ALL');

  // Ecosystem Sweep state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCapability, setSelectedCapability] = useState('ALL');

  // Epistemic Evidence state
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([
    {
      claim: 'Satellite imagery confirms structural integrity of Solar Array 4',
      source: 'Orbital Sentinel 9',
      status: 'VERIFIED',
      confidence: 0.95
    },
    {
      claim: 'Telemetry logs report thermal anomaly on Solar Array 4',
      source: 'Telemetry Bus B',
      status: 'SUPPORTED',
      confidence: 0.88
    }
  ]);
  const [epistemicResult, setEpistemicResult] = useState(() => {
    return engine.consciousness ? engine.consciousness.reflect ? null : null : null;
  });

  // AGI state
  const [agiStage, setAgiStage] = useState<AgiStage>(engine.agi.stage);
  const [agiAlignmentMetrics, setAgiAlignmentMetrics] = useState([...engine.agi.alignmentMetrics]);
  const [agiRsiLogs, setAgiRsiLogs] = useState([...engine.agi.selfImprovementLogs]);
  const [agiSynthesizedGoals, setAgiSynthesizedGoals] = useState([...engine.agi.synthesizedGoals]);

  const syncState = useCallback(() => {
    setEvents([...engine.events]);
    setCheckpoints([...engine.checkpoints]);
    setApprovals(Array.from(engine.approvals.values()));
    setChannels(engine.gateway.getChannels());
    setSkills(engine.skills.getSkills());
    setSchedules(engine.scheduler.getTasks());
    setOutbox([...engine.gateway.outbox]);
    setConsciousness({ ...engine.consciousness.state });

    setAgiStage(engine.agi.stage);
    setAgiAlignmentMetrics([...engine.agi.alignmentMetrics]);
    setAgiRsiLogs([...engine.agi.selfImprovementLogs]);
    setAgiSynthesizedGoals([...engine.agi.synthesizedGoals]);
  }, [engine]);

  // Initial Sync & Epistemic Reconciliation
  useEffect(() => {
    syncState();
  }, [syncState]);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'PENDING').length;

  const handleTriggerRun = (userInput: string) => {
    if (!userInput.trim() || isExecuting) return;
    setIsExecuting(true);

    const stages = ['OBSERVE', 'CONTEXT', 'REASON', 'PLAN', 'RSCL', 'VALUE/RISK', 'GUARDIAN'];
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < stages.length) {
        setActiveStage(stages[idx]);
        idx++;
      } else {
        clearInterval(interval);
        const result = engine.run(userInput);
        if (result.status === 'paused_for_approval') {
          setActiveStage('AUTHORIZE');
        } else {
          setActiveStage('LEARN');
        }

        setLastRunResult(result);
        syncState();

        setTimeout(() => {
          setIsExecuting(false);
          setActiveStage('');
        }, 600);
      }
    }, 120);
  };

  const handleResolveApproval = (taskId: string, approved: boolean) => {
    engine.resolveApproval(taskId, approved);
    syncState();
  };

  const handleToggleChannel = (channelId: string, enabled: boolean) => {
    const current = engine.gateway.getChannels().find((c) => c.channelId === channelId);
    if (current) {
      engine.gateway.updateChannel({ ...current, enabled });
      syncState();
    }
  };

  const handleTestEnvelope = (channel: string, sender: string, content: string, authenticated: boolean) => {
    const envelope = { channel, senderRef: sender, authenticated, content };
    const res = engine.gateway.receive(envelope);
    syncState();
    return res[1];
  };

  const handleToggleSkill = (skillId: string, enabled: boolean) => {
    engine.skills.toggleSkill(skillId, enabled);
    syncState();
  };

  const handleToggleSchedule = (scheduleId: string, enabled: boolean) => {
    engine.scheduler.toggleTask(scheduleId, enabled);
    syncState();
  };

  const handleAddEvidence = (claim: string, source: string, status: EvidenceStatus, confidence: number) => {
    const newEv: Evidence = { claim, source, status, confidence };
    const updated = [...evidenceList, newEv];
    setEvidenceList(updated);
  };

  const handleRemoveEvidence = (index: number) => {
    const updated = evidenceList.filter((_, i) => i !== index);
    setEvidenceList(updated);
  };

  const handleTriggerRsi = () => {
    engine.agi.triggerRecursiveSelfImprovement();
    syncState();
  };

  const handleSynthesizeMacroGoal = (macroObjective: string) => {
    engine.agi.synthesizeGoalFromMacroInput(macroObjective);
    syncState();
  };

  const handleSetAgiStage = (stage: AgiStage) => {
    engine.agi.advanceStage(stage);
    syncState();
  };

  const handleResetState = () => {
    engine.reset();
    setLastRunResult(null);
    syncState();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Header Bar */}
      <Navbar
        pendingApprovalsCount={pendingApprovalsCount}
        onNavigateToGuardian={() => setActiveTab('guardian')}
        onResetState={handleResetState}
      />

      {/* 7 Tab Navigation Bar */}
      <TabBar
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Active Tab Main View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'runtime' && (
          <RuntimePipelineView
            events={events}
            checkpoints={checkpoints}
            activeStage={activeStage}
            isExecuting={isExecuting}
            lastResult={lastRunResult}
            filterStage={filterStage}
            onFilterStageChange={(s) => setFilterStage(s)}
            onTriggerRun={handleTriggerRun}
            onResetState={handleResetState}
            onNavigateToGuardian={() => setActiveTab('guardian')}
          />
        )}

        {activeTab === 'guardian' && (
          <GuardianApprovalsView
            approvals={approvals}
            onResolveApproval={handleResolveApproval}
          />
        )}

        {activeTab === 'gateway' && (
          <GatewayManagerView
            channels={channels}
            outbox={outbox}
            onToggleChannel={handleToggleChannel}
            onTestEnvelope={handleTestEnvelope}
          />
        )}

        {activeTab === 'ecosystem' && (
          <EcosystemSweepView
            searchQuery={searchQuery}
            onSearchQueryChange={(q) => setSearchQuery(q)}
            selectedCategory={selectedCategory}
            onSelectedCategoryChange={(c) => setSelectedCategory(c)}
            selectedCapability={selectedCapability}
            onSelectedCapabilityChange={(cap) => setSelectedCapability(cap)}
          />
        )}

        {activeTab === 'epistemic' && (
          <EpistemicConsciousnessView
            consciousness={consciousness}
            evidenceList={evidenceList}
            epistemicResult={epistemicResult}
            onAddEvidence={handleAddEvidence}
            onRemoveEvidence={handleRemoveEvidence}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsSchedulerView
            skills={skills}
            schedules={schedules}
            onToggleSkill={handleToggleSkill}
            onToggleSchedule={handleToggleSchedule}
          />
        )}

        {activeTab === 'agi' && (
          <AgiFutureCoreView
            currentStage={agiStage}
            alignmentMetrics={agiAlignmentMetrics}
            rsiLogs={agiRsiLogs}
            synthesizedGoals={agiSynthesizedGoals}
            onTriggerRsi={handleTriggerRsi}
            onSynthesizeMacroGoal={handleSynthesizeMacroGoal}
            onStageSelect={handleSetAgiStage}
          />
        )}
      </main>
    </div>
  );
}
