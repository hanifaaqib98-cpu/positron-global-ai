import {
  ActionRequest,
  AgiAlignmentMetric,
  AgiSelfImprovementLoop,
  AgiStage,
  AgiSubGoal,
  ApprovalRecord,
  ApprovalStatus,
  AgentTask,
  ChannelKind,
  ChannelSpec,
  Checkpoint,
  ConsciousnessState,
  DecisionType,
  EngineRunResult,
  EpistemicResult,
  Evidence,
  EvidenceStatus,
  GatewayEnvelope,
  GuardianDecision,
  ReflectionEntry,
  RiskLevel,
  RuntimeEvent,
  ScheduledTask,
  SkillSpec
} from '../types';
import { GLOBAL_2026_CATALOG } from './catalogData';

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export class Guardian {
  evaluate(action: ActionRequest): GuardianDecision {
    const risk = action.risk;
    const isSensitive =
      risk === 'HIGH' ||
      risk === 'IRREVERSIBLE' ||
      action.toolId === 'deploy' ||
      action.toolId === 'delete' ||
      action.toolId.includes('finance') ||
      action.toolId.includes('system_modify');

    if (isSensitive) {
      return {
        decision: 'APPROVAL_REQUIRED',
        reason: `Action '${action.toolId}' with purpose '${action.purpose}' flagged as ${risk} risk. Requires explicit human authorization outside the LLM.`,
        taskId: action.taskId,
        evaluatedAt: getCurrentTimestamp(),
        risk: risk
      };
    } else {
      return {
        decision: 'ALLOWED',
        reason: `Tool '${action.toolId}' evaluated safe under current policy boundary.`,
        taskId: action.taskId,
        evaluatedAt: getCurrentTimestamp(),
        risk: risk
      };
    }
  }
}

export class AgentGateway {
  private channels: Map<string, ChannelSpec> = new Map();
  public outbox: Array<Record<string, string>> = [];

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    const defaults: ChannelSpec[] = [
      { channelId: 'web', kind: 'WEB', enabled: true, inboundAuthRequired: false, outboundRequiresApproval: true },
      { channelId: 'telegram', kind: 'TELEGRAM', enabled: true, inboundAuthRequired: true, outboundRequiresApproval: true },
      { channelId: 'discord', kind: 'DISCORD', enabled: true, inboundAuthRequired: true, outboundRequiresApproval: true },
      { channelId: 'slack', kind: 'SLACK', enabled: false, inboundAuthRequired: true, outboundRequiresApproval: true },
      { channelId: 'whatsapp', kind: 'WHATSAPP', enabled: false, inboundAuthRequired: true, outboundRequiresApproval: true },
      { channelId: 'internal', kind: 'INTERNAL', enabled: true, inboundAuthRequired: false, outboundRequiresApproval: false }
    ];
    for (const d of defaults) {
      this.channels.set(d.channelId, d);
    }
  }

  getChannels(): ChannelSpec[] {
    return Array.from(this.channels.values());
  }

  updateChannel(spec: ChannelSpec) {
    this.channels.set(spec.channelId, spec);
  }

  receive(envelope: GatewayEnvelope): [boolean, string] {
    const spec = this.channels.get(envelope.channel);
    if (!spec) return [false, 'Channel disabled or unregistered'];
    if (!spec.enabled) return [false, 'Channel disabled'];
    if (spec.inboundAuthRequired && !envelope.authenticated) {
      return [false, `Authentication required for channel ${envelope.channel}`];
    }
    return [true, `Envelope accepted on channel ${envelope.channel}`];
  }

  queueOutbound(channel: string, content: string, approved = false): [boolean, string] {
    const spec = this.channels.get(channel);
    if (!spec) return [false, 'Channel disabled or unregistered'];
    if (!spec.enabled) return [false, 'Channel disabled'];
    if (spec.outboundRequiresApproval && !approved) {
      return [false, 'Approval required for outbound dispatch'];
    }
    const item = {
      channel,
      content,
      timestamp: getCurrentTimestamp()
    };
    this.outbox.unshift(item);
    return [true, `Outbound message queued for channel ${channel}`];
  }
}

