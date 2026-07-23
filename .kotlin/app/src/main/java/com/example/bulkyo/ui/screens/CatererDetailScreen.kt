package com.example.bulkyo.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.bulkyo.data.SampleData
import java.time.LocalDateTime
import java.time.Duration

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CatererDetailScreen(catererId: String, onOrderClick: () -> Unit) {
    val caterer = SampleData.caterers.find { it.id == catererId } ?: return

    Scaffold(
        topBar = { TopAppBar(title = { Text(caterer.businessName) }) }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).padding(16.dp)) {
            Text("Menu (${caterer.menu.size} items)", style = MaterialTheme.typography.titleLarge)
            Text("Capacity: ${caterer.minCapacity} to ${caterer.maxCapacity} people")
            
            Spacer(modifier = Modifier.height(16.dp))
            
            LazyColumn(modifier = Modifier.weight(1f)) {
                items(caterer.menu) { item ->
                    ListItem(
                        headlineContent = { Text(item.name) },
                        supportingContent = { Text(item.description) },
                        trailingContent = { Text("$\${item.price}") }
                    )
                    HorizontalDivider()
                }
            }
            
            Button(
                onClick = onOrderClick,
                modifier = Modifier.fillMaxWidth().padding(top = 16.dp)
            ) {
                Text("Place Bulk Order")
            }
        }
    }
}

fun isOrderTimeValid(eventTime: LocalDateTime): Boolean {
    val now = LocalDateTime.now()
    val hoursUntilEvent = Duration.between(now, eventTime).toHours()
    return hoursUntilEvent >= 16
}

fun canCancelOrder(eventTime: LocalDateTime): Boolean {
    val now = LocalDateTime.now()
    val hoursUntilEvent = Duration.between(now, eventTime).toHours()
    return hoursUntilEvent >= 14
}

fun mustPayBy(eventTime: LocalDateTime): LocalDateTime {
    return eventTime.minusHours(12)
}
