package com.example.bulkyo.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Help
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp

@Composable
fun ProfileScreen(onLogout: () -> Unit, onAction: (String) -> Unit) {
    Column(modifier = Modifier.fillMaxSize()) {
        ProfileHeader()
        Spacer(modifier = Modifier.height(16.dp))
        ProfileOption("My Account", Icons.Default.Person) { onAction("Account details coming soon") }
        ProfileOption("Addresses", Icons.Default.LocationOn) { onAction("Manage addresses coming soon") }
        ProfileOption("Payments", Icons.Default.Payment) { onAction("Payment methods coming soon") }
        ProfileOption("Help & Support", Icons.AutoMirrored.Filled.Help) { onAction("Support center coming soon") }
        ProfileOption("About BulkyO", Icons.Default.Info) { onAction("BulkyO v1.0.0") }
        Spacer(modifier = Modifier.weight(1f))
        TextButton(onClick = onLogout, modifier = Modifier.fillMaxWidth()) {
            Text("Logout", color = MaterialTheme.colorScheme.error)
        }
    }
}

@Composable
fun ProfileHeader() {
    Surface(color = MaterialTheme.colorScheme.primaryContainer) {
        Column(modifier = Modifier.fillMaxWidth().padding(32.dp)) {
            Text("Mrudula", style = MaterialTheme.typography.headlineMedium)
            Text("mrudula@example.com", style = MaterialTheme.typography.bodyMedium)
        }
    }
}

@Composable
fun ProfileOption(title: String, icon: ImageVector, onClick: () -> Unit) {
    ListItem(
        headlineContent = { Text(title) },
        leadingContent = { Icon(icon, null) },
        trailingContent = { Icon(Icons.Default.ChevronRight, null) },
        modifier = Modifier.padding(horizontal = 8.dp).clickable { onClick() }
    )
}
