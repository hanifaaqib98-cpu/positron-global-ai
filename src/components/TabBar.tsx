import React from 'react';
import { PositronTabId } from '../types';
import { Gauge, Shield, Radio, Globe, Brain, Wrench, Sparkles } from 'lucide-react';

interface TabBarProps {
  activeTab: PositronTabId;
  onTabChange: (tab: PositronTabId) => void;
  pendingApprovalsCount: number;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  pendingApprovalsCount
}) => {
  const tabs: Array<{ id: PositronTabId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }> = [
    { id: 'runtime', label: 'Runtime Pipeline', icon: Gauge },
    { id: 'guardian', label: 'Guardian Safety', icon: Shield, badge: pendingApprovalsCount },
    { id: 'gateway', label: 'Gateway Hub', icon: Radio },
    { id: 'ecosystem', label: '2026 Ecosystem Sweep', icon: Globe },
    { id: 'epistemic', label: 'Epistemic & Consciousness', icon: Brain },
    { id: 'skills', label: 'Skills & Scheduler', icon: Wrench },
    { id: 'agi', label: 'AGI Core', icon: Sparkles }
  ];

  return (
    <nav className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-16 z-40 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap relative ${
                isActive
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono font-bold bg-amber-500 text-slate-950 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
