package com.example.bulkyo.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.bulkyo.data.SampleData

@Composable
fun OrderHistoryScreen(onReorder: (String) -> Unit) {
    Column(modifier = Modifier.fillMaxSize()) {
        Text("Your Bulk Orders", modifier = Modifier.padding(16.dp), style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        
        LazyColumn {
            items((1..10).toList()) { i ->
                val caterer = SampleData.caterers.random()
                OrderHistoryItem(
                    name = caterer.businessName, 
                    orderId = "BK-ORD-$i", 
                    status = if(i % 2 == 0) "Delivered" else "Upcoming",
                    onReorder = { onReorder("Reordering from ${caterer.businessName}...") }
                )
            }
        }
    }
}

@Composable
fun OrderHistoryItem(name: String, orderId: String, status: String, onReorder: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth().padding(16.dp, 8.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Text(name, fontWeight = FontWeight.Bold)
                Text(status, color = if(status == "Delivered") Color(0xFF4CAF50) else Color(0xFF2196F3), style = MaterialTheme.typography.labelSmall)
            }
            Text(orderId, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            Spacer(modifier = Modifier.height(8.dp))
            HorizontalDivider()
            TextButton(onClick = onReorder, modifier = Modifier.align(androidx.compose.ui.Alignment.End)) {
                Text("REORDER")
            }
        }
    }
}
