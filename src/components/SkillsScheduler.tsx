import React, { useState } from 'react';
import { Wrench, Calendar, Clock, Check, AlertCircle, Shield, Play } from 'lucide-react';
import { SkillSpec, ScheduledTask } from '../types/positron';

interface Props {
  skills: SkillSpec[];
  schedules: ScheduledTask[];
  onToggleSkill: (skillId: string, enabled: boolean) => Promise<void>;
  onTriggerSchedule?: (scheduleId: string) => Promise<any>;
}

export const SkillsScheduler: React.FC<Props> = ({ skills, schedules, onToggleSkill, onTriggerSchedule }) => {
  const [triggeringId, setTriggeringId] = useState<string | null>(null);
  const [lastFeedback, setLastFeedback] = useState<{ id: string; msg: string; status: string } | null>(null);

  const handleRunNow = async (id: string) => {
    if (!onTriggerSchedule) return;
    setTriggeringId(id);
    try {
      const res = await onTriggerSchedule(id);
      if (res?.execution) {
        setLastFeedback({
          id,
          msg: `Dispatched: Status=${res.execution.status}, Task=${res.execution.task_id}`,
          status: res.execution.status
        });
      }
    } catch (err: any) {
      setLastFeedback({ id, msg: `Execution error: ${err.message}`, status: 'error' });
    } finally {
      setTriggeringId(null);
    }
  };
  return (
    <div id="skills-scheduler" className="space-y-6">
      {/* Skill Registry */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Positron Skill & Tool Capability Registry
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {skills.filter((s) => s.enabled).length} of {skills.length} Active
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Every tool declares its capability scope, risk rating, timeout, and audit requirements.
          Models cannot invoke tools directly without passing through SkillRegistry validation and Guardian policy checks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => {
            const isHighRisk = skill.risk === 'high' || skill.risk === 'irreversible';

            return (
              <div
                key={skill.skill_id}
                className={`p-4 rounded-xl border transition-all ${
                  skill.enabled
                    ? 'bg-slate-950/70 border-slate-800'
                    : 'bg-slate-950/30 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono font-bold text-sm text-slate-200">
                      {skill.skill_id}
                    </span>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      Scope: <span className="text-sky-300">{skill.permission_scope}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                        isHighRisk
                          ? 'bg-red-950 text-red-300 border-red-800'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}
                    >
                      {skill.risk}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleSkill(skill.skill_id, !skill.enabled)}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                        skill.enabled
                          ? 'bg-sky-950 text-sky-300 border border-sky-800 hover:bg-sky-900'
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {skill.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-3">{skill.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500 font-mono self-center mr-1">Tools:</span>
                  {skill.tool_ids.map((tool) => (
                    <span
                      key={tool}
                      className="text-[10px] bg-slate-900 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-mono"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduler Contracts */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-semibold text-slate-100">
            Background Scheduler Contracts
          </h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          Architectural rule: Background and cron-scheduled tasks enter the exact same Guardian and verification
          pipeline. They receive no privileged execution bypass.
        </p>

        <div className="space-y-3">
          {schedules.map((sc) => (
            <div
              key={sc.schedule_id}
              className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono"
            >
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-200 text-sm">{sc.schedule_id}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                    {sc.cadence}
                  </span>
                </div>
                <div className="text-slate-300 font-sans text-xs mt-1">{sc.objective}</div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded border ${
                    sc.requires_approval
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}
                >
                  {sc.requires_approval ? 'Approval Required' : 'Autonomous'}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded border ${
                    sc.enabled
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {sc.enabled ? 'ACTIVE' : 'INACTIVE'}
                </span>
                {onTriggerSchedule && sc.enabled && (
                  <button
                    type="button"
                    disabled={triggeringId === sc.schedule_id}
                    onClick={() => handleRunNow(sc.schedule_id)}
                    className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-[11px] font-sans px-2.5 py-1 rounded flex items-center space-x-1 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{triggeringId === sc.schedule_id ? 'Running...' : 'Run Now'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {lastFeedback && (
          <div
            className={`mt-4 p-3 rounded-lg border text-xs font-mono ${
              lastFeedback.status === 'paused_for_approval'
                ? 'bg-amber-950/40 border-amber-800 text-amber-200'
                : lastFeedback.status === 'completed'
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}
          >
            <span className="font-bold">[{lastFeedback.id}]</span> {lastFeedback.msg}
          </div>
        )}
      </div>
    </div>
  );
};