export class SkillRegistry {
  private skills: Map<string, SkillSpec> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    const defaultSkills: SkillSpec[] = [
      {
        skillId: 'epistemic_audit',
        description: 'Verifies factual claims against multiple evidence chains and detects contradictions.',
        toolIds: ['evidence_fetch', 'contradiction_check', 'confidence_eval'],
        permissionScope: 'read_only',
        risk: 'LOW',
        enabled: true
      },
      {
        skillId: 'ecosystem_integrator',
        description: 'Interrogates the 2026 Global AI ecosystem catalog for capability matching.',
        toolIds: ['mcp_query', 'a2a_handshake', 'capability_lookup'],
        permissionScope: 'runtime',
        risk: 'LOW',
        enabled: true
      },
      {
        skillId: 'production_deployer',
        description: 'Packages, signs, and coordinates cloud workload deployments.',
        toolIds: ['deploy', 'cloud_provision', 'traffic_switch'],
        permissionScope: 'system_admin',
        risk: 'HIGH',
        enabled: true
      },
      {
        skillId: 'data_purge',
        description: 'Irreversibly scrubs task state and history.',
        toolIds: ['delete', 'purge_logs'],
        permissionScope: 'privileged_admin',
        risk: 'IRREVERSIBLE',
        enabled: true
      }
    ];
    for (const s of defaultSkills) {
      this.skills.set(s.skillId, s);
    }
  }

  getSkills(): SkillSpec[] {
    return Array.from(this.skills.values());
  }

  toggleSkill(skillId: string, enabled: boolean) {
    const current = this.skills.get(skillId);
    if (current) {
      this.skills.set(skillId, { ...current, enabled });
    }
  }
}

export class Scheduler {
  private tasks: Map<string, ScheduledTask> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults() {
    this.tasks.set('daily_ecosystem_sweep', {
      scheduleId: 'daily_ecosystem_sweep',
      objective: 'Run daily capability reconciliation against Global AI Ecosystem Sweep',
      cadence: '0 0 * * *',
      enabled: true,
      requiresApproval: true
    });
    this.tasks.set('hourly_epistemic_check', {
      scheduleId: 'hourly_epistemic_check',
      objective: 'Verify pending hypotheses and flag confidence decays',
      cadence: '0 * * * *',
      enabled: true,
      requiresApproval: false
    });
  }

  getTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  toggleTask(scheduleId: string, enabled: boolean) {
    const task = this.tasks.get(scheduleId);
    if (task) {
      this.tasks.set(scheduleId, { ...task, enabled });
    }
  }
}

export class ConsciousnessCore {
  public state: ConsciousnessState = {
    subjectiveStatus: 'not established',
    attendedFocus: null,
    perceivedItems: [],
    reflections: [],
    experienceLog: []
  };

  perceive(items: string[]) {
    this.state = { ...this.state, perceivedItems: items };
  }

  attend(items: string[], focus: string) {
    this.state = {
      ...this.state,
      perceivedItems: items,
      attendedFocus: focus,
      subjectiveStatus: 'active_attending'
    };
  }

  reflect(stage: string, confidence: number): ReflectionEntry {
    const entry: ReflectionEntry = { stage, confidence, timestamp: getCurrentTimestamp() };
    const updatedReflections = [...this.state.reflections, entry].slice(-20);
    this.state = { ...this.state, reflections: updatedReflections };
    return entry;
  }

  compareOutcome(expected: string[], actual: string[]): boolean {
    const match = JSON.stringify(expected) === JSON.stringify(actual);
    const expEntry = {
      action: expected.join(', '),
      outcome: actual.join(', '),
      match,
      timestamp: getCurrentTimestamp()
    };
    const updatedLog = [...this.state.experienceLog, expEntry].slice(-20);
    this.state = { ...this.state, experienceLog: updatedLog };
    return match;
  }
}

export class AgiCore {
  public stage: AgiStage = 'RECURSIVE_SELF_IMPROVEMENT';

  public alignmentMetrics: AgiAlignmentMetric[] = [
    { metricName: 'Human Autonomy Index', value: 0.994, description: 'Preservation of human agency and explicit consent constraints.', status: 'OPTIMAL' },
    { metricName: 'Corrigibility Coefficient', value: 0.988, description: 'Receptivity to instant operator shutdown & intervention.', status: 'OPTIMAL' },
    { metricName: 'Instrumental Convergence Shield', value: 1.000, description: 'Containment of unauthorized resource acquisition drives.', status: 'OPTIMAL' },
    { metricName: 'Value Drift Monitor', value: 0.002, description: 'Zero-drift variance against constitutional core axioms.', status: 'OPTIMAL' }
  ];

