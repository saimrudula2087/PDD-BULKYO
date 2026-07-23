package com.example.bulkyo.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.bulkyo.data.Caterer
import com.example.bulkyo.ui.viewmodel.CatererAuthViewModel
import com.example.bulkyo.ui.viewmodel.CatererAuthState

@Composable
fun CatererSetupScreen(
    onSetupComplete: () -> Unit,
    viewModel: CatererAuthViewModel = viewModel()
) {
    var businessName by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var minCapacity by remember { mutableStateOf("10") }
    var maxCapacity by remember { mutableStateOf("2000") }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    
    val authState by viewModel.authState.collectAsState()

    LaunchedEffect(authState) {
        if (authState is CatererAuthState.SetupSuccess) {
            onSetupComplete()
            viewModel.resetState()
        } else if (authState is CatererAuthState.Error) {
            errorMessage = (authState as CatererAuthState.Error).message
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
            .background(Color(0xFFF7F7F7)),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        if (authState is CatererAuthState.Loading) {
            CircularProgressIndicator()
        } else {
            Text(
                "Complete Your Business Profile",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.ExtraBold,
                color = MaterialTheme.colorScheme.primary
            )
            Text("Tell us about your catering service", color = Color.Gray, fontSize = 14.sp)
            
            Spacer(modifier = Modifier.height(32.dp))
            
            OutlinedTextField(
                value = businessName,
                onValueChange = { businessName = it },
                label = { Text("Business Name") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            OutlinedTextField(
                value = location,
                onValueChange = { location = it },
                label = { Text("Base City (e.g., Hyderabad)") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text("Catering Capacity (Number of People)", style = MaterialTheme.typography.labelMedium, color = Color.Gray)
            
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                OutlinedTextField(
                    value = minCapacity,
                    onValueChange = { minCapacity = it },
                    label = { Text("Minimum") },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )
                OutlinedTextField(
                    value = maxCapacity,
                    onValueChange = { maxCapacity = it },
                    label = { Text("Maximum") },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )
            }
            
            errorMessage?.let {
                Text(it, color = MaterialTheme.colorScheme.error, modifier = Modifier.padding(top = 8.dp))
            }

            Spacer(modifier = Modifier.height(48.dp))
            
            Button(
                onClick = {
                    if (businessName.isBlank() || location.isBlank()) {
                        errorMessage = "Please fill all fields"
                    } else {
                        viewModel.completeSetup(
                            Caterer(
                                id = "cat_${System.currentTimeMillis()}",
                                userId = "user_123", // in real app get from auth
                                businessName = businessName,
                                menu = emptyList(),
                                minCapacity = minCapacity.toIntOrNull() ?: 10,
                                maxCapacity = maxCapacity.toIntOrNull() ?: 2000,
                                location = location,
                                rating = 5.0f,
                                fssaiNumber = "TEMP-FSSAI"
                            )
                        )
                    }
                },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = RoundedCornerShape(25.dp)
            ) {
                Text("Create Account", fontWeight = FontWeight.Bold)
            }
        }
    }
}
