package com.example.bulkyo.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.bulkyo.data.SampleData

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BusinessInfoScreen(onBack: () -> Unit) {
    val caterer = SampleData.caterers.first()
    var businessName by remember { mutableStateOf(caterer.businessName) }
    var location by remember { mutableStateOf(caterer.location) }
    var fssaiNumber by remember { mutableStateOf(caterer.fssaiNumber) }
    var minCapacity by remember { mutableStateOf(caterer.minCapacity.toString()) }
    var maxCapacity by remember { mutableStateOf(caterer.maxCapacity.toString()) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Edit Business Info") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding).padding(16.dp)) {
            OutlinedTextField(
                value = businessName,
                onValueChange = { businessName = it },
                label = { Text("Business Name") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = location,
                onValueChange = { location = it },
                label = { Text("Base Location") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = fssaiNumber,
                onValueChange = { fssaiNumber = it },
                label = { Text("FSSAI ID") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(16.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                OutlinedTextField(
                    value = minCapacity,
                    onValueChange = { minCapacity = it },
                    label = { Text("Min Capacity") },
                    modifier = Modifier.weight(1f)
                )
                OutlinedTextField(
                    value = maxCapacity,
                    onValueChange = { maxCapacity = it },
                    label = { Text("Max Capacity") },
                    modifier = Modifier.weight(1f)
                )
            }
            Spacer(modifier = Modifier.weight(1f))
            Button(
                onClick = { 
                    // In a real app, we would update the backend here
                    onBack() 
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Update Profile")
            }
        }
    }
}
