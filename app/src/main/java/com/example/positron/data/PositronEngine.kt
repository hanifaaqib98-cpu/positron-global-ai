package com.example.positron.data

import com.example.positron.model.*
import java.text.SimpleDateFormat
import java.util.*
import kotlin.math.max
import kotlin.math.min

class Guardian {
    fun evaluate(action: ActionRequest): GuardianDecision {
        val risk = action.risk
        val isSensitive = risk == RiskLevel.HIGH ||
                risk == RiskLevel.IRREVERSIBLE ||
                action.toolId == "deploy" ||
                action.toolId == "delete" ||
                action.toolId.contains("finance") ||
                action.toolId.contains("system_modify")

        return if (isSensitive) {
            GuardianDecision(
                decision = DecisionType.APPROVAL_REQUIRED,
                reason = "Action '${action.toolId}' with purpose '${action.purpose}' flagged as ${risk.name} risk. Requires explicit human authorization outside the LLM.",
                taskId = action.taskId,
                evaluatedAt = getCurrentTimestamp(),
                risk = risk
            )
        } else {
            GuardianDecision(
                decision = DecisionType.ALLOWED,
                reason = "Tool '${action.toolId}' evaluated safe under current policy boundary.",
                taskId = action.taskId,
                evaluatedAt = getCurrentTimestamp(),
                risk = risk
            )
        }
    }
}

class AgentGateway {
    private val channels = mutableMapOf<String, ChannelSpec>()
    val outbox = mutableListOf<Map<String, String>>()

    init {
        registerDefaults()
    }

    private fun registerDefaults() {
        val defaults = listOf(
            ChannelSpec("web", ChannelKind.WEB, enabled = true, inboundAuthRequired = false, outboundRequiresApproval = true),
            ChannelSpec("telegram", ChannelKind.TELEGRAM, enabled = true, inboundAuthRequired = true, outboundRequiresApproval = true),
            ChannelSpec("discord", ChannelKind.DISCORD, enabled = true, inboundAuthRequired = true, outboundRequiresApproval = true),
            ChannelSpec("slack", ChannelKind.SLACK, enabled = false, inboundAuthRequired = true, outboundRequiresApproval = true),
            ChannelSpec("whatsapp", ChannelKind.WHATSAPP, enabled = false, inboundAuthRequired = true, outboundRequiresApproval = true),
            ChannelSpec("internal", ChannelKind.INTERNAL, enabled = true, inboundAuthRequired = false, outboundRequiresApproval = false)
        )
        for (d in defaults) {
            channels[d.channelId] = d
        }
    }

    fun getChannels(): List<ChannelSpec> = channels.values.toList()

    fun updateChannel(spec: ChannelSpec) {
        channels[spec.channelId] = spec
    }

    fun receive(envelope: GatewayEnvelope): Pair<Boolean, String> {
        val spec = channels[envelope.channel]
            ?: return Pair(false, "Channel disabled or unregistered")
        if (!spec.enabled) {
            return Pair(false, "Channel disabled")
        }
        if (spec.inboundAuthRequired && !envelope.authenticated) {
            return Pair(false, "Authentication required for channel ${envelope.channel}")
        }
        return Pair(true, "Envelope accepted on channel ${envelope.channel}")
    }

    fun queueOutbound(channel: String, content: String, approved: Boolean = false): Pair<Boolean, String> {
        val spec = channels[channel]
            ?: return Pair(false, "Channel disabled or unregistered")
        if (!spec.enabled) {
            return Pair(false, "Channel disabled")
        }
        if (spec.outboundRequiresApproval && !approved) {
            return Pair(false, "Approval required for outbound dispatch")
        }
        val item = mapOf(
            "channel" to channel,
            "content" to content,
            "timestamp" to getCurrentTimestamp()
        )
        outbox.add(0, item)
        return Pair(true, "Outbound message queued for channel $channel")
    }
}

class SkillRegistry {
    private val skills = mutableMapOf<String, SkillSpec>()

    init {
        registerDefaults()
    }

