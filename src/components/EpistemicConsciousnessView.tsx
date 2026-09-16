import React, { useState } from 'react';
import { ConsciousnessState, EpistemicResult, Evidence, EvidenceStatus } from '../types';
import { Brain, CheckCircle2, AlertOctagon, Plus, Trash2, ShieldCheck, Sparkles, Activity } from 'lucide-react';

interface EpistemicConsciousnessViewProps {
  consciousness: ConsciousnessState;
  evidenceList: Evidence[];
  epistemicResult: EpistemicResult | null;
  onAddEvidence: (claim: string, source: string, status: EvidenceStatus, confidence: number) => void;
  onRemoveEvidence: (index: number) => void;
}

export const EpistemicConsciousnessView: React.FC<EpistemicConsciousnessViewProps> = ({
  consciousness,
  evidenceList,
  epistemicResult,
  onAddEvidence,
  onRemoveEvidence
}) => {
  const [claim, setClaim] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState<EvidenceStatus>('VERIFIED');
  const [confidence, setConfidence] = useState(0.9);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim() || !source.trim()) return;
    onAddEvidence(claim, source, status, confidence);
    setClaim('');
    setSource('');
  };

  return (
    <div className="space-y-6">
      {/* Grid: Epistemic Reconciler (Left) + Consciousness Core (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Epistemic Evidence Reconciler */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-800">
              <Brain className="w-5 h-5 text-sky-400" />
              <h2 className="text-base font-semibold font-mono text-slate-100">
                Epistemic Evidence Reconciler
              </h2>
            </div>

            {/* Reconciliation Output Banner */}
            {epistemicResult && (
              <div
                className={`p-4 rounded-xl border mb-6 font-mono ${
                  epistemicResult.contradiction
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs uppercase flex items-center space-x-1.5">
                    {epistemicResult.contradiction ? (
                      <AlertOctagon className="w-4 h-4 text-amber-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    <span>{epistemicResult.contradiction ? 'CONTRADICTION DETECTED' : 'EPISTEMIC CONSENSUS'}</span>
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-slate-950 rounded font-bold">
                    CONFIDENCE: {Math.round(epistemicResult.confidence * 100)}%
                  </span>
                </div>
                <p className="text-xs text-slate-200">{epistemicResult.synthesizedView}</p>
              </div>
            )}

            {/* Form: Add Evidence */}
            <form onSubmit={handleAdd} className="space-y-3 mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs">
              <h3 className="font-bold text-slate-200">Inject Observational Evidence</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Observational claim (e.g. Array thermal steady)"
                  value={claim}
                  onChange={(e) => setClaim(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-100 rounded p-2 focus:border-sky-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Evidence source (e.g. Telemetry Bus B)"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-100 rounded p-2 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Evidence Status:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as EvidenceStatus)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded p-2 focus:border-sky-500 focus:outline-none"
                  >
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="SUPPORTED">SUPPORTED</option>
                    <option value="UNVERIFIED">UNVERIFIED</option>
                    <option value="REFUTED">REFUTED</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">
                    Confidence Weight: {Math.round(confidence * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={confidence}
                    onChange={(e) => setConfidence(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 mt-2"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!claim.trim() || !source.trim()}
                className="w-full py-2 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 text-slate-950 font-bold rounded flex items-center justify-center space-x-1 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>ADD OBSERVATION CLAIM</span>
              </button>
            </form>

            {/* Evidence List */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase">
                Active Evidence Chain ({evidenceList.length})
              </h4>
              {evidenceList.map((ev, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-100">&quot;{ev.claim}&quot;</span>
                      <span className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-sky-400 rounded">
                        {ev.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Source: {ev.source} | Confidence: {Math.round(ev.confidence * 100)}%
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveEvidence(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subjective Consciousness Core */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-800">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <h2 className="text-base font-semibold font-mono text-slate-100">
                Subjective Consciousness Core
              </h2>
            </div>

            {/* Consciousness State Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-xs">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <span className="text-slate-400 block text-[10px] uppercase">Subjective Status</span>
                <span className="font-bold text-sky-400 text-sm">{consciousness.subjectiveStatus}</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                <span className="text-slate-400 block text-[10px] uppercase">Attended Focus</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {consciousness.attendedFocus || 'global_awareness'}
                </span>
              </div>
            </div>

            {/* Perceived Items Chips */}
            <div className="mb-6 font-mono text-xs">
              <span className="text-slate-400 block mb-2 font-semibold">Perceived Context Items:</span>
              <div className="flex flex-wrap gap-1.5">
                {consciousness.perceivedItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-md text-[11px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Reflections Journal */}
            <div className="mb-6">
              <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase mb-2">
                Reflection Journal Logs ({consciousness.reflections.length})
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
                {consciousness.reflections.map((ref, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-0.5">
                      <span>Stage: {ref.stage}</span>
                      <span>Conf: {Math.round(ref.confidence * 100)}%</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{ref.timestamp.substring(11, 19)} UTC</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Outcome Log */}
            <div>
              <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase mb-2">
                Experience Log (Outcome Matches)
              </h4>
              <div className="max-h-36 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
                {consciousness.experienceLog.map((exp, idx) => (
                  <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className={exp.match ? 'text-emerald-400' : 'text-amber-400'}>
                        {exp.match ? 'MATCH VERIFIED' : 'MISMATCH'}
                      </span>
                      <span className="text-slate-500">{exp.timestamp.substring(11, 19)} UTC</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Action: {exp.action}</p>
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
