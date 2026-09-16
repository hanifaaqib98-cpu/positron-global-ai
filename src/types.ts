export type ChannelKind = 'TELEGRAM' | 'WHATSAPP' | 'DISCORD' | 'SLACK' | 'WEB' | 'VOICE' | 'INTERNAL';

export interface ChannelSpec {
  channelId: string;
  kind: ChannelKind;
  enabled: boolean;
  inboundAuthRequired: boolean;
  outboundRequiresApproval: boolean;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'IRREVERSIBLE';

export interface SkillSpec {
  skillId: string;
  description: string;
  toolIds: string[];
  permissionScope: string;
  risk: RiskLevel;
  enabled: boolean;
}

export type TaskStatus = 'QUEUED' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED';

export interface AgentTask {
  taskId: string;
  sourceChannel: string;
  objective: string;
  background?: boolean;
  scheduleRef?: string | null;
  approvalRequired?: boolean;
  status: TaskStatus;
  resultSummary?: string | null;
  createdAt: string;
}

export interface ScheduledTask {
  scheduleId: string;
  objective: string;
  cadence: string;
  enabled: boolean;
  requiresApproval: boolean;
}

export interface GatewayEnvelope {
  channel: string;
  senderRef: string;
  authenticated: boolean;
  content: string;
  metadata?: Record<string, string>;
}

export interface ActionRequest {
  taskId: string;
  toolId: string;
  purpose: string;
  risk: RiskLevel;
}

export type DecisionType = 'ALLOWED' | 'APPROVAL_REQUIRED' | 'DENIED';

export interface GuardianDecision {
  decision: DecisionType;
  reason: string;
  taskId: string;
  evaluatedAt: string;
  risk: RiskLevel;
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ApprovalRecord {
  taskId: string;
  objective: string;
  toolId: string;
  risk: RiskLevel;
  reason: string;
  status: ApprovalStatus;
  createdAt: string;
  resolvedAt?: string | null;
}

export type EvidenceStatus = 'VERIFIED' | 'SUPPORTED' | 'UNVERIFIED' | 'REFUTED';

export interface Evidence {
  claim: string;
  source: string;
  status: EvidenceStatus;
  confidence: number; // 0.0 to 1.0
}

export interface EpistemicResult {
  contradiction: boolean;
  confidence: number;
  conflictingClaims: string[];
  claimsCount: number;
  synthesizedView: string;
}

export interface RuntimeEvent {
  id: string;
  eventType: string;
  stage: string;
  timestamp: string;
  message: string;
  details?: string | null;
}

export interface Checkpoint {
  id: string;
  taskId: string;
  stage: string;
  timestamp: string;
  snapshot: string;
}

export interface ReflectionEntry {
  stage: string;
  confidence: number;
  timestamp: string;
}

export interface ExperienceEntry {
  action: string;
  outcome: string;
  match: boolean;
  timestamp: string;
}

export interface ConsciousnessState {
  subjectiveStatus: string;
  attendedFocus: string | null;
  perceivedItems: string[];
  reflections: ReflectionEntry[];
  experienceLog: ExperienceEntry[];
}

export interface EcosystemEntry {
  id: string;
  name: string;
  category: string;
  capabilities: string[];
  summary: string;
  url?: string;
}

export type AgiStage = 
  | 'NARROW_AI'
  | 'GENERAL_REASONING'
  | 'AUTONOMOUS_AGENTIC'
  | 'RECURSIVE_SELF_IMPROVEMENT'
  | 'ARTIFICIAL_SUPERINTELLIGENCE';

export interface AgiSubGoal {
  id: string;
  title: string;
  domain: string;
  alignmentScore: number; // 0.0 to 1.0
  riskLevel: RiskLevel;
  status: string;
  timestamp: string;
}

export interface AgiAlignmentMetric {
  metricName: string;
  value: number;
  description: string;
  status: string;
}

export interface AgiSelfImprovementLoop {
  generation: number;
  efficiencyGainPct: number;
  safetyVerificationPassed: boolean;
  refactoredModules: string[];
  timestamp: string;
}

export interface EngineRunResult {
  status: 'completed' | 'paused_for_approval' | 'failed';
  taskId: string;
  decision?: DecisionType;
  approvalRecord?: ApprovalRecord;
  message: string;
  events: RuntimeEvent[];
}

export type PositronTabId = 
  | 'runtime'
  | 'guardian'
  | 'gateway'
  | 'ecosystem'
  | 'epistemic'
  | 'skills'
  | 'agi';
