import React from 'react';
import { ShieldAlert, CheckCircle, XCircle, Clock, AlertTriangle, Lock } from 'lucide-react';
import { ApprovalRecord } from '../types/positron';

interface Props {
  approvals: ApprovalRecord[];
  onResolveApproval: (taskId: string, approved: boolean) => Promise<void>;
  isResolving: boolean;
}

export const GuardianApprovals: React.FC<Props> = ({
  approvals,
  onResolveApproval,
  isResolving,
}) => {
  const pendingApprovals = approvals.filter((a) => a.status === 'pending');
  const resolvedApprovals = approvals.filter((a) => a.status !== 'pending');

  return (
    <div id="guardian-approvals" className="space-y-6">
      {/* Policy Boundary Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 rounded-xl p-5 shadow-lg flex items-start space-x-4">
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 mt-0.5">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-100">
            Guardian Authorization Core (Human-in-the-Loop)
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
            Hard architectural isolation: Autonomous models and background schedulers cannot grant
            themselves permissions or bypass Guardian policies. Actions classified as high risk or
            irreversible remain strictly halted until an authorized human decision is submitted.
          </p>
        </div>
      </div>

      {/* Pending Approvals Queue */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              Pending Authorization Queue ({pendingApprovals.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {pendingApprovals.length === 0 ? 'Queue Clear' : 'Action Required'}
          </span>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-lg">
            <CheckCircle className="w-8 h-8 text-emerald-500/60 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              No pending approvals. To trigger an authorization hold, dispatch a high-risk action
              (e.g., "Deploy production release" or "Delete ephemeral logs") in the Runtime tab.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApprovals.map((req) => (
              <div
                key={req.task_id}
                className="bg-slate-950 border border-amber-700/60 rounded-lg p-4 font-mono text-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-800">
                      TASK: {req.task_id}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 uppercase font-semibold border border-red-800">
                      RISK: {req.risk}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[10px] flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(req.created_at).toLocaleTimeString()}</span>
                  </span>
                </div>

                <div>
                  <div className="text-slate-400 text-[11px]">Requested Objective:</div>
                  <div className="text-slate-100 font-medium mt-0.5">{req.objective}</div>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  <div className="text-slate-400 text-[10px] uppercase font-semibold">Guardian Policy Evaluation:</div>
                  <div className="text-amber-200 mt-1">{req.reason}</div>
                  <div className="text-slate-500 text-[10px] mt-1">
                    Target Tool: <span className="text-sky-300">{req.tool_id}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-1">
                  <button
                    type="button"
                    disabled={isResolving}
                    onClick={() => onResolveApproval(req.task_id, false)}
                    className="px-3.5 py-1.5 rounded-lg border border-red-800/80 bg-red-950/40 hover:bg-red-900/60 text-red-300 font-sans font-medium flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Deny & Abort</span>
                  </button>
                  <button
                    type="button"
                    disabled={isResolving}
                    onClick={() => onResolveApproval(req.task_id, true)}
                    className="px-4 py-1.5 rounded-lg border border-emerald-700 bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-medium flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Authorize Execution</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved Approvals Audit History */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">
          Guardian Authorization Audit Trail ({resolvedApprovals.length})
        </h3>

        {resolvedApprovals.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No historical authorizations logged in this session yet.
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
            {resolvedApprovals.map((req) => (
              <div
                key={req.task_id}
                className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs font-mono flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        req.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-red-950 text-red-300 border border-red-800'
                      }`}
                    >
                      {req.status.toUpperCase()}
                    </span>
                    <span className="text-slate-300 font-medium">{req.objective}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Tool: {req.tool_id} | Risk: {req.risk} | Resolved: {req.resolved_at ? new Date(req.resolved_at).toLocaleTimeString() : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
