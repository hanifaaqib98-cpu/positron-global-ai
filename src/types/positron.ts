export type ChannelKind =
  | 'telegram'
  | 'whatsapp'
  | 'discord'
  | 'slack'
  | 'web'
  | 'voice'
  | 'internal';

export interface ChannelSpec {
  channel_id: string;
  kind: ChannelKind;
  enabled: boolean;
  inbound_auth_required: boolean;
  outbound_requires_approval: boolean;
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'irreversible';

export interface SkillSpec {
  skill_id: string;
  description: string;
  tool_ids: string[];
  permission_scope: string;
  risk: RiskLevel;
  enabled: boolean;
}

export type TaskStatus = 'queued' | 'running' | 'paused' | 'completed' | 'failed';

export interface AgentTask {
  task_id: string;
  source_channel: string;
  objective: string;
  background: boolean;
  schedule_ref?: string | null;
  approval_required: boolean;
  status: TaskStatus;
  result?: any;
  created_at: string;
}

export interface ScheduledTask {
  schedule_id: string;
  objective: string;
  cadence: string;
  enabled: boolean;
  requires_approval: boolean;
}

export interface GatewayEnvelope {
  channel: string;
  sender_ref: string;
  authenticated: boolean;
  content: string;
  metadata?: Record<string, any>;
}

export interface ActionRequest {
  task_id: string;
  tool_id: string;
  purpose: string;
  risk?: RiskLevel;
  parameters?: Record<string, any>;
}

export interface GuardianDecision {
  decision: 'allowed' | 'approval_required' | 'denied';
  reason: string;
  task_id: string;
  evaluated_at: string;
  risk: RiskLevel;
}

export interface ApprovalRecord {
  task_id: string;
  objective: string;
  tool_id: string;
  risk: RiskLevel;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  resolved_at?: string;
}

export interface Evidence {
  claim: string;
  source: string;
  status: 'verified' | 'supported' | 'unverified' | 'refuted';
  confidence: number; // 0 to 1
}

export interface EpistemicReconciliationResult {
  contradiction: boolean;
  confidence: number;
  conflicting_claims: string[];
  claims_count: number;
  synthesized_view: string;
}

export interface RuntimeEvent {
  id: string;
  event_type:
    | 'observe'
    | 'context'
    | 'reason'
    | 'plan'
    | 'rscl'
    | 'value_risk'
    | 'guardian'
    | 'authorize'
    | 'act'
    | 'verification'
    | 'replan'
    | 'commit'
    | 'reflect'
    | 'learn'
    | 'approval_pending'
    | 'approval_resolved';
  stage: string;
  timestamp: string;
  message: string;
  details?: Record<string, any>;
}

export interface Checkpoint {
  id: string;
  task_id: string;
  stage: string;
  timestamp: string;
  snapshot: Record<string, any>;
}

export interface ConsciousnessState {
  subjective_consciousness_status: string;
  attended_focus: string | null;
  perceived_items: string[];
  reflections: Array<{ stage: string; confidence: number; timestamp: string }>;
  experience_log: Array<{ action: string; outcome: string; match: boolean; timestamp: string }>;
}

export interface EcosystemEntry {
  id: string;
  name: string;
  category:
    | 'Personal/Always-On'
    | 'Agent Orchestration'
    | 'Coding Agents'
    | 'Computer/Browser/Mobile'
    | 'Memory/Knowledge'
    | 'Protocols'
    | 'Research/Science'
    | 'Creative Workflows'
    | 'Physical AI'
    | 'Automation & Observability'
    | 'Multi-Agent & Lifelong';
  capabilities: string[];
  url?: string;
  summary: string;
}
