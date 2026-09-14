package com.example.positron.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Gavel
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.positron.model.ApprovalRecord
import com.example.positron.model.ApprovalStatus
import com.example.positron.model.RiskLevel
import com.example.positron.ui.theme.*

@Composable
fun GuardianApprovalsView(
    approvals: List<ApprovalRecord>,
    onResolveApproval: (taskId: String, approved: Boolean) -> Unit
) {
    val pending = approvals.filter { it.status == ApprovalStatus.PENDING }
    val history = approvals.filter { it.status != ApprovalStatus.PENDING }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Policy Boundary Header Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, Amber400.copy(alpha = 0.4f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Shield, contentDescription = null, tint = Amber400, modifier = Modifier.size(24.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Positron Guardian Security Console",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate100
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "The Guardian policy engine isolates LLM planning from high-impact side-effects. High-risk actions (production deployment, data purges, financial actions) require explicit human authorization before execution.",
                        fontSize = 12.sp,
                        color = Slate300,
                        lineHeight = 16.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        PolicyStatChip("Pending Requests", pending.size.toString(), Amber400)
                        PolicyStatChip("Total Evaluated", approvals.size.toString(), Sky400)
                        PolicyStatChip("Policy Gate", "ACTIVE (Enforced)", Emerald400)
                    }
                }
            }
        }

        // Pending Authorization Requests Section
        item {
            Text(
                text = "Pending Human Authorization (${pending.size})",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Slate100
            )
        }

        if (pending.isEmpty()) {
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Slate900),
                    shape = RoundedCornerShape(8.dp),
                    border = BorderStroke(1.dp, Slate800),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No pending approval requests. Dispatch high-risk tasks (e.g., 'deploy production') to trigger Guardian authorization.",
                            fontSize = 12.sp,
                            color = Slate400
                        )
                    }
                }
            }
        } else {
            items(pending) { record ->
                ApprovalCard(
                    record = record,
                    onApprove = { onResolveApproval(record.taskId, true) },
                    onReject = { onResolveApproval(record.taskId, false) }
                )
            }
        }

        // Authorization History Section
        item {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Authorization Audit History (${history.size})",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Slate100
            )
        }

        if (history.isEmpty()) {
            item {
                Text("No past authorizations recorded.", fontSize = 12.sp, color = Slate400)
            }
        } else {
            items(history) { record ->
                HistoryCard(record = record)
            }
        }
    }
}

@Composable
private fun PolicyStatChip(label: String, value: String, color: androidx.compose.ui.graphics.Color) {
    Column {
        Text(label, fontSize = 10.sp, color = Slate400)
        Text(value, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = color, fontFamily = FontFamily.Monospace)
    }
}

@Composable
private fun ApprovalCard(
    record: ApprovalRecord,
    onApprove: () -> Unit,
    onReject: () -> Unit
) {
    val riskColor = when (record.risk) {
        RiskLevel.IRREVERSIBLE -> Red400
        RiskLevel.HIGH -> Red400
        RiskLevel.MEDIUM -> Amber400
        RiskLevel.LOW -> Emerald400
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = Amber400.copy(alpha = 0.10f)),
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, Amber400.copy(alpha = 0.6f)),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .background(riskColor.copy(alpha = 0.2f))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = record.risk.name,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = riskColor,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Tool: ${record.toolId}",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate100,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Text(
                    text = record.createdAt.takeLast(12).dropLast(1),
                    fontSize = 10.sp,
                    color = Slate400,
                    fontFamily = FontFamily.Monospace
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
            Text("Objective: \"${record.objective}\"", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = Slate100)
            Spacer(modifier = Modifier.height(4.dp))
            Text("Guardian Policy Note: ${record.reason}", fontSize = 11.sp, color = Slate300)

            Spacer(modifier = Modifier.height(12.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedButton(
                    onClick = onReject,
                    shape = RoundedCornerShape(6.dp),
                    border = BorderStroke(1.dp, Red400),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Red400),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                ) {
                    Icon(Icons.Default.Close, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Deny Action", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.width(8.dp))

                Button(
                    onClick = onApprove,
                    shape = RoundedCornerShape(6.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Emerald400, contentColor = Slate950),
                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 4.dp)
                ) {
                    Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Authorize Execution", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun HistoryCard(record: ApprovalRecord) {
    val isApproved = record.status == ApprovalStatus.APPROVED
    val statusColor = if (isApproved) Emerald400 else Red400
    val statusText = if (isApproved) "APPROVED" else "REJECTED"

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
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = statusText,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = statusColor,
                        fontFamily = FontFamily.Monospace
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Tool: ${record.toolId}", fontSize = 11.sp, color = Slate100, fontFamily = FontFamily.Monospace)
                }
                Text(record.resolvedAt?.takeLast(12)?.dropLast(1) ?: "", fontSize = 10.sp, color = Slate400, fontFamily = FontFamily.Monospace)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(record.objective, fontSize = 11.sp, color = Slate300)
        }
    }
}
