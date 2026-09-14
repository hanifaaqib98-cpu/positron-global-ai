package com.example.positron.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.Launch
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.positron.data.CatalogData
import com.example.positron.model.EcosystemEntry
import com.example.positron.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EcosystemSweepView(
    searchQuery: String,
    onSearchQueryChange: (String) -> Unit,
    selectedCategory: String,
    onSelectedCategoryChange: (String) -> Unit,
    selectedCapability: String,
    onSelectedCapabilityChange: (String) -> Unit
) {
    val uriHandler = LocalUriHandler.current

    val categories = remember { listOf("ALL") + CatalogData.getAllCategories() }
    val capabilities = remember { listOf("ALL") + CatalogData.getAllCapabilities() }

    val filteredEntries = remember(searchQuery, selectedCategory, selectedCapability) {
        CatalogData.GLOBAL_2026_CATALOG.filter { entry ->
            val matchesQuery = searchQuery.isBlank() ||
                    entry.name.contains(searchQuery, ignoreCase = true) ||
                    entry.summary.contains(searchQuery, ignoreCase = true) ||
                    entry.capabilities.any { it.contains(searchQuery, ignoreCase = true) }

            val matchesCategory = selectedCategory == "ALL" || entry.category == selectedCategory
            val matchesCapability = selectedCapability == "ALL" || entry.capabilities.contains(selectedCapability)

            matchesQuery && matchesCategory && matchesCapability
        }
    }

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
                        Icon(Icons.Default.Public, contentDescription = null, tint = Sky400, modifier = Modifier.size(24.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "2026 Global AI Ecosystem Sweep",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Slate100
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Curated reference index of 70+ verified autonomous agent frameworks, inter-agent protocols (MCP 2026, A2A 1.0), embodied physical AI, coding agents, and persistent memory platforms.",
                        fontSize = 12.sp,
                        color = Slate300,
                        lineHeight = 16.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    // Search Field
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = onSearchQueryChange,
                        placeholder = { Text("Search 70+ agent frameworks & protocols...", color = Slate400, fontSize = 12.sp) },
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = Slate400, modifier = Modifier.size(18.dp)) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = Slate950,
                            unfocusedContainerColor = Slate950,
                            focusedBorderColor = Sky400,
                            unfocusedBorderColor = Slate700,
                            focusedTextColor = Slate100,
                            unfocusedTextColor = Slate100
                        )
                    )
                }
            }
        }

        // Category Filter Row
        item {
            Column {
                Text("Category Filter:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate400)
                Spacer(modifier = Modifier.height(4.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    items(categories) { cat ->
                        FilterChip(
                            selected = selectedCategory == cat,
                            onClick = { onSelectedCategoryChange(cat) },
                            label = { Text(cat, fontSize = 11.sp) },
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

        // Capability Filter Row
        item {
            Column {
                Text("Capability Filter:", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate400)
                Spacer(modifier = Modifier.height(4.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    items(capabilities) { cap ->
                        FilterChip(
                            selected = selectedCapability == cap,
                            onClick = { onSelectedCapabilityChange(cap) },
                            label = { Text(cap, fontSize = 11.sp) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = Emerald400,
                                selectedLabelColor = Slate950,
                                containerColor = Slate900,
                                labelColor = Slate300
                            )
                        )
                    }
                }
            }
        }

        // Results Summary
        item {
            Text(
                text = "Showing ${filteredEntries.size} of ${CatalogData.GLOBAL_2026_CATALOG.size} Catalog Items",
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = Slate100
            )
        }

        // Entries List
        items(filteredEntries) { entry ->
            EcosystemCard(entry = entry, onOpenUrl = { url ->
                runCatching { uriHandler.openUri(url) }
            })
        }
    }
}

@Composable
private fun EcosystemCard(
    entry: EcosystemEntry,
    onOpenUrl: (String) -> Unit
) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Slate900),
        shape = RoundedCornerShape(10.dp),
        border = BorderStroke(1.dp, Slate800),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = entry.name,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate100
                    )
                    Text(
                        text = entry.category,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Sky400,
                        fontFamily = FontFamily.Monospace
                    )
                }

                if (entry.url != null) {
                    IconButton(
                        onClick = { onOpenUrl(entry.url) },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(Icons.Default.Launch, contentDescription = "Open Website", tint = Sky400, modifier = Modifier.size(16.dp))
                    }
                }
            }

            Spacer(modifier = Modifier.height(6.dp))
            Text(entry.summary, fontSize = 12.sp, color = Slate300, lineHeight = 16.sp)

            Spacer(modifier = Modifier.height(8.dp))

            // Capabilities Badges
            Row(
                horizontalArrangement = Arrangement.spacedBy(4.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                entry.capabilities.take(5).forEach { cap ->
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .background(Slate800)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = cap,
                            fontSize = 9.sp,
                            color = Slate300,
                            fontFamily = FontFamily.Monospace
                        )
                    }
                }
            }
        }
    }
}
