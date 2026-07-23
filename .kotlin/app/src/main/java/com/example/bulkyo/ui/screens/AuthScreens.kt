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
import com.example.bulkyo.data.BulkyORules
import com.example.bulkyo.data.User
import com.example.bulkyo.data.UserRole
import com.example.bulkyo.ui.components.BulkyOLogo
import com.example.bulkyo.ui.viewmodel.CatererAuthViewModel
import com.example.bulkyo.ui.viewmodel.CatererAuthState

@Composable
fun LoginScreen(onLoginSuccess: (String) -> Unit, onNavigateToSignup: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp)
            .background(Color(0xFFF7F7F7)),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        BulkyOLogo(textSize = 42.sp, iconSize = 80.dp)
        
        Spacer(modifier = Modifier.height(16.dp))
        Text("Login to your account", color = Color.Gray, fontSize = 16.sp)
        
        Spacer(modifier = Modifier.height(48.dp))
        
        OutlinedTextField(
            value = email, 
            onValueChange = { email = it }, 
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )
        
        Spacer(modifier = Modifier.height(12.dp))
        
        OutlinedTextField(
            value = password, 
            onValueChange = { password = it }, 
            label = { Text("Password") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp)
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Button(
            onClick = { onLoginSuccess("CUSTOMER") },
            modifier = Modifier.fillMaxWidth().height(50.dp),
            shape = RoundedCornerShape(25.dp),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
        ) {
            Text("Login as Customer", fontWeight = FontWeight.Bold)
        }
        
        Spacer(modifier = Modifier.height(12.dp))
        
        Button(
            onClick = { onLoginSuccess("CATERER") },
            modifier = Modifier.fillMaxWidth().height(50.dp),
            shape = RoundedCornerShape(25.dp),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
        ) {
            Text("Login as Caterer", fontWeight = FontWeight.Bold)
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        TextButton(onClick = onNavigateToSignup) {
            Text("Don't have an account? Sign up", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun SignupScreen(
    onSignupSuccess: (String) -> Unit, 
    onNavigateToLogin: () -> Unit,
    viewModel: CatererAuthViewModel = viewModel()
) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var fssaiNumber by remember { mutableStateOf("") }
    var selectedRole by remember { mutableStateOf("CUSTOMER") }
    
    val authState by viewModel.authState.collectAsState()

    LaunchedEffect(authState) {
        if (authState is CatererAuthState.SignupSuccess) {
            onSignupSuccess(selectedRole)
            viewModel.resetState()
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
            Text("BulkyO Signup", style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary)
            Spacer(modifier = Modifier.height(32.dp))
            
            OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Full Name") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp))
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(value = email, onValueChange = { email = it }, label = { Text("Email") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp))
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(value = password, onValueChange = { password = it }, label = { Text("Password") }, modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp))
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(verticalAlignment = Alignment.CenterVertically) {
                RadioButton(selected = selectedRole == "CUSTOMER", onClick = { selectedRole = "CUSTOMER" })
                Text("Customer")
                Spacer(modifier = Modifier.width(16.dp))
                RadioButton(selected = selectedRole == "CATERER", onClick = { selectedRole = "CATERER" })
                Text("Caterer")
            }
            
            if (selectedRole == "CATERER") {
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = fssaiNumber, 
                    onValueChange = { fssaiNumber = it }, 
                    label = { Text("FSSAI Certificate Number") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    isError = fssaiNumber.isNotEmpty() && !BulkyORules.isValidFssai(fssaiNumber)
                )
                Text("Must be 14 digits", style = MaterialTheme.typography.bodySmall)
            }

            if (authState is CatererAuthState.Error) {
                Text((authState as CatererAuthState.Error).message, color = MaterialTheme.colorScheme.error)
            }

            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = {
                    if (selectedRole == "CATERER" && !BulkyORules.isValidFssai(fssaiNumber)) {
                        // error handled by UI
                    } else if (name.isBlank() || email.isBlank() || password.isBlank()) {
                        // show error
                    } else {
                        viewModel.signup(
                            User(
                                id = "user_${System.currentTimeMillis()}",
                                name = name,
                                email = email,
                                role = if(selectedRole == "CUSTOMER") UserRole.CUSTOMER else UserRole.CATERER,
                                location = "Default"
                            )
                        )
                    }
                },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = RoundedCornerShape(25.dp)
            ) {
                Text("Register", fontWeight = FontWeight.Bold)
            }
        }
        TextButton(onClick = onNavigateToLogin) {
            Text("Already have an account? Login", color = MaterialTheme.colorScheme.primary)
        }
    }
}
