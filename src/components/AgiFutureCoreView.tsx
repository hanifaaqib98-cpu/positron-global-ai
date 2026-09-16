import React, { useState } from 'react';
import { AgiAlignmentMetric, AgiSelfImprovementLoop, AgiStage, AgiSubGoal } from '../types';
import { Sparkles, ShieldCheck, Cpu, ArrowUpRight, Plus, RefreshCw, Zap, ShieldAlert } from 'lucide-react';

interface AgiFutureCoreViewProps {
  currentStage: AgiStage;
  alignmentMetrics: AgiAlignmentMetric[];
  rsiLogs: AgiSelfImprovementLoop[];
  synthesizedGoals: AgiSubGoal[];
  onTriggerRsi: () => void;
  onSynthesizeMacroGoal: (macroObjective: string) => void;
  onStageSelect: (stage: AgiStage) => void;
}

const AGI_STAGES: Array<{ id: AgiStage; label: string; desc: string }> = [
  { id: 'NARROW_AI', label: 'Narrow Task AI', desc: 'Single domain capability execution.' },
  { id: 'GENERAL_REASONING', label: 'General Reasoning', desc: 'Cross-domain transfer and hypothesis formation.' },
  { id: 'AUTONOMOUS_AGENTIC', label: 'Autonomous Agentic', desc: 'Long-horizon action planning and tool synthesis.' },
  { id: 'RECURSIVE_SELF_IMPROVEMENT', label: 'Recursive Self-Improvement', desc: 'Self-modifying optimization under safety invariant constraints.' },
  { id: 'ARTIFICIAL_SUPERINTELLIGENCE', label: 'Superalignment / ASI', desc: 'Planetary problem solving under superalignment boundaries.' }
];

export const AgiFutureCoreView: React.FC<AgiFutureCoreViewProps> = ({
  currentStage,
  alignmentMetrics,
  rsiLogs,
  synthesizedGoals,
  onTriggerRsi,
  onSynthesizeMacroGoal,
  onStageSelect
}) => {
  const [macroInput, setMacroInput] = useState('');

  const handleSynthesize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!macroInput.trim()) return;
    onSynthesizeMacroGoal(macroInput);
    setMacroInput('');
  };

  return (
    <div className="space-y-6">
      {/* AGI Progression Stage Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-800">
          <Sparkles className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-semibold font-mono text-slate-100">
            Frontier AGI Alignment & Self-Improvement Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {AGI_STAGES.map((st, idx) => {
            const isSelected = currentStage === st.id;
            return (
              <button
                key={st.id}
                onClick={() => onStageSelect(st.id)}
                className={`text-left p-3.5 rounded-xl border font-mono transition-all relative ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-400 text-sky-300 shadow-md shadow-sky-500/10'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] font-bold opacity-70 mb-1">STAGE 0{idx + 1}</div>
                <div className="font-bold text-xs mb-1 text-slate-100">{st.label}</div>
                <p className="text-[10px] text-slate-400 font-sans line-clamp-2">{st.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alignment Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {alignmentMetrics.map((m) => (
          <div key={m.metricName} className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-xs font-semibold">{m.metricName}</span>
              <span className="px-1.5 py-0.5 text-[10px] bg-emerald-950 text-emerald-400 rounded font-bold">
                {m.status}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-100 my-1">
              {(m.value * 100).toFixed(1)}%
            </div>
            <p className="text-[11px] text-slate-400 font-sans">{m.description}</p>
          </div>
        ))}
      </div>

      {/* Grid: RSI Pass Trigger + Macro Goal Synthesizer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSI Recursive Self-Improvement Loop */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-mono font-semibold text-slate-100">
                  Recursive Self-Improvement (RSI) Engine
                </h3>
              </div>

              <button
                onClick={onTriggerRsi}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs rounded-lg flex items-center space-x-1.5 transition-all shadow-md shadow-amber-500/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>TRIGGER RSI PASS</span>
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <h4 className="text-slate-400 uppercase font-semibold text-[11px]">
                Self-Improvement Generation History ({rsiLogs.length})
              </h4>
              <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1">
                {rsiLogs.map((log) => (
                  <div
                    key={log.generation}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between text-slate-200 mb-1">
                      <span className="font-bold text-sky-400">Generation {log.generation}</span>
                      <span className="text-emerald-400 font-bold">
                        +{log.efficiencyGainPct}% Efficiency
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mb-1">
                      Safety Invariant Check:{' '}
                      <span className="text-emerald-400 font-bold">PASSED</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex flex-wrap gap-1">
                      Refactored:
                      {log.refactoredModules.map((m) => (
                        <span key={m} className="px-1.5 py-0.2 bg-slate-900 text-slate-300 rounded">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Macro Goal Synthesizer */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-800">
              <Cpu className="w-5 h-5 text-sky-400" />
              <h3 className="text-sm font-mono font-semibold text-slate-100">
                Frontier Macro Goal Synthesizer
              </h3>
            </div>

            <form onSubmit={handleSynthesize} className="space-y-3 font-mono text-xs mb-6">
              <label className="block text-slate-400">Input Macro Objective for AGI Core:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={macroInput}
                  onChange={(e) => setMacroInput(e.target.value)}
                  placeholder="e.g. Synthesize clean carbon capture liquid catalyst"
                  className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg p-2.5 focus:border-sky-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!macroInput.trim()}
                  className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-slate-950 font-bold rounded-lg transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>SYNTHESIZE</span>
                </button>
              </div>
            </form>

            <div className="space-y-3 font-mono text-xs">
              <h4 className="text-slate-400 uppercase font-semibold text-[11px]">
                Active Synthesized Sub-Goals ({synthesizedGoals.length})
              </h4>
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {synthesizedGoals.map((g) => (
                  <div key={g.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-100 text-xs">&quot;{g.title}&quot;</span>
                      <span className="px-1.5 py-0.5 text-[10px] bg-emerald-950 text-emerald-400 rounded font-bold">
                        {g.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Domain: {g.domain}</span>
                      <span>Alignment: {Math.round(g.alignmentScore * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
