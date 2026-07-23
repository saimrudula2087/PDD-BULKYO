package com.example.bulkyo.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.bulkyo.data.EventType
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrderSetupScreen(onConfirm: (LocalDateTime, Int, EventType) -> Unit) {
    var guestCount by remember { mutableStateOf("50") }
    var selectedEvent by remember { mutableStateOf(EventType.BIRTHDAY) }
    
    // In a real app, use a proper date-time picker
    val eventDate = LocalDateTime.now().plusHours(24) 
    val isTimeValid = isOrderTimeValid(eventDate)

    Scaffold(
        topBar = { TopAppBar(title = { Text("Setup Your Event") }) }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).padding(16.dp)) {
            Text("Event Type", style = MaterialTheme.typography.titleMedium)
            EventTypeSelector(selectedEvent) { selectedEvent = it }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            TextField(
                value = guestCount,
                onValueChange = { guestCount = it },
                label = { Text("Number of Guests") },
                modifier = Modifier.fillMaxWidth()
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text("Event Date: ${eventDate.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)}")
            if (!isTimeValid) {
                Text("Error: Orders must be placed 16 hours in advance!", color = MaterialTheme.colorScheme.error)
            }
            
            Spacer(modifier = Modifier.height(32.dp))
            
            Button(
                onClick = { if (isTimeValid) onConfirm(eventDate, guestCount.toInt(), selectedEvent) },
                enabled = isTimeValid,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Continue to Menu Selection")
            }
        }
    }
}

@Composable
fun EventTypeSelector(selected: EventType, onSelected: (EventType) -> Unit) {
    Row {
        EventType.values().forEach { type ->
            FilterChip(
                selected = type == selected,
                onClick = { onSelected(type) },
                label = { Text(type.name) },
                modifier = Modifier.padding(4.dp)
            )
        }
    }
}
