package com.example.bulkyo.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.bulkyo.data.SampleData
import com.example.bulkyo.ui.components.BulkyOSearchBar

@Composable
fun SearchScreen(onCatererClick: (String) -> Unit) {
    var query by remember { mutableStateOf("") }
    val filteredCaterers = SampleData.caterers.filter {
        it.businessName.contains(query, ignoreCase = true) || it.location.contains(query, ignoreCase = true)
    }

    Column(modifier = Modifier.fillMaxSize()) {
        BulkyOSearchBar(query = query, onQueryChange = { query = it }, placeholder = "Search for 'Biryani' or 'Downtown'...")
        
        if (query.isEmpty()) {
            RecentSearches()
        } else {
            LazyColumn {
                items(filteredCaterers) { caterer ->
                    CatererListItem(caterer = caterer, onClick = onCatererClick)
                }
            }
        }
    }
}

@Composable
fun RecentSearches() {
    Column(modifier = Modifier.padding(16.dp)) {
        Text("Recent Searches", style = MaterialTheme.typography.titleMedium)
        Spacer(modifier = Modifier.height(8.dp))
        listOf("North Indian", "Marriage Buffet", "West Side Caterers").forEach { search ->
            Row(modifier = Modifier.padding(vertical = 8.dp)) {
                Icon(Icons.Default.Search, null, modifier = Modifier.size(18.dp))
                Text(search, modifier = Modifier.padding(start = 8.dp))
            }
        }
    }
}