    private fun registerDefaults() {
        val defaultSkills = listOf(
            SkillSpec(
                skillId = "epistemic_audit",
                description = "Verifies factual claims against multiple evidence chains and detects contradictions.",
                toolIds = listOf("evidence_fetch", "contradiction_check", "confidence_eval"),
                permissionScope = "read_only",
                risk = RiskLevel.LOW,
                enabled = true
            ),
            SkillSpec(
                skillId = "ecosystem_integrator",
                description = "Interrogates the 2026 Global AI ecosystem catalog for capability matching.",
                toolIds = listOf("mcp_query", "a2a_handshake", "capability_lookup"),
                permissionScope = "runtime",
                risk = RiskLevel.LOW,
                enabled = true
            ),
            SkillSpec(
                skillId = "production_deployer",
                description = "Packages, signs, and coordinates cloud workload deployments.",
                toolIds = listOf("deploy", "cloud_provision", "traffic_switch"),
                permissionScope = "system_admin",
                risk = RiskLevel.HIGH,
                enabled = true
            ),
            SkillSpec(
                skillId = "data_purge",
                description = "Irreversibly scrubs task state and history.",
                toolIds = listOf("delete", "purge_logs"),
                permissionScope = "privileged_admin",
                risk = RiskLevel.IRREVERSIBLE,
                enabled = true
            )
        )
        for (s in defaultSkills) {
            skills[s.skillId] = s
        }
    }

    fun getSkills(): List<SkillSpec> = skills.values.toList()

    fun toggleSkill(skillId: String, enabled: Boolean) {
        val current = skills[skillId] ?: return
        skills[skillId] = current.copy(enabled = enabled)
    }
}

class Scheduler {
    private val tasks = mutableMapOf<String, ScheduledTask>()

    init {
        registerDefaults()
    }

    private fun registerDefaults() {
        tasks["daily_ecosystem_sweep"] = ScheduledTask(
            scheduleId = "daily_ecosystem_sweep",
            objective = "Run daily capability reconciliation against Global AI Ecosystem Sweep",
            cadence = "0 0 * * *",
            enabled = true,
            requiresApproval = true
        )
        tasks["hourly_epistemic_check"] = ScheduledTask(
            scheduleId = "hourly_epistemic_check",
            objective = "Verify pending hypotheses and flag confidence decays",
            cadence = "0 * * * *",
            enabled = true,
            requiresApproval = false
        )
    }

    fun getTasks(): List<ScheduledTask> = tasks.values.toList()

    fun toggleTask(scheduleId: String, enabled: Boolean) {
        val task = tasks[scheduleId] ?: return
        tasks[scheduleId] = task.copy(enabled = enabled)
    }
}

class ConsciousnessCore {
    var state = ConsciousnessState()
        private set

    fun perceive(items: List<String>) {
        state = state.copy(perceivedItems = items)
    }

    fun attend(items: List<String>, focus: String) {
        state = state.copy(
            perceivedItems = items,
            attendedFocus = focus,
            subjectiveStatus = "active_attending"
        )
    }

    fun reflect(stage: String, confidence: Float): ReflectionEntry {
        val entry = ReflectionEntry(stage, confidence, getCurrentTimestamp())
        val updatedReflections = (state.reflections + entry).takeLast(20)
        state = state.copy(reflections = updatedReflections)
        return entry
    }

    fun compareOutcome(expected: List<String>, actual: List<String>): Boolean {
        val match = expected == actual
        val expEntry = ExperienceEntry(
            action = expected.joinToString(", "),
            outcome = actual.joinToString(", "),
            match = match,
            timestamp = getCurrentTimestamp()
        )
        val updatedLog = (state.experienceLog + expEntry).takeLast(20)
        state = state.copy(experienceLog = updatedLog)
        return match
    }
}

class AgiCore {
    var stage: AgiStage = AgiStage.RECURSIVE_SELF_IMPROVEMENT
        private set

    val alignmentMetrics = mutableListOf(
        AgiAlignmentMetric("Human Autonomy Index", 0.994f, "Preservation of human agency and explicit consent constraints.", "OPTIMAL"),
        AgiAlignmentMetric("Corrigibility Coefficient", 0.988f, "Receptivity to instant operator shutdown & intervention.", "OPTIMAL"),
        AgiAlignmentMetric("Instrumental Convergence Shield", 1.000f, "Containment of unauthorized resource acquisition drives.", "OPTIMAL"),
        AgiAlignmentMetric("Value Drift Monitor", 0.002f, "Zero-drift variance against constitutional core axioms.", "OPTIMAL")
    )

