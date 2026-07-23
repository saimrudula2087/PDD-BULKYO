package com.example.bulkyo.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@Composable
fun TrackOrderScreen() {
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Order #99238", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        Text("Catering Express - Downtown", color = Color.Gray)
        
        Spacer(modifier = Modifier.height(32.dp))
        
        TrackingStep("Order Confirmed", "Confirmed at 10:30 AM", isCompleted = true)
        TrackingStep("Ingredients Sourced", "Sourcing from organic farms", isCompleted = true)
        TrackingStep("Preparation Started", "Started at 02:00 PM", isCompleted = true, isActive = true)
        TrackingStep("Quality Check", "Pending", isCompleted = false)
        TrackingStep("Ready for Delivery", "Expected by 06:00 PM", isCompleted = false)
        
        Spacer(modifier = Modifier.weight(1f))
        
        Card(modifier = Modifier.fillMaxWidth()) {
            Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(modifier = Modifier.size(50.dp).clip(CircleShape).background(Color.LightGray))
                Column(modifier = Modifier.padding(start = 12.dp).weight(1f)) {
                    Text("Mike (Catering Manager)", fontWeight = FontWeight.Bold)
                    Text("Arriving in 45 mins", style = MaterialTheme.typography.bodySmall)
                }
                IconButton(onClick = {}) {
                    Icon(Icons.Default.Call, null, tint = MaterialTheme.colorScheme.primary)
                }
            }
        }
    }
}

@Composable
fun TrackingStep(title: String, subtitle: String, isCompleted: Boolean, isActive: Boolean = false) {
    Row(modifier = Modifier.fillMaxWidth().height(80.dp)) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                if(isCompleted) Icons.Default.CheckCircle else Icons.Default.CheckCircle, // Placeholder
                null,
                tint = if(isCompleted) Color.Green else Color.LightGray,
                modifier = Modifier.size(24.dp)
            )
            Box(modifier = Modifier.width(2.dp).fillMaxHeight().background(if(isCompleted) Color.Green else Color.LightGray))
        }
        Column(modifier = Modifier.padding(start = 16.dp)) {
            Text(title, fontWeight = if(isActive) FontWeight.Bold else FontWeight.Normal)
            Text(subtitle, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
        }
    }
}
