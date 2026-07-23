package com.example.bulkyo.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

import androidx.compose.material.icons.automirrored.filled.ArrowBack

import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch

import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.runtime.*
import com.example.bulkyo.data.SampleData

import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.bulkyo.ui.viewmodel.OrderViewModel
import com.example.bulkyo.ui.viewmodel.OrderStatus
import com.example.bulkyo.data.Order
import com.example.bulkyo.data.OrderItem
import com.example.bulkyo.data.EventType
import java.time.LocalDateTime

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CartScreen(
    onBack: () -> Unit, 
    onCheckout: () -> Unit,
    orderViewModel: OrderViewModel = viewModel()
) {
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    var selectedLocation by remember { mutableStateOf<String?>(null) }
    var showLocationPicker by remember { mutableStateOf(false) }
    
    val orderStatus by orderViewModel.orderStatus.collectAsState()

    LaunchedEffect(orderStatus) {
        if (orderStatus is OrderStatus.Success) {
            onCheckout()
            orderViewModel.resetStatus()
        } else if (orderStatus is OrderStatus.Error) {
            snackbarHostState.showSnackbar((orderStatus as OrderStatus.Error).message)
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = { 
            // ... (TopAppBar code)
            TopAppBar(
                title = { Text("Review Order") },
                navigationIcon = {
                    IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, null) }
                }
            ) 
        },
        bottomBar = {
            Button(
                onClick = {
                    if (selectedLocation == null) {
                        scope.launch { snackbarHostState.showSnackbar("Please select a delivery location!") }
                    } else {
                        // Simulate creating an order object
                        val dummyOrder = Order(
                            id = "order_${System.currentTimeMillis()}",
                            customerId = "customer_1",
                            catererId = "caterer_1",
                            items = listOf(OrderItem("item_1", 500)),
                            eventType = EventType.MARRIAGE,
                            eventDate = LocalDateTime.now().plusDays(2),
                            orderDate = LocalDateTime.now(),
                            status = com.example.bulkyo.data.OrderStatus.PENDING,
                            totalAmount = 125000.0
                        )
                        orderViewModel.placeOrder(dummyOrder)
                    }
                },
                enabled = orderStatus !is OrderStatus.Loading,
                modifier = Modifier.fillMaxWidth().padding(16.dp).height(56.dp)
            ) {
                if (orderStatus is OrderStatus.Loading) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                } else {
                    Text("PROCEED TO PAY ₹1,25,000.00")
                }
            }
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).padding(16.dp)) {
            Text("Bulk Order Summary", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))
            
            CartItem(
                name = "Wedding Feast - Premium", 
                qty = 500, 
                price = 250.0, 
                onDelete = { scope.launch { snackbarHostState.showSnackbar("Item removed from cart") } }
            )
            CartItem(
                name = "Dessert - Pootharekulu", 
                qty = 500, 
                price = 30.0,
                onDelete = { scope.launch { snackbarHostState.showSnackbar("Item removed from cart") } }
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            HorizontalDivider()
            Spacer(modifier = Modifier.height(16.dp))

            // Location Selection Section
            Card(
                modifier = Modifier.fillMaxWidth().clickable { showLocationPicker = true },
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.LocationOn, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                    Column(modifier = Modifier.padding(start = 12.dp)) {
                        Text("Delivery Location", style = MaterialTheme.typography.labelSmall)
                        Text(
                            text = selectedLocation ?: "Select Address for Event",
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Spacer(modifier = Modifier.weight(1f))
                    Text("CHANGE", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.primary)
                }
            }

            if (showLocationPicker) {
                AlertDialog(
                    onDismissRequest = { showLocationPicker = false },
                    title = { Text("Select Event Location") },
                    text = {
                        LazyColumn {
                            items(SampleData.indianLocations) { loc ->
                                Text(
                                    text = loc,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable {
                                            selectedLocation = loc
                                            showLocationPicker = false
                                        }
                                        .padding(16.dp)
                                )
                            }
                        }
                    },
                    confirmButton = {}
                )
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            HorizontalDivider()
            Spacer(modifier = Modifier.height(16.dp))
            
            BillDetail("Item Total", "₹1,40,000.00")
            BillDetail("Bulk Discount (10%)", "-₹14,000.00")
            BillDetail("GST & Taxes", "₹1,000.00")
            BillDetail("Grand Total", "₹1,25,000.00", isTotal = true)
        }
    }
}

@Composable
fun CartItem(name: String, qty: Int, price: Double, onDelete: () -> Unit) {
    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp), horizontalArrangement = Arrangement.SpaceBetween) {
        Column {
            Text(name, fontWeight = FontWeight.Medium)
            Text("$qty Plates x ₹${price}", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
        }
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("₹${qty * price}", fontWeight = FontWeight.SemiBold)
            IconButton(onClick = onDelete) { Icon(Icons.Default.Delete, null, tint = Color.Gray) }
        }
    }
}

@Composable
fun BillDetail(label: String, value: String, isTotal: Boolean = false) {
    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, fontWeight = if(isTotal) FontWeight.Bold else FontWeight.Normal)
        Text(value, fontWeight = if(isTotal) FontWeight.Bold else FontWeight.Normal)
    }
}