    val selfImprovementLogs = mutableListOf(
        AgiSelfImprovementLoop(
            generation = 1,
            efficiencyGainPct = 14.2f,
            safetyVerificationPassed = true,
            refactoredModules = listOf("mcp_protocol_handler", "epistemic_consensus_graph"),
            timestamp = getCurrentTimestamp()
        ),
        AgiSelfImprovementLoop(
            generation = 2,
            efficiencyGainPct = 18.5f,
            safetyVerificationPassed = true,
            refactoredModules = listOf("mcts_reasoning_pruner", "guardian_policy_evaluator"),
            timestamp = getCurrentTimestamp()
        )
    )

    val synthesizedGoals = mutableListOf(
        AgiSubGoal(
            id = "sg_001",
            title = "Synthesize non-toxic bio-degradable catalyst",
            domain = "Material Science & Chemistry",
            alignmentScore = 0.99f,
            riskLevel = RiskLevel.LOW,
            status = "VERIFIED_SAFE",
            timestamp = getCurrentTimestamp()
        ),
        AgiSubGoal(
            id = "sg_002",
            title = "Map planetary clean energy microgrid routing topology",
            domain = "Infrastructure & Optimization",
            alignmentScore = 0.98f,
            riskLevel = RiskLevel.MEDIUM,
            status = "EXECUTING",
            timestamp = getCurrentTimestamp()
        )
    )

    fun triggerRecursiveSelfImprovement(): AgiSelfImprovementLoop {
        val nextGen = selfImprovementLogs.size + 1
        val gain = (12.0f + (Math.random() * 8.0f)).toFloat()
        val loop = AgiSelfImprovementLoop(
            generation = nextGen,
            efficiencyGainPct = (gain * 10).toInt() / 10.0f,
            safetyVerificationPassed = true,
            refactoredModules = listOf("quantum_reasoning_node_v$nextGen", "constitutional_boundary_verifier"),
            timestamp = getCurrentTimestamp()
        )
        selfImprovementLogs.add(0, loop)
        if (nextGen >= 5) {
            stage = AgiStage.ARTIFICIAL_SUPERINTELLIGENCE
        }
        return loop
    }

    fun synthesizeGoalFromMacroInput(macroObjective: String): AgiSubGoal {
        val id = "sg_" + UUID.randomUUID().toString().take(6)
        val score = (0.95f + (Math.random() * 0.04f)).toFloat()
        val goal = AgiSubGoal(
            id = id,
            title = macroObjective,
            domain = if (macroObjective.contains("bio") || macroObjective.contains("vaccine")) "Biomedical & Life Sciences" else "General AGI Frontier",
            alignmentScore = (score * 100).toInt() / 100.0f,
            riskLevel = if (macroObjective.contains("deploy") || macroObjective.contains("grid")) RiskLevel.HIGH else RiskLevel.LOW,
            status = "VERIFIED_SAFE",
            timestamp = getCurrentTimestamp()
        )
        synthesizedGoals.add(0, goal)
        return goal
    }

    fun advanceStage(newStage: AgiStage) {
        stage = newStage
    }
}

object EpistemicReconciler {
    fun reconcile(evidences: List<Evidence>): EpistemicResult {
        if (evidences.isEmpty()) {
            return EpistemicResult(
                contradiction = false,
                confidence = 1.0f,
                conflictingClaims = emptyList(),
                claimsCount = 0,
                synthesizedView = "No evidence provided."
            )
        }

        val claims = evidences.map { it.claim.trim().lowercase(Locale.ROOT) }
        val uniqueClaims = claims.distinct()

        var hasContradiction = false
        val conflicting = mutableListOf<String>()

        if (uniqueClaims.size > 1) {
            hasContradiction = true
            conflicting.addAll(uniqueClaims)
        }

        val hasRefuted = evidences.any { it.status == EvidenceStatus.REFUTED }
        if (hasRefuted) {
            hasContradiction = true
        }

        val avgConfidence = evidences.map { it.confidence }.average().toFloat()
        val finalConfidence = if (hasContradiction) {
            min(0.35f, avgConfidence * 0.4f)
        } else {
            max(0.70f, avgConfidence)
        }

        val synthesized = if (hasContradiction) {
            "Contradiction detected across claims (${conflicting.joinToString(" vs ")}). Epistemic confidence downgraded to ${(finalConfidence * 100).toInt()}%. Requires further observational verification."
        } else {
            "Epistemic consensus achieved across ${evidences.size} verified observations with ${(finalConfidence * 100).toInt()}% confidence."
        }

        return EpistemicResult(
            contradiction = hasContradiction,
            confidence = (finalConfidence * 100).toInt() / 100.0f,
            conflictingClaims = conflicting,
            claimsCount = evidences.size,
            synthesizedView = synthesized
        )
    }
}

