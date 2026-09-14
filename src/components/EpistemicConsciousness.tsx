import React, { useState } from 'react';
import { Brain, Scale, Plus, Trash2, CheckCircle2, AlertOctagon, HelpCircle, Sparkles } from 'lucide-react';
import { ConsciousnessState, Evidence, EpistemicReconciliationResult } from '../types/positron';

interface Props {
  consciousness: ConsciousnessState;
  onReconcile: (evidences: Evidence[]) => Promise<EpistemicReconciliationResult>;
  onAiSynthesize?: (evidences: Evidence[]) => Promise<any>;
}

export const EpistemicConsciousness: React.FC<Props> = ({ consciousness, onReconcile, onAiSynthesize }) => {
  const [evidences, setEvidences] = useState<Evidence[]>([
    { claim: 'System state checkpoint verified in cold ledger', source: 'LedgerService_v1', status: 'verified', confidence: 0.96 },
    { claim: 'External sensor indicates memory mismatch in block 0x3', source: 'AuditTelemetry_v2', status: 'supported', confidence: 0.82 },
  ]);

  const [reconcileResult, setReconcileResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);

  const handleAddEvidence = () => {
    setEvidences([
      ...evidences,
      { claim: '', source: 'ManualInput', status: 'supported', confidence: 0.8 },
    ]);
  };

  const handleRemove = (idx: number) => {
    setEvidences(evidences.filter((_, i) => i !== idx));
  };

  const handleUpdate = (idx: number, field: keyof Evidence, val: any) => {
    const updated = [...evidences];
    updated[idx] = { ...updated[idx], [field]: val };
    setEvidences(updated);
  };

  const runReconciliation = async () => {
    setIsEvaluating(true);
    try {
      const res = await onReconcile(evidences);
      setReconcileResult(res);
    } finally {
      setIsEvaluating(false);
    }
  };

  const runAiSynthesis = async () => {
    if (!onAiSynthesize) return;
    setIsAiEvaluating(true);
    try {
      const res = await onAiSynthesize(evidences);
      setReconcileResult(res);
    } finally {
      setIsAiEvaluating(false);
    }
  };

  return (
    <div id="epistemic-consciousness" className="space-y-6">
      {/* Epistemic Reconciliation Module */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Epistemic Core & Contradiction Resolution
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Truth-seeking & Contradiction Detection
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Epistemic certainty is explicitly revisable. When conflicting claims or refuted sources are detected,
          the engine drastically downgrades epistemic confidence (dropping below 50%) to prevent hallucinated consensus.
        </p>

        {/* Evidence List */}
        <div className="space-y-3 mb-4">
          {evidences.map((ev, idx) => (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg flex flex-col md:flex-row items-center gap-3 text-xs"
            >
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="Proposition or observational claim..."
                  value={ev.claim}
                  onChange={(e) => handleUpdate(idx, 'claim', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Source"
                  value={ev.source}
                  onChange={(e) => handleUpdate(idx, 'source', e.target.value)}
                  className="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-200"
                />

                <select
                  value={ev.status}
                  onChange={(e) => handleUpdate(idx, 'status', e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-slate-200"
                >
                  <option value="verified">Verified</option>
                  <option value="supported">Supported</option>
                  <option value="unverified">Unverified</option>
                  <option value="refuted">Refuted</option>
                </select>

                <div className="flex items-center space-x-1 font-mono text-slate-400">
                  <span>{(ev.confidence * 100).toFixed(0)}%</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ev.confidence}
                    onChange={(e) => handleUpdate(idx, 'confidence', parseFloat(e.target.value))}
                    className="w-16 accent-sky-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleAddEvidence}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Observational Claim</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={isEvaluating || isAiEvaluating || evidences.length === 0}
              onClick={runReconciliation}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors flex items-center space-x-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isEvaluating ? 'Reconciling...' : 'Algorithmic Reconcile'}</span>
            </button>

            {onAiSynthesize && (
              <button
                type="button"
                disabled={isEvaluating || isAiEvaluating || evidences.length === 0}
                onClick={runAiSynthesis}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center space-x-1.5 shadow-md shadow-purple-900/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiEvaluating ? 'Synthesizing...' : 'Gemini AI Synthesis'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Result */}
        {reconcileResult && (
          <div
            className={`mt-4 p-4 rounded-lg border text-xs font-mono ${
              reconcileResult.contradiction
                ? 'bg-amber-950/40 border-amber-800 text-amber-200'
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 font-bold mb-2">
              <div className="flex items-center space-x-2">
                {reconcileResult.contradiction ? (
                  <AlertOctagon className="w-4 h-4 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>
                  {reconcileResult.contradiction ? 'CONTRADICTION DETECTED' : 'EPISTEMIC CONSENSUS'}
                </span>
                {reconcileResult.ai_powered && (
                  <span className="text-[10px] bg-purple-900/80 text-purple-200 border border-purple-700 px-2 py-0.5 rounded flex items-center space-x-1 font-sans font-normal">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Gemini 3.8 Flash</span>
                  </span>
                )}
              </div>
              <span className="font-mono text-sm">
                Confidence: {(reconcileResult.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <p className="font-sans leading-relaxed text-slate-200">{reconcileResult.synthesized_view}</p>
            {reconcileResult.note && (
              <div className="mt-2 text-[10px] text-slate-400 font-mono opacity-80 border-t border-white/10 pt-1.5">
                {reconcileResult.note}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Consciousness & Self-Model Core */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center space-x-2 mb-3">
          <Brain className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-semibold text-slate-100">
            Consciousness Core & Self-Model Introspection
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
            <span className="text-slate-500 block text-[10px] uppercase">Subjective Consciousness</span>
            <span className="text-amber-400 font-bold text-sm">
              {consciousness.subjective_consciousness_status}
            </span>
            <p className="text-[10px] text-slate-500 mt-2 font-sans">
              Rigorous philosophical boundary: AI does not claim phenomenal consciousness.
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
            <span className="text-slate-500 block text-[10px] uppercase">Attended Focus</span>
            <span className="text-sky-300 font-bold text-sm">
              {consciousness.attended_focus || 'unfocused'}
            </span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg">
            <span className="text-slate-500 block text-[10px] uppercase">Perceived Items</span>
            <span className="text-slate-300 font-bold text-sm">
              {consciousness.perceived_items.length} active perceptions
            </span>
          </div>
        </div>

        {/* Reflection Log */}
        <div className="mt-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Metacognitive Reflection Stream
          </h3>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs font-mono">
            {consciousness.reflections.length === 0 ? (
              <div className="text-slate-500 text-xs py-3 text-center">
                No reflections logged yet.
              </div>
            ) : (
              consciousness.reflections.map((r, i) => (
                <div key={i} className="bg-slate-950/40 p-2 rounded border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-300">Stage: {r.stage}</span>
                  <span className="text-purple-300">Confidence: {(r.confidence * 100).toFixed(0)}%</span>
                  <span className="text-slate-500 text-[10px]">{new Date(r.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
