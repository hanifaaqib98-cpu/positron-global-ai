package com.example.positron

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.positron.model.ApprovalStatus
import com.example.positron.ui.components.*
import com.example.positron.ui.theme.*
import com.example.positron.viewmodel.PositronViewModel

enum class PositronTab(val id: String, val title: String, val icon: ImageVector) {
    RUNTIME("runtime", "Runtime", Icons.Default.Speed),
    GUARDIAN("guardian", "Guardian", Icons.Default.Shield),
    GATEWAY("gateway", "Gateway", Icons.Default.CellTower),
    ECOSYSTEM("ecosystem", "Ecosystem", Icons.Default.Public),
    EPISTEMIC("epistemic", "Epistemic", Icons.Default.Psychology),
    SKILLS("skills", "Skills", Icons.Default.Build),
    AGI("agi", "AGI Core", Icons.Default.AutoAwesome)
}

class MainActivity : ComponentActivity() {
    private val viewModel: PositronViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            PositronTheme {
                PositronApp(viewModel = viewModel)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PositronApp(viewModel: PositronViewModel) {
    var selectedTab by remember { mutableStateOf(PositronTab.RUNTIME) }

    val events by viewModel.events.collectAsState()
    val checkpoints by viewModel.checkpoints.collectAsState()
    val approvals by viewModel.approvals.collectAsState()
    val channels by viewModel.channels.collectAsState()
    val skills by viewModel.skills.collectAsState()
    val schedules by viewModel.schedules.collectAsState()
    val outbox by viewModel.outbox.collectAsState()
    val consciousness by viewModel.consciousness.collectAsState()
    val lastRunResult by viewModel.lastRunResult.collectAsState()
    val isExecuting by viewModel.isExecuting.collectAsState()
    val activeStage by viewModel.activeStage.collectAsState()
    val filterStage by viewModel.filterStage.collectAsState()

    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val selectedCapability by viewModel.selectedCapability.collectAsState()

    val evidenceList by viewModel.evidenceList.collectAsState()
    val epistemicResult by viewModel.epistemicResult.collectAsState()

    val agiStage by viewModel.agiStage.collectAsState()
    val agiAlignmentMetrics by viewModel.agiAlignmentMetrics.collectAsState()
    val agiRsiLogs by viewModel.agiRsiLogs.collectAsState()
    val agiSynthesizedGoals by viewModel.agiSynthesizedGoals.collectAsState()

    val pendingApprovalsCount = remember(approvals) { approvals.count { it.status == ApprovalStatus.PENDING } }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = MaterialTheme.shapes.small,
                            color = Sky400,
                            modifier = Modifier.size(28.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    text = "P",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp,
                                    color = Slate950,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "POSITRON GLOBAL AI",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate100,
                                fontFamily = FontFamily.Monospace
                            )
                            Text(
                                text = "2026 Autonomous Agent Reference Engine",
                                fontSize = 10.sp,
                                color = Slate400
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Slate900,
                    titleContentColor = Slate100
                ),
                actions = {
                    if (pendingApprovalsCount > 0) {
                        Badge(
                            containerColor = Amber400,
                            contentColor = Slate950,
                            modifier = Modifier.padding(end = 12.dp)
                        ) {
                            Text("$pendingApprovalsCount PENDING", fontSize = 10.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
                        }
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = Slate900,
                contentColor = Slate100,
                modifier = Modifier.windowInsetsPadding(WindowInsets.navigationBars)
            ) {
                PositronTab.values().forEach { tab ->
                    NavigationBarItem(
                        selected = selectedTab == tab,
                        onClick = { selectedTab = tab },
                        icon = {
                            BadgedBox(
                                badge = {
                                    if (tab == PositronTab.GUARDIAN && pendingApprovalsCount > 0) {
                                        Badge(containerColor = Amber400) {
                                            Text(pendingApprovalsCount.toString(), color = Slate950)
                                        }
                                    }
                                }
                            ) {
                                Icon(tab.icon, contentDescription = tab.title)
                            }
                        },
                        label = {
                            Text(
                                text = tab.title,
                                fontSize = 10.sp,
                                fontWeight = if (selectedTab == tab) FontWeight.Bold else FontWeight.Normal
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Sky400,
                            selectedTextColor = Sky400,
                            indicatorColor = Slate800,
                            unselectedIconColor = Slate400,
                            unselectedTextColor = Slate400
                        )
                    )
                }
            }
        },
        containerColor = Slate950
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (selectedTab) {
                PositronTab.RUNTIME -> RuntimePipelineView(
                    events = events,
                    checkpoints = checkpoints,
                    activeStage = activeStage,
                    isExecuting = isExecuting,
                    lastResult = lastRunResult,
                    filterStage = filterStage,
                    onFilterStageChange = { viewModel.setFilterStage(it) },
                    onTriggerRun = { viewModel.triggerRun(it) },
                    onResetState = { viewModel.resetState() },
                    onNavigateToGuardian = { selectedTab = PositronTab.GUARDIAN }
                )
                PositronTab.GUARDIAN -> GuardianApprovalsView(
                    approvals = approvals,
                    onResolveApproval = { taskId, approved -> viewModel.resolveApproval(taskId, approved) }
                )
                PositronTab.GATEWAY -> GatewayManagerView(
                    channels = channels,
                    outbox = outbox,
                    onToggleChannel = { id, enabled -> viewModel.toggleChannel(id, enabled) },
                    onTestEnvelope = { ch, sender, content, auth -> viewModel.testEnvelope(ch, sender, content, auth) }
                )
                PositronTab.ECOSYSTEM -> EcosystemSweepView(
                    searchQuery = searchQuery,
                    onSearchQueryChange = { viewModel.setSearchQuery(it) },
                    selectedCategory = selectedCategory,
                    onSelectedCategoryChange = { viewModel.setSelectedCategory(it) },
                    selectedCapability = selectedCapability,
                    onSelectedCapabilityChange = { viewModel.setSelectedCapability(it) }
                )
                PositronTab.EPISTEMIC -> EpistemicConsciousnessView(
                    consciousness = consciousness,
                    evidenceList = evidenceList,
                    epistemicResult = epistemicResult,
                    onAddEvidence = { claim, src, stat, conf -> viewModel.addEvidence(claim, src, stat, conf) },
                    onRemoveEvidence = { idx -> viewModel.removeEvidence(idx) }
                )
                PositronTab.SKILLS -> SkillsSchedulerView(
                    skills = skills,
                    schedules = schedules,
                    onToggleSkill = { id, enabled -> viewModel.toggleSkill(id, enabled) },
                    onToggleSchedule = { id, enabled -> viewModel.toggleSchedule(id, enabled) }
                )
                PositronTab.AGI -> AgiFutureCoreView(
                    currentStage = agiStage,
                    alignmentMetrics = agiAlignmentMetrics,
                    rsiLogs = agiRsiLogs,
                    synthesizedGoals = agiSynthesizedGoals,
                    onTriggerRsi = { viewModel.triggerRsiPass() },
                    onSynthesizeMacroGoal = { viewModel.synthesizeAgiMacroGoal(it) },
                    onStageSelect = { viewModel.setAgiStage(it) }
                )
            }
        }
    }
}