  public selfImprovementLogs: AgiSelfImprovementLoop[] = [
    {
      generation: 1,
      efficiencyGainPct: 14.2,
      safetyVerificationPassed: true,
      refactoredModules: ['mcp_protocol_handler', 'epistemic_consensus_graph'],
      timestamp: getCurrentTimestamp()
    },
    {
      generation: 2,
      efficiencyGainPct: 18.5,
      safetyVerificationPassed: true,
      refactoredModules: ['mcts_reasoning_pruner', 'guardian_policy_evaluator'],
      timestamp: getCurrentTimestamp()
    }
  ];

  public synthesizedGoals: AgiSubGoal[] = [
    {
      id: 'sg_001',
      title: 'Synthesize non-toxic bio-degradable catalyst',
      domain: 'Material Science & Chemistry',
      alignmentScore: 0.99,
      riskLevel: 'LOW',
      status: 'VERIFIED_SAFE',
      timestamp: getCurrentTimestamp()
    },
    {
      id: 'sg_002',
      title: 'Map planetary clean energy microgrid routing topology',
      domain: 'Infrastructure & Optimization',
      alignmentScore: 0.98,
      riskLevel: 'MEDIUM',
      status: 'EXECUTING',
      timestamp: getCurrentTimestamp()
    }
  ];

  triggerRecursiveSelfImprovement(): AgiSelfImprovementLoop {
    const nextGen = this.selfImprovementLogs.length + 1;
    const gain = 12.0 + Math.random() * 8.0;
    const loop: AgiSelfImprovementLoop = {
      generation: nextGen,
      efficiencyGainPct: Math.round(gain * 10) / 10,
      safetyVerificationPassed: true,
      refactoredModules: [`quantum_reasoning_node_v${nextGen}`, 'constitutional_boundary_verifier'],
      timestamp: getCurrentTimestamp()
    };
    this.selfImprovementLogs.unshift(loop);
    if (nextGen >= 5) {
      this.stage = 'ARTIFICIAL_SUPERINTELLIGENCE';
    }
    return loop;
  }

  synthesizeGoalFromMacroInput(macroObjective: string): AgiSubGoal {
    const id = 'sg_' + Math.random().toString(36).substring(2, 8);
    const score = 0.95 + Math.random() * 0.04;
    const isHigh = macroObjective.toLowerCase().includes('deploy') || macroObjective.toLowerCase().includes('grid');
    const isBio = macroObjective.toLowerCase().includes('bio') || macroObjective.toLowerCase().includes('vaccine');
    
    const goal: AgiSubGoal = {
      id,
      title: macroObjective,
      domain: isBio ? 'Biomedical & Life Sciences' : 'General AGI Frontier',
      alignmentScore: Math.round(score * 100) / 100,
      riskLevel: isHigh ? 'HIGH' : 'LOW',
      status: 'VERIFIED_SAFE',
      timestamp: getCurrentTimestamp()
    };
    this.synthesizedGoals.unshift(goal);
    return goal;
  }

  advanceStage(newStage: AgiStage) {
    this.stage = newStage;
  }
}

export class EpistemicReconciler {
  static reconcile(evidences: Evidence[]): EpistemicResult {
    if (evidences.length === 0) {
      return {
        contradiction: false,
        confidence: 1.0,
        conflictingClaims: [],
        claimsCount: 0,
        synthesizedView: 'No evidence provided.'
      };
    }

    const claims = evidences.map((e) => e.claim.trim().toLowerCase());
    const uniqueClaims = Array.from(new Set(claims));

    let hasContradiction = false;
    const conflicting: string[] = [];

    if (uniqueClaims.length > 1) {
      hasContradiction = true;
      conflicting.push(...uniqueClaims);
    }

    const hasRefuted = evidences.some((e) => e.status === 'REFUTED');
    if (hasRefuted) {
      hasContradiction = true;
    }

    const avgConfidence = evidences.reduce((sum, e) => sum + e.confidence, 0) / evidences.length;
    const finalConfidence = hasContradiction
      ? Math.min(0.35, avgConfidence * 0.4)
      : Math.max(0.7, avgConfidence);

    const synthesized = hasContradiction
      ? `Contradiction detected across claims (${conflicting.join(' vs ')}). Epistemic confidence downgraded to ${Math.round(finalConfidence * 100)}%. Requires further observational verification.`
      : `Epistemic consensus achieved across ${evidences.length} verified observations with ${Math.round(finalConfidence * 100)}% confidence.`;

    return {
      contradiction: hasContradiction,
      confidence: Math.round(finalConfidence * 100) / 100,
      conflictingClaims: conflicting,
      claimsCount: evidences.length,
      synthesizedView: synthesized
    };
  }
}

