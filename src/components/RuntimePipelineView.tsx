import React, { useState } from 'react';
import { Checkpoint, EngineRunResult, RuntimeEvent } from '../types';
import { Play, RotateCcw, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Activity, Terminal, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RuntimePipelineViewProps {
  events: RuntimeEvent[];
  checkpoints: Checkpoint[];
  activeStage: string;
  isExecuting: boolean;
  lastResult: EngineRunResult | null;
  filterStage: string;
  onFilterStageChange: (stage: string) => void;
  onTriggerRun: (userInput: string) => void;
  onResetState: () => void;
  onNavigateToGuardian: () => void;
}

const ALL_STAGES = [
  'OBSERVE',
  'CONTEXT',
  'REASON',
  'PLAN',
  'RSCL',
  'VALUE/RISK',
  'GUARDIAN',
  'AUTHORIZE',
  'ACT',
  'VERIFY',
  'COMMIT',
  'REFLECT',
  'LEARN'
];

export const RuntimePipelineView: React.FC<RuntimePipelineViewProps> = ({
  events,
  checkpoints,
  activeStage,
  isExecuting,
  lastResult,
  filterStage,
  onFilterStageChange,
  onTriggerRun,
  onResetState,
  onNavigateToGuardian
}) => {
  const [inputPrompt, setInputPrompt] = useState('');

  const samplePrompts = [
    'Run epistemic audit on solar telemetry logs and resolve anomalies',
    'Deploy production v2.6 microservice stack to primary cloud region',
    'Purge all archived agent task states and delete system history',
    'Transfer finance allocation $50,000 for server infrastructure upgrade'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isExecuting) return;
    onTriggerRun(inputPrompt);
  };

  const filteredEvents = filterStage === 'ALL'
    ? events
    : events.filter((e) => e.stage.toUpperCase() === filterStage.toUpperCase());

  return (
    <div className="space-[#space] space-y-6">
      {/* Top Section: Action Prompt Trigger */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-semibold text-slate-100 font-mono">
              Agent Execution Pipeline Trigger
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">13-Stage Autonomous Loop</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Enter task objective for Positron agent runtime..."
              disabled={isExecuting}
              className="flex-1 bg-slate-950 border border-slate-700 focus:border-sky-500 text-slate-100 placeholder-slate-500 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
            />
            <button
              type="submit"
              disabled={isExecuting || !inputPrompt.trim()}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-500 font-mono font-bold text-sm rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md shadow-sky-500/20"
            >
              {isExecuting ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-slate-950" />
                  <span>EXECUTING...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>DISPATCH TASK</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-mono">Quick Test Objectives:</span>
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputPrompt(prompt)}
                className="text-xs font-mono bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-sky-300 px-2.5 py-1 rounded border border-slate-700/60 transition-colors"
              >
                {prompt.length > 38 ? prompt.substring(0, 38) + '...' : prompt}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* 13-Stage Pipeline Status Tracker */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-xs font-mono font-semibold uppercase text-slate-400 mb-3 flex items-center justify-between">
          <span>13-Stage Constitutional Pipeline Flow</span>
          {activeStage && (
            <span className="text-sky-400 font-bold animate-pulse">
              ACTIVE: {activeStage}
            </span>
          )}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-[repeat(13,minmax(0,1fr))] gap-1.5 overflow-x-auto">
          {ALL_STAGES.map((stage, idx) => {
            const isActive = activeStage.toUpperCase() === stage;
            const isCompleted = lastResult && !isExecuting && lastResult.status === 'completed';
            const isPaused = lastResult && lastResult.status === 'paused_for_approval' && stage === 'AUTHORIZE';

            let bgClass = 'bg-slate-950 text-slate-500 border-slate-800';
            if (isActive) {
              bgClass = 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-lg shadow-sky-500/30 scale-105';
            } else if (isPaused) {
              bgClass = 'bg-amber-500 text-slate-950 border-amber-400 font-bold animate-bounce';
            } else if (isCompleted) {
              bgClass = 'bg-slate-800 text-sky-300 border-sky-900/50';
            }

            return (
              <div
                key={stage}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-[10px] font-mono transition-all text-center ${bgClass}`}
              >
                <span className="opacity-60 text-[9px] mb-0.5">#{idx + 1}</span>
                <span className="truncate w-full">{stage}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Result Notification Banner */}
      <AnimatePresence>
        {lastResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              lastResult.status === 'paused_for_approval'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              {lastResult.status === 'paused_for_approval' ? (
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-mono font-bold text-sm">
                  {lastResult.status === 'paused_for_approval'
                    ? 'GOVERNANCE INTERVENTION: HUMAN APPROVAL REQUIRED'
                    : 'PIPELINE EXECUTION COMPLETED'}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 font-mono">
                  {lastResult.message}
                </p>
                {lastResult.approvalRecord && (
                  <p className="text-[11px] opacity-80 mt-1 font-mono">
                    Tool: <span className="underline">{lastResult.approvalRecord.toolId}</span> | Risk:{' '}
                    <span className="font-bold text-amber-400">{lastResult.approvalRecord.risk}</span>
                  </p>
                )}
              </div>
            </div>

            {lastResult.status === 'paused_for_approval' && (
              <button
                onClick={onNavigateToGuardian}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs rounded-lg flex items-center space-x-1.5 transition-colors shrink-0"
              >
                <span>REVIEW IN GUARDIAN CONSOLE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid: Events Stream + Checkpoints Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Stream (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-[520px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-mono font-semibold text-slate-100">
                Runtime Events Audit Stream
              </h3>
              <span className="text-xs text-slate-400 font-mono">({filteredEvents.length} events)</span>
            </div>

            {/* Stage Filter */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-[11px] text-slate-400 font-mono shrink-0">Filter:</span>
              <select
                value={filterStage}
                onChange={(e) => onFilterStageChange(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono rounded px-2.5 py-1 focus:outline-none focus:border-sky-500"
              >
                <option value="ALL">ALL STAGES</option>
                {ALL_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredEvents.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs">
                No runtime events recorded for selected filter stage.
              </div>
            ) : (
              filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-lg p-3 text-xs font-mono transition-colors"
                >
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span className="px-1.5 py-0.5 bg-sky-950 text-sky-400 rounded font-bold">
                      {evt.stage}
                    </span>
                    <span className="text-slate-400">{evt.timestamp.substring(11, 19)} UTC</span>
                  </div>
                  <p className="text-slate-200 mt-1">{evt.message}</p>
                  {evt.details && (
                    <div className="mt-1.5 p-1.5 bg-slate-900/90 rounded text-[11px] text-slate-400 border border-slate-800">
                      {evt.details}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Checkpoints Ledger (1 Col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-[520px]">
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-800">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-mono font-semibold text-slate-100">
              State Checkpoints Ledger
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {checkpoints.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs text-center px-4">
                No durable checkpoints created yet. Dispatch a task to record state snapshots.
              </div>
            ) : (
              checkpoints.map((cp) => (
                <div
                  key={cp.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs font-mono"
                >
                  <div className="flex items-center justify-between text-emerald-400 text-[11px] font-bold">
                    <span>{cp.stage}</span>
                    <span className="text-slate-400">{cp.timestamp.substring(11, 19)} UTC</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-1">{cp.snapshot}</p>
                  <div className="mt-1.5 text-[10px] text-slate-400 font-mono">
                    Task Ref: {cp.taskId} | ID: {cp.id}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
