package com.example.positron.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.positron.model.ConsciousnessState
import com.example.positron.model.EpistemicResult
import com.example.positron.model.Evidence
import com.example.positron.model.EvidenceStatus
import com.example.positron.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EpistemicConsciousnessView(
    consciousness: ConsciousnessState,
    evidenceList: List<Evidence>,
    epistemicResult: EpistemicResult?,
    onAddEvidence: (claim: String, source: String, status: EvidenceStatus, confidence: Float) -> Unit,
    onRemoveEvidence: (index: Int) -> Unit
) {
    var newClaim by remember { mutableStateOf("") }
    var newSource by remember { mutableStateOf("") }
    var newStatus by remember { mutableStateOf(EvidenceStatus.VERIFIED) }
    var newConfidence by remember { mutableStateOf(0.90f) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Consciousness Core Overview Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, Sky400.copy(alpha = 0.5f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Psychology, contentDescription = null, tint = Sky400, modifier = Modifier.size(24.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Positron Subjective Consciousness Core",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate100
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("Consciousness Status", fontSize = 10.sp, color = Slate400)
                            Text(
                                text = consciousness.subjectiveStatus.uppercase(),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Emerald400,
                                fontFamily = FontFamily.Monospace
                            )
                        }

                        Column {
                            Text("Attended Focus", fontSize = 10.sp, color = Slate400)
                            Text(
                                text = consciousness.attendedFocus ?: "Global Policy",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Sky400,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }

                    if (consciousness.perceivedItems.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Perceived Items:", fontSize = 11.sp, color = Slate400, fontWeight = FontWeight.Medium)
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            consciousness.perceivedItems.take(4).forEach { item ->
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(4.dp))
                                        .background(Slate800)
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(item, fontSize = 10.sp, color = Slate300, fontFamily = FontFamily.Monospace)
                                }
                            }
                        }
                    }
                }
            }
        }

        // Epistemic Reconciliation Title
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Psychology, contentDescription = null, tint = Emerald400, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Epistemic Evidence Reconciliation Engine",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Slate100
                )
            }
        }

        // Add Evidence Input Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(10.dp),
                border = BorderStroke(1.dp, Slate800),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("Add Evidence Observation", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate100)
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = newClaim,
                        onValueChange = { newClaim = it },
                        label = { Text("Factual Claim", fontSize = 11.sp, color = Slate400) },
                        placeholder = { Text("e.g. Solar Array 4 output steady at 120kW", fontSize = 11.sp, color = Slate400) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Sky400,
                            unfocusedBorderColor = Slate700,
                            focusedTextColor = Slate100,
                            unfocusedTextColor = Slate100
                        )
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedTextField(
                            value = newSource,
                            onValueChange = { newSource = it },
                            label = { Text("Evidence Source", fontSize = 11.sp, color = Slate400) },
                            singleLine = true,
                            modifier = Modifier.weight(1f),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Sky400,
                                unfocusedBorderColor = Slate700,
                                focusedTextColor = Slate100,
                                unfocusedTextColor = Slate100
                            )
                        )

                        Button(
                            onClick = {
                                if (newClaim.isNotBlank()) {
                                    val sourceStr = if (newSource.isBlank()) "Sensor Node A" else newSource
                                    onAddEvidence(newClaim, sourceStr, newStatus, newConfidence)
                                    newClaim = ""
                                    newSource = ""
                                }
                            },
                            modifier = Modifier.align(Alignment.CenterVertically),
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Emerald400, contentColor = Slate950)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Add Claim", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Dynamic Epistemic Synthesis Result Card
        if (epistemicResult != null) {
            item {
                val hasContradiction = epistemicResult.contradiction
                val containerBg = if (hasContradiction) Red400.copy(alpha = 0.15f) else Emerald400.copy(alpha = 0.15f)
                val borderColor = if (hasContradiction) Red400 else Emerald400

                Card(
                    colors = CardDefaults.cardColors(containerColor = containerBg),
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, borderColor),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = if (hasContradiction) "CONTRADICTION DETECTED" else "EPISTEMIC CONSENSUS ACHIEVED",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (hasContradiction) Red400 else Emerald400,
                                fontFamily = FontFamily.Monospace
                            )
                            Text(
                                text = "Confidence: ${(epistemicResult.confidence * 100).toInt()}%",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate100,
                                fontFamily = FontFamily.Monospace
                            )
                        }

                        Spacer(modifier = Modifier.height(6.dp))
                        Text(epistemicResult.synthesizedView, fontSize = 12.sp, color = Slate100, lineHeight = 16.sp)
                    }
                }
            }
        }

        // Evidence Items List
        item {
            Text(
                text = "Submitted Claims & Evidence (${evidenceList.size})",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = Slate100
            )
        }

        itemsIndexed(evidenceList) { idx, item ->
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(8.dp),
                border = BorderStroke(1.dp, Slate800),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(item.claim, fontSize = 12.sp, fontWeight = FontWeight.Medium, color = Slate100)
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Source: ${item.source} | Status: ${item.status.name} | Conf: ${(item.confidence * 100).toInt()}%",
                            fontSize = 10.sp,
                            color = Slate400,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    IconButton(
                        onClick = { onRemoveEvidence(idx) },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(Icons.Default.Delete, contentDescription = "Remove", tint = Red400, modifier = Modifier.size(16.dp))
                    }
                }
            }
        }
    }
}
