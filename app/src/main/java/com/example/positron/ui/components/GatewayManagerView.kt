package com.example.positron.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CellTower
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.positron.model.ChannelSpec
import com.example.positron.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GatewayManagerView(
    channels: List<ChannelSpec>,
    outbox: List<Map<String, String>>,
    onToggleChannel: (channelId: String, enabled: Boolean) -> Unit,
    onTestEnvelope: (channel: String, sender: String, content: String, auth: Boolean) -> String
) {
    var selectedTestChannel by remember { mutableStateOf("web") }
    var senderRef by remember { mutableStateOf("user_1024") }
    var messageContent by remember { mutableStateOf("Hello Positron Agent Daemon") }
    var isAuthenticated by remember { mutableStateOf(true) }
    var testResult by remember { mutableStateOf<String?>(null) }

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
                        Icon(Icons.Default.CellTower, contentDescription = null, tint = Sky400, modifier = Modifier.size(24.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Agent Gateway & Multi-Channel Transport",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate100
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Unified inbound/outbound channel adapters. Enforces ingress authentication boundaries and egress human approval requirements per channel.",
                        fontSize = 12.sp,
                        color = Slate300
                    )
                }
            }
        }

        // Active Channels List Section
        item {
            Text(
                text = "Registered Communication Channels (${channels.size})",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Slate100
            )
        }

        items(channels) { channel ->
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(10.dp),
                border = BorderStroke(1.dp, if (channel.enabled) Sky400.copy(alpha = 0.4f) else Slate800),
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
                                text = channel.channelId.uppercase(),
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (channel.enabled) Sky400 else Slate400,
                                fontFamily = FontFamily.Monospace
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = if (channel.enabled) "ACTIVE" else "DISABLED",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (channel.enabled) Emerald400 else Slate400,
                                fontFamily = FontFamily.Monospace
                            )
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Inbound Auth: ${if (channel.inboundAuthRequired) "REQUIRED" else "NONE"} | Outbound Approval: ${if (channel.outboundRequiresApproval) "REQUIRED" else "NONE"}",
                            fontSize = 10.sp,
                            color = Slate400,
                            fontFamily = FontFamily.Monospace
                        )
                    }

                    Switch(
                        checked = channel.enabled,
                        onCheckedChange = { onToggleChannel(channel.channelId, it) },
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

        // Test Inbound Envelope Simulator Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(12.dp),
                border = BorderStroke(1.dp, Slate800),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Inbound Gateway Envelope Simulator",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate100
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedTextField(
                            value = selectedTestChannel,
                            onValueChange = { selectedTestChannel = it },
                            label = { Text("Channel", fontSize = 11.sp, color = Slate400) },
                            singleLine = true,
                            modifier = Modifier.weight(1f),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Sky400,
                                unfocusedBorderColor = Slate700,
                                focusedTextColor = Slate100,
                                unfocusedTextColor = Slate100
                            )
                        )

                        OutlinedTextField(
                            value = senderRef,
                            onValueChange = { senderRef = it },
                            label = { Text("Sender Ref", fontSize = 11.sp, color = Slate400) },
                            singleLine = true,
                            modifier = Modifier.weight(1f),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Sky400,
                                unfocusedBorderColor = Slate700,
                                focusedTextColor = Slate100,
                                unfocusedTextColor = Slate100
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = messageContent,
                        onValueChange = { messageContent = it },
                        label = { Text("Envelope Message Content", fontSize = 11.sp, color = Slate400) },
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
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Checkbox(
                                checked = isAuthenticated,
                                onCheckedChange = { isAuthenticated = it },
                                colors = CheckboxDefaults.colors(checkedColor = Sky400, checkmarkColor = Slate950)
                            )
                            Text("Sender Authenticated", fontSize = 12.sp, color = Slate300)
                        }

                        Button(
                            onClick = {
                                testResult = onTestEnvelope(selectedTestChannel, senderRef, messageContent, isAuthenticated)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Sky400, contentColor = Slate950),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Inject Envelope", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    if (testResult != null) {
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = "Result: ${testResult!!}",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (testResult!!.contains("accepted")) Emerald400 else Red400,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }

        // Outbound Message Queue Title & List
        item {
            Text(
                text = "Outbound Message Queue (${outbox.size})",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Slate100
            )
        }

        if (outbox.isEmpty()) {
            item {
                Text("No queued outbound messages.", fontSize = 12.sp, color = Slate400)
            }
        } else {
            items(outbox) { msg ->
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
                            Text(msg["channel"]?.uppercase() ?: "", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Sky400, fontFamily = FontFamily.Monospace)
                            Text(msg["timestamp"]?.takeLast(12)?.dropLast(1) ?: "", fontSize = 10.sp, color = Slate400, fontFamily = FontFamily.Monospace)
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(msg["content"] ?: "", fontSize = 12.sp, color = Slate100)
                    }
                }
            }
        }
    }
}
