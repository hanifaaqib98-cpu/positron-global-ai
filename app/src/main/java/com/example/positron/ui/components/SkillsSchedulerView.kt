package com.example.positron.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.positron.model.RiskLevel
import com.example.positron.model.ScheduledTask
import com.example.positron.model.SkillSpec
import com.example.positron.ui.theme.*

@Composable
fun SkillsSchedulerView(
    skills: List<SkillSpec>,
    schedules: List<ScheduledTask>,
    onToggleSkill: (skillId: String, enabled: Boolean) -> Unit,
    onToggleSchedule: (scheduleId: String, enabled: Boolean) -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, Slate800),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Build, contentDescription = null, tint = Sky400, modifier = Modifier.size(24.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Positron Skill Specifications & Autonomous Scheduler",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate100
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Granular capability delegation and recurring cron schedules. Skills encapsulate tools under specific permission scopes and risk boundaries.",
                        fontSize = 12.sp,
                        color = Slate300
                    )
                }
            }
        }

        // Skills Section
        item {
            Text(
                text = "Registered Agent Skills (${skills.size})",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Slate100
            )
        }

        items(skills) { skill ->
            val riskColor = when (skill.risk) {
                RiskLevel.IRREVERSIBLE -> Red400
                RiskLevel.HIGH -> Red400
                RiskLevel.MEDIUM -> Amber400
                RiskLevel.LOW -> Emerald400
            }

            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(10.dp),
                border = BorderStroke(1.dp, if (skill.enabled) Sky400.copy(alpha = 0.4f) else Slate800),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = skill.skillId,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = Slate100,
                                fontFamily = FontFamily.Monospace
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(riskColor.copy(alpha = 0.2f))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = skill.risk.name,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = riskColor,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(skill.description, fontSize = 12.sp, color = Slate300)

                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Tools: ${skill.toolIds.joinToString(", ")} | Scope: ${skill.permissionScope}",
                            fontSize = 10.sp,
                            color = Slate400,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    Switch(
                        checked = skill.enabled,
                        onCheckedChange = { onToggleSkill(skill.skillId, it) },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Slate950,
                            checkedTrackColor = Sky400,
                            uncheckedThumbColor = Slate400,
                            uncheckedTrackColor = Slate800
                        )
                    )
                }
            }
        }

        // Scheduled Autonomous Tasks Section
        item {
            Spacer(modifier = Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Schedule, contentDescription = null, tint = Emerald400, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Scheduled Autonomous Tasks (${schedules.size})",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Slate100
                )
            }
        }

        items(schedules) { task ->
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(10.dp),
                border = BorderStroke(1.dp, if (task.enabled) Emerald400.copy(alpha = 0.4f) else Slate800),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = task.scheduleId,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = Emerald400,
                                fontFamily = FontFamily.Monospace
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(Slate800)
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = task.cadence,
                                    fontSize = 9.sp,
                                    color = Sky400,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(task.objective, fontSize = 12.sp, color = Slate100)

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Requires Guardian Approval: ${if (task.requiresApproval) "YES" else "NO"}",
                            fontSize = 10.sp,
                            color = Slate400,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    Switch(
                        checked = task.enabled,
                        onCheckedChange = { onToggleSchedule(task.scheduleId, it) },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Slate950,
                            checkedTrackColor = Emerald400,
                            uncheckedThumbColor = Slate400,
                            uncheckedTrackColor = Slate800
                        )
                    )
                }
            }
        }
    }
}
