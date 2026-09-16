import React, { useState } from 'react';
import { ApprovalRecord, ApprovalStatus, RiskLevel } from '../types';
import { Shield, ShieldAlert, CheckCircle, XCircle, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

interface GuardianApprovalsViewProps {
  approvals: ApprovalRecord[];
  onResolveApproval: (taskId: string, approved: boolean) => void;
}

export const GuardianApprovalsView: React.FC<GuardianApprovalsViewProps> = ({
  approvals,
  onResolveApproval
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  const pendingCount = approvals.filter((a) => a.status === 'PENDING').length;
  const approvedCount = approvals.filter((a) => a.status === 'APPROVED').length;
  const rejectedCount = approvals.filter((a) => a.status === 'REJECTED').length;

  const filteredApprovals = approvals.filter((a) => {
    if (filter === 'ALL') return true;
    return a.status === filter;
  });

  const getRiskBadgeColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MEDIUM':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'IRREVERSIBLE':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase">Total Policy Evaluated</p>
            <p className="text-2xl font-mono font-bold text-slate-100 mt-1">{approvals.length}</p>
          </div>
          <Shield className="w-8 h-8 text-sky-400 opacity-80" />
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-amber-400 uppercase">Pending Authorization</p>
            <p className="text-2xl font-mono font-bold text-amber-400 mt-1">{pendingCount}</p>
          </div>
          <ShieldAlert className="w-8 h-8 text-amber-400 opacity-80" />
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-emerald-400 uppercase">Operator Approved</p>
            <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">{approvedCount}</p>
          </div>
          <ShieldCheck className="w-8 h-8 text-emerald-400 opacity-80" />
        </div>

        <div className="bg-slate-900 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-rose-400 uppercase">Operator Rejected</p>
            <p className="text-2xl font-mono font-bold text-rose-400 mt-1">{rejectedCount}</p>
          </div>
          <XCircle className="w-8 h-8 text-rose-400 opacity-80" />
        </div>
      </div>

      {/* Main Governance Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-semibold font-mono text-slate-100 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-sky-400" />
              <span>Guardian Safety Policy Console</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Human-in-the-loop authorization gates for high-impact autonomous tool dispatches.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                  filter === st
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Approvals List */}
        <div className="space-y-4">
          {filteredApprovals.length === 0 ? (
            <div className="py-12 text-center font-mono text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No authorization records found for filter state &quot;{filter}&quot;.
              {filter === 'ALL' && (
                <p className="mt-1 text-slate-600">
                  Try triggering a high-risk prompt like &quot;Deploy release&quot; or &quot;Purge history&quot; in the Runtime tab.
                </p>
              )}
            </div>
          ) : (
            filteredApprovals.map((record) => (
              <div
                key={record.taskId}
                className={`border rounded-xl p-5 transition-all ${
                  record.status === 'PENDING'
                    ? 'bg-amber-500/5 border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : record.status === 'APPROVED'
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-rose-500/5 border-rose-500/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-slate-400">
                      TASK: {record.taskId}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${getRiskBadgeColor(
                        record.risk
                      )}`}
                    >
                      RISK: {record.risk}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-slate-800 text-sky-400 rounded">
                      TOOL: {record.toolId}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${
                      record.status === 'PENDING'
                        ? 'bg-amber-400 text-slate-950 animate-pulse'
                        : record.status === 'APPROVED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    STATUS: {record.status}
                  </span>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-semibold font-mono text-slate-100">
                    Objective: &quot;{record.objective}&quot;
                  </h4>
                  <div className="mt-2 p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-300">
                    <p className="text-slate-400 font-semibold mb-0.5">Guardian Policy Reason:</p>
                    <p>{record.reason}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
                  <div className="text-[11px] font-mono text-slate-500 flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Created: {record.createdAt.substring(11, 19)} UTC</span>
                    {record.resolvedAt && (
                      <span>| Resolved: {record.resolvedAt.substring(11, 19)} UTC</span>
                    )}
                  </div>

                  {record.status === 'PENDING' && (
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <button
                        onClick={() => onResolveApproval(record.taskId, false)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>REJECT</span>
                      </button>
                      <button
                        onClick={() => onResolveApproval(record.taskId, true)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>AUTHORIZE & EXECUTE</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
