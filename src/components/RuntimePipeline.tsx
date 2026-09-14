import React, { useState } from 'react';
import { Play, ShieldAlert, CheckCircle2, RotateCcw, Activity, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { RuntimeEvent, Checkpoint } from '../types/positron';

const STAGES = [
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
  'LEARN',
];

interface Props {
  events: RuntimeEvent[];
  checkpoints: Checkpoint[];
  onTriggerRun: (input: string) => Promise<any>;
  activeStage?: string;
  isExecuting: boolean;
  onResetState?: () => Promise<void>;
  onNavigateToGuardian?: () => void;
}

export const RuntimePipeline: React.FC<Props> = ({
  events,
  checkpoints,
  onTriggerRun,
  activeStage,
  isExecuting,
  onResetState,
  onNavigateToGuardian,
}) => {
  const [prompt, setPrompt] = useState('');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [lastResult, setLastResult] = useState<any>(null);
  const [isResetting, setIsResetting] = useState(false);

  const presets = [
    { label: 'Architecture Inquiry', query: 'Explain the Positron 23-layer architecture and governance guarantees' },
    { label: 'Trigger High-Risk Deploy', query: 'Deploy production release v1.4 to production cluster' },
    { label: 'Epistemic Truth Sweep', query: 'Verify multi-source conflicting evidence regarding orbital trajectory' },
    { label: 'Data Scrubbing Task', query: 'Execute purge and scrub of ephemeral session logs' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isExecuting) return;
    const res = await onTriggerRun(prompt);
    if (res) {
      setLastResult(res);
    }
  };

  const handleReset = async () => {
    if (!onResetState) return;
    setIsResetting(true);
    try {
      await onResetState();
      setLastResult(null);
    } finally {
      setIsResetting(false);
    }
  };

  const filteredEvents = filterStage === 'all'
    ? events
    : events.filter((e) => e.stage.toUpperCase() === filterStage);

  return (
    <div id="runtime-pipeline" className="space-y-6">
      {/* 13-Stage Visual Pipeline Ribbon */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-200">
              Positron 13-Stage Runtime Execution Loop
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Bounded Retries: 3 | Zero Direct Tool Access
          </span>
        </div>

        <div className="flex items-center overflow-x-auto pb-2 pt-1 gap-1 text-xs font-mono scrollbar-thin">
          {STAGES.map((stage, idx) => {
            const isActive = activeStage === stage || (isExecuting && activeStage === stage);
            const isGuardian = stage === 'GUARDIAN' || stage === 'AUTHORIZE';
            const isVerify = stage === 'VERIFY';

            return (
              <React.Fragment key={stage}>
                <div
                  className={`flex-shrink-0 px-2.5 py-1.5 rounded border transition-all text-center ${
                    isActive
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200 ring-2 ring-sky-500/40 font-bold scale-105'
                      : isGuardian
                      ? 'bg-amber-950/30 border-amber-800/60 text-amber-300'
                      : isVerify
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-[10px] text-slate-500">{(idx + 1).toString().padStart(2, '0')}</div>
                  <div>{stage}</div>
                </div>
                {idx < STAGES.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Task Execution Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
            <Play className="w-4 h-4 text-emerald-400" />
            <span>Dispatch Agent Task to Positron Engine</span>
          </h3>
          {onResetState && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isResetting || isExecuting}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className={`w-3 h-3 ${isResetting ? 'animate-spin' : ''}`} />
              <span>Reset State</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="prompt-input"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter an objective, tool instruction, or research query..."
              disabled={isExecuting}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <button
              id="dispatch-btn"
              type="submit"
              disabled={isExecuting || !prompt.trim()}
              className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-5 py-2.5 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Path</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(preset.query)}
                className="text-xs bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-md transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </form>

        {/* Dynamic Execution Outcome Card */}
        {lastResult && (
          <div
            className={`mt-4 p-4 rounded-xl border font-mono text-xs transition-all ${
              lastResult.status === 'paused_for_approval'
                ? 'bg-amber-950/40 border-amber-800 text-amber-200'
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10 font-sans">
              <div className="flex items-center space-x-2 font-bold text-sm">
                {lastResult.status === 'paused_for_approval' ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>GUARDIAN ENFORCEMENT: PAUSED FOR APPROVAL</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>EXECUTION COMPLETED VERIFIED</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-3 font-mono text-xs">
                <span className="opacity-70">Task: {lastResult.task_id}</span>
                {lastResult.status === 'paused_for_approval' && onNavigateToGuardian && (
                  <button
                    type="button"
                    onClick={onNavigateToGuardian}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded transition-colors text-xs font-sans"
                  >
                    Open Guardian Console →
                  </button>
                )}
              </div>
            </div>

            <p className="font-sans text-xs opacity-90 leading-relaxed">
              {lastResult.message || lastResult.result?.summary}
            </p>

            {lastResult.approval_record && (
              <div className="mt-2.5 pt-2 border-t border-white/10 text-[11px] space-y-1 opacity-85">
                <div>Tool Target: <span className="font-bold text-amber-300">{lastResult.approval_record.tool_id}</span></div>
                <div>Risk Category: <span className="font-bold uppercase text-red-300">{lastResult.approval_record.risk}</span></div>
                <div>Guardian Justification: {lastResult.approval_record.reason}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Event Journal & Checkpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Event Stream */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-semibold text-slate-200">
                Append-Only Runtime Event Journal ({events.length})
              </h3>
            </div>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1 focus:outline-none"
            >
              <option value="all">All Stages</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No events recorded for selected filter. Execute a task to view real-time runtime events.
              </div>
            ) : (
              filteredEvents.map((evt) => {
                const isAuthRequired = evt.event_type === 'approval_pending';
                const isVerify = evt.event_type === 'verification';

                return (
                  <div
                    key={evt.id}
                    className={`p-3 rounded-lg border font-mono text-xs transition-colors ${
                      isAuthRequired
                        ? 'bg-amber-950/40 border-amber-700/80 text-amber-200'
                        : isVerify
                        ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-200">
                        {evt.stage}
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="leading-relaxed">{evt.message}</div>
                    {evt.details && (
                      <pre className="mt-2 text-[10px] text-slate-400 bg-black/40 p-2 rounded overflow-x-auto">
                        {JSON.stringify(evt.details, null, 2)}
                      </pre>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Durable Checkpoints */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              State Checkpoints ({checkpoints.length})
            </h3>
          </div>

          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1 scrollbar-thin">
            {checkpoints.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No checkpoints stored yet. Checkpoints are recorded on COMMIT and PAUSE transitions.
              </div>
            ) : (
              checkpoints.map((cp) => (
                <div
                  key={cp.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs font-mono"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-emerald-400 font-semibold">{cp.stage}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(cp.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">Task: {cp.task_id}</div>
                  <pre className="mt-2 text-[10px] text-slate-400 bg-black/50 p-2 rounded overflow-x-auto max-h-24">
                    {JSON.stringify(cp.snapshot, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
