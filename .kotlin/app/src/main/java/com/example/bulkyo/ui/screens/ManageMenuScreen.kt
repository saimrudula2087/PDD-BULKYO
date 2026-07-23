package com.example.bulkyo.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.bulkyo.data.MenuItem
import com.example.bulkyo.ui.viewmodel.ManageMenuViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ManageMenuScreen(
    onBack: () -> Unit,
    viewModel: ManageMenuViewModel = viewModel()
) {
    val menuItems by viewModel.menuItems.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    
    var showAddDialog by remember { mutableStateOf(false) }
    var editingItem by remember { mutableStateOf<MenuItem?>(null) }

    LaunchedEffect(Unit) {
        viewModel.loadMenu("caterer_1") // Demo caterer ID
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Manage Menu (${menuItems.size} items)") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = { showAddDialog = true }) {
                        Icon(Icons.Default.Add, contentDescription = "Add Item")
                    }
                }
            )
        }
    ) { padding ->
        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else {
            LazyColumn(modifier = Modifier.padding(padding)) {
                items(menuItems) { item ->
                    EditableMenuItemRow(
                        item = item,
                        onEdit = { editingItem = item },
                        onDelete = {
                            viewModel.deleteItem("caterer_1", item.id)
                        }
                    )
                    HorizontalDivider(modifier = Modifier.padding(horizontal = 16.dp))
                }
            }
        }

        if (showAddDialog || editingItem != null) {
            EditMenuItemDialog(
                item = editingItem,
                onDismiss = {
                    showAddDialog = false
                    editingItem = null
                },
                onSave = { newItem ->
                    if (editingItem != null) {
                        // update logic in vm
                    } else {
                        viewModel.addItem("caterer_1", newItem)
                    }
                    showAddDialog = false
                    editingItem = null
                }
            )
        }
    }
}

@Composable
fun EditableMenuItemRow(item: MenuItem, onEdit: () -> Unit, onDelete: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(item.name, fontWeight = FontWeight.Bold)
            Text("₹${item.price} • ${item.category}", style = MaterialTheme.typography.bodySmall)
        }
        IconButton(onClick = onEdit) {
            Icon(Icons.Default.Edit, contentDescription = "Edit", tint = MaterialTheme.colorScheme.primary)
        }
        IconButton(onClick = onDelete) {
            Icon(Icons.Default.Delete, contentDescription = "Delete", tint = MaterialTheme.colorScheme.error)
        }
    }
}

@Composable
fun EditMenuItemDialog(item: MenuItem?, onDismiss: () -> Unit, onSave: (MenuItem) -> Unit) {
    var name by remember { mutableStateOf(item?.name ?: "") }
    var price by remember { mutableStateOf(item?.price?.toString() ?: "") }
    var category by remember { mutableStateOf(item?.category ?: "Main Course") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(if (item == null) "Add Food Item" else "Edit Food Item") },
        text = {
            Column {
                TextField(value = name, onValueChange = { name = it }, label = { Text("Name") })
                Spacer(modifier = Modifier.height(8.dp))
                TextField(value = price, onValueChange = { price = it }, label = { Text("Price (₹)") })
                Spacer(modifier = Modifier.height(8.dp))
                TextField(value = category, onValueChange = { category = it }, label = { Text("Category") })
            }
        },
        confirmButton = {
            Button(onClick = {
                onSave(
                    MenuItem(
                        id = item?.id ?: "new_${System.currentTimeMillis()}",
                        name = name,
                        description = item?.description ?: "Freshly prepared Telugu meal.",
                        price = price.toDoubleOrNull() ?: 0.0,
                        category = category,
                        imageUrl = item?.imageUrl
                    )
                )
            }) {
                Text("Save")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}
