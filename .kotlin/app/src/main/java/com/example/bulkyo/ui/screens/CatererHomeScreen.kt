package com.example.bulkyo.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.bulkyo.data.SampleData
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CatererHomeScreen(
    onManageMenu: () -> Unit,
    onBusinessInfo: () -> Unit,
    onLogout: () -> Unit
) {
    var isAcceptingOrders by remember { mutableStateOf(true) }
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            TopAppBar(
                title = { 
                    Column {
                        Text("Godavari Ruchulu", style = MaterialTheme.typography.titleMedium)
                        Text("FSSAI ID: 12345678901234", style = MaterialTheme.typography.labelSmall, color = Color(0xFF4CAF50))
                    }
                },
                actions = {
                    IconButton(onClick = onLogout) {
                        Icon(Icons.Default.Logout, contentDescription = "Logout")
                    }
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(end = 12.dp)) {
                        Text(if(isAcceptingOrders) "Open" else "Closed", style = MaterialTheme.typography.labelMedium)
                        Switch(checked = isAcceptingOrders, onCheckedChange = { 
                            isAcceptingOrders = it 
                            scope.launch { snackbarHostState.showSnackbar(if(it) "Business is now Open" else "Business is now Closed") }
                        })
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .background(Color(0xFFF7F7F7))
        ) {
            item {
                BusinessStatsSection()
            }

            item {
                Text(
                    "Quick Actions",
                    modifier = Modifier.padding(16.dp),
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
            }

            item {
                QuickActionsGrid(
                    onManageMenu = onManageMenu,
                    onBusinessInfo = onBusinessInfo,
                    onAction = { msg ->
                        scope.launch { snackbarHostState.showSnackbar(msg) }
                    }
                )
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Live Orders", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    TextButton(onClick = { scope.launch { snackbarHostState.showSnackbar("Opening detailed order history...") } }) { Text("View All") }
                }
            }

            items(3) { i ->
                LiveOrderCard(
                    orderId = "BK-$i", 
                    customer = SampleData.customers[i].name,
                    amount = "₹${(15000..55000).random()}",
                    onClick = { scope.launch { snackbarHostState.showSnackbar("Opening Order BK-$i details...") } }
                )
            }
        }
    }
}

@Composable
fun BusinessStatsSection() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        StatCard("Today's Rev", "₹45,200", Modifier.weight(1f), Color(0xFFE3F2FD))
        StatCard("New Orders", "12", Modifier.weight(1f), Color(0xFFF1F8E9))
        StatCard("Avg Rating", "4.8 ⭐", Modifier.weight(1f), Color(0xFFFFF3E0))
    }
}

@Composable
fun StatCard(label: String, value: String, modifier: Modifier, bgColor: Color) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = bgColor)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(label, style = MaterialTheme.typography.labelSmall, color = Color.Gray)
            Text(value, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun QuickActionsGrid(
    onManageMenu: () -> Unit,
    onBusinessInfo: () -> Unit,
    onAction: (String) -> Unit
) {
    val actions = listOf(
        QuickActionItem("Manage Menu", Icons.Default.RestaurantMenu, Color(0xFFBBDEFB), onManageMenu),
        QuickActionItem("Earnings", Icons.Default.AccountBalanceWallet, Color(0xFFC8E6C9), { onAction("Opening Earnings...") }),
        QuickActionItem("Customer Reviews", Icons.Default.RateReview, Color(0xFFFFF176), { onAction("Opening Reviews...") }),
        QuickActionItem("Business Info", Icons.Default.Business, Color(0xFFFFE0B2), onBusinessInfo),
        QuickActionItem("Analytics", Icons.Default.BarChart, Color(0xFFD1C4E9), { onAction("Opening Analytics...") }),
        QuickActionItem("Promotions", Icons.Default.Campaign, Color(0xFFF8BBD0), { onAction("Opening Promotions...") }),
        QuickActionItem("Help Center", Icons.Default.HelpCenter, Color(0xFFCFD8DC), { onAction("Opening Help Center...") })
    )

    Column(modifier = Modifier.padding(horizontal = 8.dp)) {
        for (i in actions.indices step 2) {
            Row(modifier = Modifier.fillMaxWidth()) {
                ActionCard(actions[i], Modifier.weight(1f))
                ActionCard(actions[i+1], Modifier.weight(1f))
            }
        }
    }
}

data class QuickActionItem(val label: String, val icon: ImageVector, val color: Color, val onClick: () -> Unit)

@Composable
fun ActionCard(action: QuickActionItem, modifier: Modifier) {
    Card(
        modifier = modifier
            .padding(8.dp)
            .height(100.dp)
            .clickable { action.onClick() },
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(action.icon, contentDescription = null, tint = action.color.copy(alpha = 0.8f), modifier = Modifier.size(32.dp))
            Spacer(modifier = Modifier.height(8.dp))
            Text(action.label, style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
fun LiveOrderCard(orderId: String, customer: String, amount: String, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp, 8.dp)
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(1.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier.size(48.dp).clip(RoundedCornerShape(8.dp)).background(Color(0xFFFFF9C4)),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.AccessTime, contentDescription = null, tint = Color(0xFFFBC02D))
            }
            Column(modifier = Modifier.padding(start = 12.dp).weight(1f)) {
                Text(customer, fontWeight = FontWeight.Bold)
                Text(orderId, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            }
            Column(horizontalAlignment = Alignment.End) {
                Text(amount, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Text("Preparing", style = MaterialTheme.typography.labelSmall, color = Color(0xFFFB8C00))
            }
        }
    }
}
