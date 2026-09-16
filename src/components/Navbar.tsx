import React from 'react';
import { Cpu, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

interface NavbarProps {
  pendingApprovalsCount: number;
  onNavigateToGuardian: () => void;
  onResetState: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  pendingApprovalsCount,
  onNavigateToGuardian,
  onResetState
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-sky-400 flex items-center justify-center text-slate-950 font-mono font-extrabold text-lg shadow-md shadow-sky-500/20">
            P
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold text-sm sm:text-base text-slate-100 tracking-wider">
                POSITRON GLOBAL AI
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-medium bg-sky-950/80 text-sky-400 border border-sky-800/50 rounded">
                2026 REF PLATFORM
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              2026 Autonomous Agent Reference Engine & Governance
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {pendingApprovalsCount > 0 && (
            <button
              onClick={onNavigateToGuardian}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold rounded-lg transition-colors animate-pulse"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{pendingApprovalsCount} PENDING APPROVAL{pendingApprovalsCount > 1 ? 'S' : ''}</span>
            </button>
          )}

          <button
            onClick={onResetState}
            title="Reset Positron Engine State"
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Engine</span>
          </button>
        </div>
      </div>
    </header>
  );
};