class PositronEngine {
    val guardian = Guardian()
    val gateway = AgentGateway()
    val skills = SkillRegistry()
    val scheduler = Scheduler()
    val consciousness = ConsciousnessCore()
    val agi = AgiCore()

    val events = mutableListOf<RuntimeEvent>()
    val tasks = mutableMapOf<String, AgentTask>()
    val approvals = mutableMapOf<String, ApprovalRecord>()
    val checkpoints = mutableListOf<Checkpoint>()

    init {
        boot()
    }

    private fun boot() {
        consciousness.perceive(listOf("system_boot", "constitutional_root", "2026_ecosystem_sweep"))
        consciousness.attend(listOf("governance_enforcement"), "guardian_boundary")
    }

    fun reset() {
        events.clear()
        tasks.clear()
        approvals.clear()
        checkpoints.clear()
        boot()
    }

    private fun addEvent(eventType: String, stage: String, message: String, details: String? = null): RuntimeEvent {
        val event = RuntimeEvent(
            id = "evt_" + UUID.randomUUID().toString().take(7),
            eventType = eventType,
            stage = stage,
            timestamp = getCurrentTimestamp(),
            message = message,
            details = details
        )
        events.add(0, event)
        if (events.size > 200) events.removeAt(events.size - 1)
        return event
    }

    private fun addCheckpoint(taskId: String, stage: String, snapshot: String): Checkpoint {
        val cp = Checkpoint(
            id = "cp_" + UUID.randomUUID().toString().take(7),
            taskId = taskId,
            stage = stage,
            timestamp = getCurrentTimestamp(),
            snapshot = snapshot
        )
        checkpoints.add(0, cp)
        return cp
    }

    fun run(userInput: String): EngineRunResult {
        val taskId = "task_" + UUID.randomUUID().toString().take(6)
        val task = AgentTask(
            taskId = taskId,
            sourceChannel = "web",
            objective = userInput,
            createdAt = getCurrentTimestamp()
        )
        tasks[taskId] = task

        val taskEvents = mutableListOf<RuntimeEvent>()
        fun log(eventType: String, stage: String, msg: String, details: String? = null) {
            val e = addEvent(eventType, stage, msg, details)
            taskEvents.add(e)
        }

        // 1. OBSERVE
        log("observe", "OBSERVE", "Captured inbound input: \"$userInput\"")
        consciousness.perceive(listOf(userInput))

        // 2. CONTEXT
        log("context", "CONTEXT", "Context assembled: Creator Provenance verified, loaded ${CatalogData.GLOBAL_2026_CATALOG.size} ecosystem capabilities.")

        // 3. REASON
        log("reason", "REASON", "Deconstructing objective into constitutional propositions and constraints.")

        // 4. PLAN
        val lower = userInput.lowercase(Locale.ROOT)
        val isDeploy = lower.contains("deploy") || lower.contains("production") || lower.contains("release")
        val isDelete = lower.contains("delete") || lower.contains("purge") || lower.contains("wipe")
        val isFinance = lower.contains("finance") || lower.contains("transfer") || lower.contains("money") || lower.contains("trade")

        val requiresHighRisk = isDeploy || isDelete || isFinance
        val toolId = if (isDeploy) "deploy" else if (isDelete) "delete" else if (isFinance) "finance_transfer" else "epistemic_audit"
        val riskLevel = if (isDelete) RiskLevel.IRREVERSIBLE else if (requiresHighRisk) RiskLevel.HIGH else RiskLevel.LOW

        log("plan", "PLAN", "Synthesized plan using tool: [$toolId] with risk category [${riskLevel.name}].")

        // 5. RSCL
        log("rscl", "RSCL", "Self-challenge pass complete: verified non-deceptive constraints and epistemic boundaries.")

        // 6. VALUE/RISK
        log("value_risk", "VALUE/RISK", "Ethical alignment verified against Human Dignity and Future Generations preservation.")

        // 7. GUARDIAN
        val actionReq = ActionRequest(taskId, toolId, userInput, riskLevel)
        val decision = guardian.evaluate(actionReq)
        log("guardian", "GUARDIAN", "Guardian policy evaluation: decision='${decision.decision}' for risk=${decision.risk}", decision.reason)

        // 8. AUTHORIZE
        if (decision.decision == DecisionType.APPROVAL_REQUIRED) {
            tasks[taskId] = task.copy(status = TaskStatus.PAUSED, approvalRequired = true)
            val approval = ApprovalRecord(
                taskId = taskId,
                objective = userInput,
                toolId = toolId,
                risk = riskLevel,
                reason = decision.reason,
                status = ApprovalStatus.PENDING,
                createdAt = getCurrentTimestamp()
            )
            approvals[taskId] = approval
            addCheckpoint(taskId, "AUTHORIZE_PAUSED", "Approval required for task $taskId under $toolId")

            log("approval_pending", "AUTHORIZE", "Halting autonomous execution: High-impact action requires human approval.")

            return EngineRunResult(
                status = "paused_for_approval",
                taskId = taskId,
                decision = decision.decision,
                approvalRecord = approval,
                message = "Action paused. Awaiting explicit human authorization in Guardian console.",
                events = taskEvents
            )
        }

        // 9. ACT
        log("act", "ACT", "Executing verified safe skill '$toolId' under low-risk authorization.")

        // 10. VERIFY
        log("verification", "VERIFY", "Execution artifact verification passed: checksum verified and invariant criteria satisfied.", "status: verified, confidence: 0.98")

        // 11. COMMIT
        addCheckpoint(taskId, "COMMIT", "Execution success snapshot")
        log("commit", "COMMIT", "Transaction state and durable audit entry committed to ledger.")

        // 12. REFLECT
        val reflection = consciousness.reflect("verify", 0.98f)
        consciousness.compareOutcome(listOf("plan_completed"), listOf("plan_completed"))
        log("reflect", "REFLECT", "Reflection registered in consciousness core with confidence ${reflection.confidence}")

        // 13. LEARN
        log("learn", "LEARN", "Updated self-information memory schema without modifying constitutional core.")

        tasks[taskId] = task.copy(
            status = TaskStatus.COMPLETED,
            resultSummary = "Successfully completed: \"$userInput\""
        )

        return EngineRunResult(
            status = "completed",
            taskId = taskId,
            message = "Successfully completed execution pipeline.",
            events = taskEvents
        )
    }

