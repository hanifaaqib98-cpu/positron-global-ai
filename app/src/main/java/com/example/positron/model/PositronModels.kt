package com.example.positron.model

enum class ChannelKind {
    TELEGRAM, WHATSAPP, DISCORD, SLACK, WEB, VOICE, INTERNAL
}

data class ChannelSpec(
    val channelId: String,
    val kind: ChannelKind,
    val enabled: Boolean,
    val inboundAuthRequired: Boolean,
    val outboundRequiresApproval: Boolean
)

enum class RiskLevel {
    LOW, MEDIUM, HIGH, IRREVERSIBLE
}

data class SkillSpec(
    val skillId: String,
    val description: String,
    val toolIds: List<String>,
    val permissionScope: String,
    val risk: RiskLevel,
    val enabled: Boolean
)

enum class TaskStatus {
    QUEUED, RUNNING, PAUSED, COMPLETED, FAILED
}

data class AgentTask(
    val taskId: String,
    val sourceChannel: String,
    val objective: String,
    val background: Boolean = false,
    val scheduleRef: String? = null,
    val approvalRequired: Boolean = false,
    val status: TaskStatus = TaskStatus.RUNNING,
    val resultSummary: String? = null,
    val createdAt: String
)

data class ScheduledTask(
    val scheduleId: String,
    val objective: String,
    val cadence: String,
    val enabled: Boolean,
    val requiresApproval: Boolean
)

data class GatewayEnvelope(
    val channel: String,
    val senderRef: String,
    val authenticated: Boolean,
    val content: String,
    val metadata: Map<String, String> = emptyMap()
)

data class ActionRequest(
    val taskId: String,
    val toolId: String,
    val purpose: String,
    val risk: RiskLevel = RiskLevel.LOW
)

enum class DecisionType {
    ALLOWED, APPROVAL_REQUIRED, DENIED
}

data class GuardianDecision(
    val decision: DecisionType,
    val reason: String,
    val taskId: String,
    val evaluatedAt: String,
    val risk: RiskLevel
)

enum class ApprovalStatus {
    PENDING, APPROVED, REJECTED
}

data class ApprovalRecord(
    val taskId: String,
    val objective: String,
    val toolId: String,
    val risk: RiskLevel,
    val reason: String,
    val status: ApprovalStatus = ApprovalStatus.PENDING,
    val createdAt: String,
    val resolvedAt: String? = null
)

enum class EvidenceStatus {
    VERIFIED, SUPPORTED, UNVERIFIED, REFUTED
}

data class Evidence(
    val claim: String,
    val source: String,
    val status: EvidenceStatus,
    val confidence: Float // 0.0 to 1.0
)

data class EpistemicResult(
    val contradiction: Boolean,
    val confidence: Float,
    val conflictingClaims: List<String>,
    val claimsCount: Int,
    val synthesizedView: String
)

data class RuntimeEvent(
    val id: String,
    val eventType: String,
    val stage: String,
    val timestamp: String,
    val message: String,
    val details: String? = null
)

data class Checkpoint(
    val id: String,
    val taskId: String,
    val stage: String,
    val timestamp: String,
    val snapshot: String
)

data class ReflectionEntry(
    val stage: String,
    val confidence: Float,
    val timestamp: String
)

data class ExperienceEntry(
    val action: String,
    val outcome: String,
    val match: Boolean,
    val timestamp: String
)

data class ConsciousnessState(
    val subjectiveStatus: String = "not established",
    val attendedFocus: String? = null,
    val perceivedItems: List<String> = emptyList(),
    val reflections: List<ReflectionEntry> = emptyList(),
    val experienceLog: List<ExperienceEntry> = emptyList()
)

data class EcosystemEntry(
    val id: String,
    val name: String,
    val category: String,
    val capabilities: List<String>,
    val summary: String,
    val url: String? = null
)

enum class AgiStage {
    NARROW_AI, GENERAL_REASONING, AUTONOMOUS_AGENTIC, RECURSIVE_SELF_IMPROVEMENT, ARTIFICIAL_SUPERINTELLIGENCE
}

data class AgiSubGoal(
    val id: String,
    val title: String,
    val domain: String,
    val alignmentScore: Float, // 0.0 to 1.0
    val riskLevel: RiskLevel,
    val status: String,
    val timestamp: String
)

data class AgiAlignmentMetric(
    val metricName: String,
    val value: Float,
    val description: String,
    val status: String
)

data class AgiSelfImprovementLoop(
    val generation: Int,
    val efficiencyGainPct: Float,
    val safetyVerificationPassed: Boolean,
    val refactoredModules: List<String>,
    val timestamp: String
)

data class EngineRunResult(
    val status: String,
    val taskId: String,
    val decision: DecisionType? = null,
    val approvalRecord: ApprovalRecord? = null,
    val message: String,
    val events: List<RuntimeEvent> = emptyList()
)
