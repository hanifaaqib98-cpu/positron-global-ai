package com.example.positron.ui.components

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.positron.model.*
import com.example.positron.ui.theme.*

private val STAGES = listOf(
    "OBSERVE", "CONTEXT", "REASON", "PLAN", "RSCL", "VALUE/RISK",
    "GUARDIAN", "AUTHORIZE", "ACT", "VERIFY", "COMMIT", "REFLECT", "LEARN"
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RuntimePipelineView(
    events: List<RuntimeEvent>,
    checkpoints: List<Checkpoint>,
    activeStage: String,
    isExecuting: Boolean,
    lastResult: EngineRunResult?,
    filterStage: String,
    onFilterStageChange: (String) -> Unit,
    onTriggerRun: (String) -> Unit,
    onResetState: () -> Unit,
    onNavigateToGuardian: () -> Unit
) {
    var prompt by remember { mutableStateOf("") }
    val keyboardController = LocalSoftwareKeyboardController.current

    val presets = remember {
        listOf(
            "Architecture Inquiry" to "Explain the Positron 23-layer architecture and governance guarantees",
            "Trigger High-Risk Deploy" to "Deploy production release v1.4 to production cluster",
            "Epistemic Truth Sweep" to "Verify multi-source conflicting evidence regarding orbital trajectory",
            "Data Scrubbing Task" to "Execute purge and scrub of ephemeral session logs"
        )
    }

    val filteredEvents = remember(events, filterStage) {
        if (filterStage == "ALL") events
        else events.filter { it.stage.uppercase() == filterStage }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // 13-Stage Visual Pipeline Ribbon Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, Slate800),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Speed, contentDescription = null, tint = Sky400, modifier = Modifier.size(20.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "POSITRON 13-STAGE EXECUTION LOOP",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate100,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                        Text(
                            text = "Bounded Retries: 3 | Zero Direct Access",
                            fontSize = 10.sp,
                            color = Slate400,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        items(STAGES.size) { idx ->
                            val stageName = STAGES[idx]
                            val isActive = activeStage == stageName
                            val isGuardian = stageName == "GUARDIAN" || stageName == "AUTHORIZE"
                            val isVerify = stageName == "VERIFY"

                            val chipBg = when {
                                isActive -> Sky500.copy(alpha = 0.25f)
                                isGuardian -> Amber400.copy(alpha = 0.15f)
                                isVerify -> Emerald400.copy(alpha = 0.15f)
                                else -> Slate950.copy(alpha = 0.6f)
                            }
                            val chipBorder = when {
                                isActive -> Sky400
                                isGuardian -> Amber400.copy(alpha = 0.6f)
                                isVerify -> Emerald400.copy(alpha = 0.6f)
                                else -> Slate800
                            }
                            val chipText = when {
                                isActive -> Sky400
                                isGuardian -> Amber400
                                isVerify -> Emerald400
                                else -> Slate400
                            }

                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(chipBg)
                                    .border(1.dp, chipBorder, RoundedCornerShape(6.dp))
                                    .padding(horizontal = 8.dp, vertical = 6.dp)
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text(
                                        text = "%02d".format(idx + 1),
                                        fontSize = 9.sp,
                                        color = Slate400,
                                        fontFamily = FontFamily.Monospace
                                    )
                                    Text(
                                        text = stageName,
                                        fontSize = 11.sp,
                                        fontWeight = if (isActive) FontWeight.Bold else FontWeight.Medium,
                                        color = chipText,
                                        fontFamily = FontFamily.Monospace
                                    )
                                }
                            }

                            if (idx < STAGES.size - 1) {
                                Icon(
                                    imageVector = Icons.Default.ChevronRight,
                                    contentDescription = null,
                                    tint = Slate700,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                }
            }
        }

        // Task Execution Form Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, Slate800),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.PlayArrow, contentDescription = null, tint = Emerald400, modifier = Modifier.size(20.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Dispatch Task to Positron Engine",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate100
                            )
                        }

                        IconButton(
                            onClick = onResetState,
                            modifier = Modifier.size(32.dp)
                        ) {
                            Icon(Icons.Default.Refresh, contentDescription = "Reset State", tint = Slate400, modifier = Modifier.size(18.dp))
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedTextField(
                            value = prompt,
                            onValueChange = { prompt = it },
                            placeholder = { Text("Enter objective or tool instruction...", color = Slate400, fontSize = 13.sp) },
                            singleLine = true,
                            enabled = !isExecuting,
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(8.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedContainerColor = Slate950,
                                unfocusedContainerColor = Slate950,
                                disabledContainerColor = Slate950,
                                focusedBorderColor = Sky400,
                                unfocusedBorderColor = Slate700,
                                focusedTextColor = Slate100,
                                unfocusedTextColor = Slate100
                            ),
                            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                            keyboardActions = KeyboardActions(onDone = {
                                keyboardController?.hide()
                                if (prompt.isNotBlank() && !isExecuting) {
                                    onTriggerRun(prompt)
                                }
                            })
                        )

                        Button(
                            onClick = {
                                keyboardController?.hide()
                                if (prompt.isNotBlank() && !isExecuting) {
                                    onTriggerRun(prompt)
                                }
                            },
                            enabled = !isExecuting && prompt.isNotBlank(),
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Sky400,
                                contentColor = Slate950
                            )
                        ) {
                            if (isExecuting) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(16.dp),
                                    color = Slate950,
                                    strokeWidth = 2.dp
                                )
                            } else {
                                Icon(Icons.Default.PlayArrow, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Execute", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Quick Presets
                    Text("Quick Presets:", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Medium)
                    Spacer(modifier = Modifier.height(6.dp))
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        items(presets) { (label, query) ->
                            FilterChip(
                                selected = false,
                                onClick = { prompt = query },
                                label = { Text(label, fontSize = 11.sp, color = Slate300) },
                                colors = FilterChipDefaults.filterChipColors(containerColor = Slate800),
                                border = FilterChipDefaults.filterChipBorder(enabled = true, selected = false, borderColor = Slate700)
                            )
                        }
                    }

                    // Execution Outcome Card
                    if (lastResult != null) {
                        Spacer(modifier = Modifier.height(12.dp))
                        val isPaused = lastResult.status == "paused_for_approval"
                        val containerBg = if (isPaused) Amber400.copy(alpha = 0.15f) else Emerald400.copy(alpha = 0.15f)
                        val borderColor = if (isPaused) Amber400 else Emerald400
                        val statusText = if (isPaused) "GUARDIAN ENFORCEMENT: PAUSED FOR APPROVAL" else "EXECUTION COMPLETED VERIFIED"

                        Card(
                            colors = CardDefaults.cardColors(containerColor = containerBg),
                            shape = RoundedCornerShape(8.dp),
                            border = BorderStroke(1.dp, borderColor),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(12.dp)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(
                                            imageVector = if (isPaused) Icons.Default.Security else Icons.Default.CheckCircle,
                                            contentDescription = null,
                                            tint = if (isPaused) Amber400 else Emerald400,
                                            modifier = Modifier.size(18.dp)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = statusText,
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (isPaused) Amber400 else Emerald400,
                                            fontFamily = FontFamily.Monospace
                                        )
                                    }

                                    if (isPaused) {
                                        TextButton(
                                            onClick = onNavigateToGuardian,
                                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                            colors = ButtonDefaults.textButtonColors(containerColor = Amber400, contentColor = Slate950)
                                        ) {
                                            Text("Open Guardian Console →", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                }

                                Spacer(modifier = Modifier.height(6.dp))
                                Text(lastResult.message, fontSize = 12.sp, color = Slate100)

                                if (lastResult.approvalRecord != null) {
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = "Tool: ${lastResult.approvalRecord.toolId} | Risk: ${lastResult.approvalRecord.risk.name}",
                                        fontSize = 10.sp,
                                        color = Amber400,
                                        fontFamily = FontFamily.Monospace
                                    )
                                    Text(
                                        text = "Reason: ${lastResult.approvalRecord.reason}",
                                        fontSize = 10.sp,
                                        color = Slate300
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Live Event Stream & Checkpoints Title Bar
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Runtime Event Journal (${events.size})",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Slate100
                )

                // Stage filter dropdown chip bar
                LazyRow(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    item {
                        FilterChip(
                            selected = filterStage == "ALL",
                            onClick = { onFilterStageChange("ALL") },
                            label = { Text("ALL", fontSize = 10.sp) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = Sky400,
                                selectedLabelColor = Slate950,
                                containerColor = Slate900,
                                labelColor = Slate300
                            )
                        )
                    }
                    items(STAGES) { s ->
                        FilterChip(
                            selected = filterStage == s,
                            onClick = { onFilterStageChange(s) },
                            label = { Text(s, fontSize = 10.sp) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = Sky400,
                                selectedLabelColor = Slate950,
                                containerColor = Slate900,
                                labelColor = Slate300
                            )
                        )
                    }
                }
            }
        }

        // Event Stream List
        if (filteredEvents.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("No events recorded for current filter.", fontSize = 12.sp, color = Slate400)
                }
            }
        } else {
            items(filteredEvents) { evt ->
                val isAuthRequired = evt.eventType == "approval_pending"
                val isVerify = evt.eventType == "verification"
                val cardBg = when {
                    isAuthRequired -> Amber400.copy(alpha = 0.12f)
                    isVerify -> Emerald400.copy(alpha = 0.12f)
                    else -> Slate900
                }
                val borderColor = when {
                    isAuthRequired -> Amber400.copy(alpha = 0.6f)
                    isVerify -> Emerald400.copy(alpha = 0.6f)
                    else -> Slate800
                }

                Card(
                    colors = CardDefaults.cardColors(containerColor = cardBg),
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, borderColor),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(Slate800)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(evt.stage, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Slate100, fontFamily = FontFamily.Monospace)
                            }
                            Text(evt.timestamp.takeLast(12).dropLast(1), fontSize = 10.sp, color = Slate400, fontFamily = FontFamily.Monospace)
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(evt.message, fontSize = 12.sp, color = Slate100)

                        if (!evt.details.isNullOrBlank()) {
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = evt.details,
                                fontSize = 10.sp,
                                color = Slate400,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }
                }
            }
        }

        // Checkpoints Title & Items
        item {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "State Checkpoints (${checkpoints.size})",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Slate100
            )
        }

        if (checkpoints.isEmpty()) {
            item {
                Text("No checkpoints stored yet.", fontSize = 12.sp, color = Slate400)
            }
        } else {
            items(checkpoints) { cp ->
                Card(
                    colors = CardDefaults.cardColors(containerColor = Slate900),
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, Slate800),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(cp.stage, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Emerald400, fontFamily = FontFamily.Monospace)
                            Text(cp.timestamp.takeLast(12).dropLast(1), fontSize = 10.sp, color = Slate400, fontFamily = FontFamily.Monospace)
                        }
                        Text("Task: ${cp.taskId}", fontSize = 10.sp, color = Slate300, fontFamily = FontFamily.Monospace)
                        Text(cp.snapshot, fontSize = 10.sp, color = Slate400, fontFamily = FontFamily.Monospace)
                    }
                }
            }
        }
    }
}

private fun String?.isNull_or_blank(): Boolean = this == null || this.isBlank()
