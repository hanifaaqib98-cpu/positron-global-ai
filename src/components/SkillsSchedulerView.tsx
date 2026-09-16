import React from 'react';
import { ScheduledTask, SkillSpec } from '../types';
import { Wrench, Calendar, Shield, Clock, CheckCircle2 } from 'lucide-react';

interface SkillsSchedulerViewProps {
  skills: SkillSpec[];
  schedules: ScheduledTask[];
  onToggleSkill: (skillId: string, enabled: boolean) => void;
  onToggleSchedule: (scheduleId: string, enabled: boolean) => void;
}

export const SkillsSchedulerView: React.FC<SkillsSchedulerViewProps> = ({
  skills,
  schedules,
  onToggleSkill,
  onToggleSchedule
}) => {
  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
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
      {/* Installed Agent Skills Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-800">
          <Wrench className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-semibold font-mono text-slate-100">
            Registered Agent Capabilities & Skills Registry
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.skillId}
              className={`border rounded-xl p-5 transition-all ${
                skill.enabled
                  ? 'bg-slate-950 border-slate-700/80 shadow-md'
                  : 'bg-slate-950/40 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-100 text-sm">
                    {skill.skillId}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${getRiskBadgeColor(
                      skill.risk
                    )}`}
                  >
                    RISK: {skill.risk}
                  </span>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={skill.enabled}
                    onChange={(e) => onToggleSkill(skill.skillId, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                </label>
              </div>

              <p className="text-xs text-slate-300 font-sans mb-3">{skill.description}</p>

              <div className="space-y-1.5 font-mono text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                <div className="flex items-center justify-between">
                  <span>Scope:</span>
                  <span className="text-slate-200">{skill.permissionScope}</span>
                </div>
                <div>
                  <span className="block mb-1">Tools:</span>
                  <div className="flex flex-wrap gap-1">
                    {skill.toolIds.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-sky-400 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Autonomous Scheduled Cron Jobs Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-800">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-semibold font-mono text-slate-100">
            Autonomous Scheduled Tasks & Cron Schedules
          </h2>
        </div>

        <div className="space-y-4">
          {schedules.map((sch) => (
            <div
              key={sch.scheduleId}
              className={`border rounded-xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                sch.enabled
                  ? 'bg-slate-950 border-slate-700/80'
                  : 'bg-slate-950/40 border-slate-800 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2 mb-1 font-mono text-xs">
                  <span className="font-bold text-slate-100 uppercase">{sch.scheduleId}</span>
                  <span className="px-2 py-0.5 bg-sky-950 text-sky-400 border border-sky-800/50 rounded text-[10px]">
                    CADENCE: {sch.cadence}
                  </span>
                  {sch.requiresApproval && (
                    <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800/50 rounded text-[10px]">
                      HUMAN APPROVAL MANDATED
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-sans">{sch.objective}</p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-xs font-mono text-slate-400">
                  {sch.enabled ? 'ACTIVE' : 'DISABLED'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sch.enabled}
                    onChange={(e) => onToggleSchedule(sch.scheduleId, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