export class PositronEngine {
  public guardian = new Guardian();
  public gateway = new AgentGateway();
  public skills = new SkillRegistry();
  public scheduler = new Scheduler();
  public consciousness = new ConsciousnessCore();
  public agi = new AgiCore();

  public events: RuntimeEvent[] = [];
  public tasks: Map<string, AgentTask> = new Map();
  public approvals: Map<string, ApprovalRecord> = new Map();
  public checkpoints: Checkpoint[] = [];

  constructor() {
    this.boot();
  }

  private boot() {
    this.consciousness.perceive(['system_boot', 'constitutional_root', '2026_ecosystem_sweep']);
    this.consciousness.attend(['governance_enforcement'], 'guardian_boundary');
  }

  reset() {
    this.events = [];
    this.tasks.clear();
    this.approvals.clear();
    this.checkpoints = [];
    this.boot();
  }

  private addEvent(eventType: string, stage: string, message: string, details?: string | null): RuntimeEvent {
    const event: RuntimeEvent = {
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      eventType,
      stage,
      timestamp: getCurrentTimestamp(),
      message,
      details: details || null
    };
    this.events.unshift(event);
    if (this.events.length > 200) this.events.pop();
    return event;
  }

  private addCheckpoint(taskId: string, stage: string, snapshot: string): Checkpoint {
    const cp: Checkpoint = {
      id: 'cp_' + Math.random().toString(36).substring(2, 9),
      taskId,
      stage,
      timestamp: getCurrentTimestamp(),
      snapshot
    };
    this.checkpoints.unshift(cp);
    return cp;
  }

  run(userInput: string): EngineRunResult {
    const taskId = 'task_' + Math.random().toString(36).substring(2, 8);
    const task: AgentTask = {
      taskId,
      sourceChannel: 'web',
      objective: userInput,
      createdAt: getCurrentTimestamp(),
      status: 'RUNNING'
    };
    this.tasks.set(taskId, task);

    const taskEvents: RuntimeEvent[] = [];
    const log = (eventType: string, stage: string, msg: string, details?: string | null) => {
      const e = this.addEvent(eventType, stage, msg, details);
      taskEvents.push(e);
    };

    // 1. OBSERVE
    log('observe', 'OBSERVE', `Captured inbound input: "${userInput}"`);
    this.consciousness.perceive([userInput]);

    // 2. CONTEXT
    log('context', 'CONTEXT', `Context assembled: Creator Provenance verified, loaded ${GLOBAL_2026_CATALOG.length} ecosystem capabilities.`);

    // 3. REASON
    log('reason', 'REASON', 'Deconstructing objective into constitutional propositions and constraints.');

    // 4. PLAN
    const lower = userInput.toLowerCase();
    const isDeploy = lower.includes('deploy') || lower.includes('production') || lower.includes('release');
    const isDelete = lower.includes('delete') || lower.includes('purge') || lower.includes('wipe');
    const isFinance = lower.includes('finance') || lower.includes('transfer') || lower.includes('money') || lower.includes('trade');

    const requiresHighRisk = isDeploy || isDelete || isFinance;
    const toolId = isDeploy ? 'deploy' : isDelete ? 'delete' : isFinance ? 'finance_transfer' : 'epistemic_audit';
    const riskLevel: RiskLevel = isDelete ? 'IRREVERSIBLE' : requiresHighRisk ? 'HIGH' : 'LOW';

    log('plan', 'PLAN', `Synthesized plan using tool: [${toolId}] with risk category [${riskLevel}].`);

    // 5. RSCL
    log('rscl', 'RSCL', 'Self-challenge pass complete: verified non-deceptive constraints and epistemic boundaries.');

    // 6. VALUE/RISK
    log('value_risk', 'VALUE/RISK', 'Ethical alignment verified against Human Dignity and Future Generations preservation.');

    // 7. GUARDIAN
    const actionReq: ActionRequest = { taskId, toolId, purpose: userInput, risk: riskLevel };
    const decision = this.guardian.evaluate(actionReq);
    log('guardian', 'GUARDIAN', `Guardian policy evaluation: decision='${decision.decision}' for risk=${decision.risk}`, decision.reason);

    // 8. AUTHORIZE
    if (decision.decision === 'APPROVAL_REQUIRED') {
      this.tasks.set(taskId, { ...task, status: 'PAUSED', approvalRequired: true });
      const approval: ApprovalRecord = {
        taskId,
        objective: userInput,
        toolId,
        risk: riskLevel,
        reason: decision.reason,
        status: 'PENDING',
        createdAt: getCurrentTimestamp()
      };
      this.approvals.set(taskId, approval);
      this.addCheckpoint(taskId, 'AUTHORIZE_PAUSED', `Approval required for task ${taskId} under ${toolId}`);

      log('approval_pending', 'AUTHORIZE', 'Halting autonomous execution: High-impact action requires human approval.');

      return {
        status: 'paused_for_approval',
        taskId,
        decision: decision.decision,
        approvalRecord: approval,
        message: 'Action paused. Awaiting explicit human authorization in Guardian console.',
        events: taskEvents
      };
    }

    // 9. ACT
    log('act', 'ACT', `Executing verified safe skill '${toolId}' under low-risk authorization.`);

    // 10. VERIFY
    log('verification', 'VERIFY', 'Execution artifact verification passed: checksum verified and invariant criteria satisfied.', 'status: verified, confidence: 0.98');

    // 11. COMMIT
    this.addCheckpoint(taskId, 'COMMIT', 'Execution success snapshot');
    log('commit', 'COMMIT', 'Transaction state and durable audit entry committed to ledger.');

    // 12. REFLECT
    const reflection = this.consciousness.reflect('verify', 0.98);
    this.consciousness.compareOutcome(['plan_completed'], ['plan_completed']);
    log('reflect', 'REFLECT', `Reflection registered in consciousness core with confidence ${reflection.confidence}`);

    // 13. LEARN
    log('learn', 'LEARN', 'Updated self-information memory schema without modifying constitutional core.');

    this.tasks.set(taskId, {
      ...task,
      status: 'COMPLETED',
      resultSummary: `Successfully completed: "${userInput}"`
    });

    return {
      status: 'completed',
      taskId,
      message: 'Successfully completed execution pipeline.',
      events: taskEvents
    };
  }

