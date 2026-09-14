package com.example.positron.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.positron.data.CatalogData
import com.example.positron.data.EpistemicReconciler
import com.example.positron.data.PositronEngine
import com.example.positron.model.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class PositronViewModel : ViewModel() {
    private val engine = PositronEngine()

    private val _events = MutableStateFlow<List<RuntimeEvent>>(emptyList())
    val events: StateFlow<List<RuntimeEvent>> = _events.asStateFlow()

    private val _checkpoints = MutableStateFlow<List<Checkpoint>>(emptyList())
    val checkpoints: StateFlow<List<Checkpoint>> = _checkpoints.asStateFlow()

    private val _approvals = MutableStateFlow<List<ApprovalRecord>>(emptyList())
    val approvals: StateFlow<List<ApprovalRecord>> = _approvals.asStateFlow()

    private val _channels = MutableStateFlow<List<ChannelSpec>>(emptyList())
    val channels: StateFlow<List<ChannelSpec>> = _channels.asStateFlow()

    private val _skills = MutableStateFlow<List<SkillSpec>>(emptyList())
    val skills: StateFlow<List<SkillSpec>> = _skills.asStateFlow()

    private val _schedules = MutableStateFlow<List<ScheduledTask>>(emptyList())
    val schedules: StateFlow<List<ScheduledTask>> = _schedules.asStateFlow()

    private val _outbox = MutableStateFlow<List<Map<String, String>>>(emptyList())
    val outbox: StateFlow<List<Map<String, String>>> = _outbox.asStateFlow()

    private val _consciousness = MutableStateFlow(ConsciousnessState())
    val consciousness: StateFlow<ConsciousnessState> = _consciousness.asStateFlow()

    private val _lastRunResult = MutableStateFlow<EngineRunResult?>(null)
    val lastRunResult: StateFlow<EngineRunResult?> = _lastRunResult.asStateFlow()

    private val _isExecuting = MutableStateFlow(false)
    val isExecuting: StateFlow<Boolean> = _isExecuting.asStateFlow()

    private val _activeStage = MutableStateFlow("")
    val activeStage: StateFlow<String> = _activeStage.asStateFlow()

    private val _filterStage = MutableStateFlow("ALL")
    val filterStage: StateFlow<String> = _filterStage.asStateFlow()

    // Ecosystem Sweep state
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedCategory = MutableStateFlow("ALL")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()

    private val _selectedCapability = MutableStateFlow("ALL")
    val selectedCapability: StateFlow<String> = _selectedCapability.asStateFlow()

    // Epistemic Evidence Reconciliation state
    private val _evidenceList = MutableStateFlow<List<Evidence>>(
        listOf(
            Evidence("Satellite imagery confirms structural integrity of Solar Array 4", "Orbital Sentinel 9", EvidenceStatus.VERIFIED, 0.95f),
            Evidence("Telemetry logs report thermal anomaly on Solar Array 4", "Telemetry Bus B", EvidenceStatus.SUPPORTED, 0.88f)
        )
    )
    val evidenceList: StateFlow<List<Evidence>> = _evidenceList.asStateFlow()

    private val _epistemicResult = MutableStateFlow<EpistemicResult?>(null)
    val epistemicResult: StateFlow<EpistemicResult?> = _epistemicResult.asStateFlow()

    // AGI Core state
    private val _agiStage = MutableStateFlow(AgiStage.RECURSIVE_SELF_IMPROVEMENT)
    val agiStage: StateFlow<AgiStage> = _agiStage.asStateFlow()

    private val _agiAlignmentMetrics = MutableStateFlow<List<AgiAlignmentMetric>>(emptyList())
    val agiAlignmentMetrics: StateFlow<List<AgiAlignmentMetric>> = _agiAlignmentMetrics.asStateFlow()

    private val _agiRsiLogs = MutableStateFlow<List<AgiSelfImprovementLoop>>(emptyList())
    val agiRsiLogs: StateFlow<List<AgiSelfImprovementLoop>> = _agiRsiLogs.asStateFlow()

    private val _agiSynthesizedGoals = MutableStateFlow<List<AgiSubGoal>>(emptyList())
    val agiSynthesizedGoals: StateFlow<List<AgiSubGoal>> = _agiSynthesizedGoals.asStateFlow()

    init {
        syncState()
        reconcileEvidence()
    }

    fun syncState() {
        _events.value = engine.events.toList()
        _checkpoints.value = engine.checkpoints.toList()
        _approvals.value = engine.approvals.values.toList()
        _channels.value = engine.gateway.getChannels()
        _skills.value = engine.skills.getSkills()
        _schedules.value = engine.scheduler.getTasks()
        _outbox.value = engine.gateway.outbox.toList()
        _consciousness.value = engine.consciousness.state

        _agiStage.value = engine.agi.stage
        _agiAlignmentMetrics.value = engine.agi.alignmentMetrics.toList()
        _agiRsiLogs.value = engine.agi.selfImprovementLogs.toList()
        _agiSynthesizedGoals.value = engine.agi.synthesizedGoals.toList()
    }

    fun setFilterStage(stage: String) {
        _filterStage.value = stage
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setSelectedCategory(category: String) {
        _selectedCategory.value = category
    }

    fun setSelectedCapability(capability: String) {
        _selectedCapability.value = capability
    }

    fun triggerRun(userInput: String) {
        if (userInput.isBlank() || _isExecuting.value) return
        _isExecuting.value = true

        viewModelScope.launch {
            val stages = listOf("OBSERVE", "CONTEXT", "REASON", "PLAN", "RSCL", "VALUE/RISK", "GUARDIAN")
            for (stage in stages) {
                _activeStage.value = stage
                delay(150)
            }

            val result = engine.run(userInput)
            if (result.status == "paused_for_approval") {
                _activeStage.value = "AUTHORIZE"
            } else {
                _activeStage.value = "LEARN"
            }

            _lastRunResult.value = result
            syncState()

            delay(600)
            _isExecuting.value = false
            _activeStage.value = ""
        }
    }

    fun resolveApproval(taskId: String, approved: Boolean) {
        viewModelScope.launch {
            engine.resolveApproval(taskId, approved)
            syncState()
        }
    }

    fun toggleChannel(channelId: String, enabled: Boolean) {
        val current = engine.gateway.getChannels().find { it.channelId == channelId } ?: return
        engine.gateway.updateChannel(current.copy(enabled = enabled))
        syncState()
    }

    fun testEnvelope(channel: String, sender: String, content: String, authenticated: Boolean): String {
        val env = GatewayEnvelope(channel, sender, authenticated, content)
        val res = engine.gateway.receive(env)
        syncState()
        return res.second
    }

    fun toggleSkill(skillId: String, enabled: Boolean) {
        engine.skills.toggleSkill(skillId, enabled)
        syncState()
    }

    fun toggleSchedule(scheduleId: String, enabled: Boolean) {
        engine.scheduler.toggleTask(scheduleId, enabled)
        syncState()
    }

    fun addEvidence(claim: String, source: String, status: EvidenceStatus, confidence: Float) {
        val newEvidence = Evidence(claim, source, status, confidence)
        _evidenceList.value = _evidenceList.value + newEvidence
        reconcileEvidence()
    }

    fun removeEvidence(index: Int) {
        val current = _evidenceList.value.toMutableList()
        if (index in current.indices) {
            current.removeAt(index)
            _evidenceList.value = current
            reconcileEvidence()
        }
    }

    fun reconcileEvidence() {
        val res = EpistemicReconciler.reconcile(_evidenceList.value)
        _epistemicResult.value = res
    }

    fun triggerRsiPass() {
        engine.agi.triggerRecursiveSelfImprovement()
        syncState()
    }

    fun synthesizeAgiMacroGoal(macroObjective: String) {
        if (macroObjective.isBlank()) return
        engine.agi.synthesizeGoalFromMacroInput(macroObjective)
        syncState()
    }

    fun setAgiStage(stage: AgiStage) {
        engine.agi.advanceStage(stage)
        syncState()
    }

    fun resetState() {
        viewModelScope.launch {
            engine.reset()
            _lastRunResult.value = null
            syncState()
        }
    }
}