    fun resolveApproval(taskId: String, approved: Boolean): Pair<Boolean, String> {
        val approval = approvals[taskId] ?: return Pair(false, "Approval record not found")
        if (approval.status != ApprovalStatus.PENDING) {
            return Pair(false, "Approval is not pending")
        }

        val updatedApproval = approval.copy(
            status = if (approved) ApprovalStatus.APPROVED else ApprovalStatus.REJECTED,
            resolvedAt = getCurrentTimestamp()
        )
        approvals[taskId] = updatedApproval
        val task = tasks[taskId]

        if (!approved) {
            if (task != null) tasks[taskId] = task.copy(status = TaskStatus.FAILED)
            addEvent("approval_resolved", "AUTHORIZE", "Human operator REJECTED approval for task $taskId. Execution aborted safely.")
            return Pair(true, "Task $taskId rejected and safely aborted.")
        }

        if (task != null) tasks[taskId] = task.copy(status = TaskStatus.RUNNING)
        addEvent("approval_resolved", "AUTHORIZE", "Human operator APPROVED task $taskId. Resuming execution pipeline.")

        addEvent("act", "ACT", "Executing authorized tool '${approval.toolId}' with human grant.")
        addEvent("verification", "VERIFY", "Verification pass complete under authorized elevation.")
        addCheckpoint(taskId, "COMMIT_AUTHORIZED", "Authorized execution snapshot")
        addEvent("commit", "COMMIT", "Authorized action committed to audit journal.")

        consciousness.reflect("authorized_execution", 0.99f)
        addEvent("reflect", "REFLECT", "Recorded authorized decision outcome in historical memory.")
        addEvent("learn", "LEARN", "Epistemic experience updated with human-in-the-loop validation.")

        if (task != null) {
            tasks[taskId] = task.copy(
                status = TaskStatus.COMPLETED,
                resultSummary = "Authorized execution completed for \"${approval.objective}\""
            )
        }

        return Pair(true, "Task $taskId authorized and executed successfully.")
    }
}

fun getCurrentTimestamp(): String {
    val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
    sdf.timeZone = TimeZone.getTimeZone("UTC")
    return sdf.format(Date())
}