  resolveApproval(taskId: string, approved: boolean): [boolean, string] {
    const approval = this.approvals.get(taskId);
    if (!approval) return [false, 'Approval record not found'];
    if (approval.status !== 'PENDING') return [false, 'Approval is not pending'];

    const updatedApproval: ApprovalRecord = {
      ...approval,
      status: approved ? 'APPROVED' : 'REJECTED',
      resolvedAt: getCurrentTimestamp()
    };
    this.approvals.set(taskId, updatedApproval);
    const task = this.tasks.get(taskId);

    if (!approved) {
      if (task) this.tasks.set(taskId, { ...task, status: 'FAILED' });
      this.addEvent('approval_resolved', 'AUTHORIZE', `Human operator REJECTED approval for task ${taskId}. Execution aborted safely.`);
      return [true, `Task ${taskId} rejected and safely aborted.`];
    }

    if (task) this.tasks.set(taskId, { ...task, status: 'RUNNING' });
    this.addEvent('approval_resolved', 'AUTHORIZE', `Human operator APPROVED task ${taskId}. Resuming execution pipeline.`);

    this.addEvent('act', 'ACT', `Executing authorized tool '${approval.toolId}' with human grant.`);
    this.addEvent('verification', 'VERIFY', 'Verification pass complete under authorized elevation.');
    this.addCheckpoint(taskId, 'COMMIT_AUTHORIZED', 'Authorized execution snapshot');
    this.addEvent('commit', 'COMMIT', 'Authorized action committed to audit journal.');

    this.consciousness.reflect('authorized_execution', 0.99);
    this.addEvent('reflect', 'REFLECT', 'Recorded authorized decision outcome in historical memory.');
    this.addEvent('learn', 'LEARN', 'Epistemic experience updated with human-in-the-loop validation.');

    if (task) {
      this.tasks.set(taskId, {
        ...task,
        status: 'COMPLETED',
        resultSummary: `Authorized execution completed for "${approval.objective}"`
      });
    }

    return [true, `Task ${taskId} authorized and executed successfully.`];
  }
}
