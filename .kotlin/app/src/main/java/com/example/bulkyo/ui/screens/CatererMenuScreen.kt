package com.example.bulkyo.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.bulkyo.data.SampleData
import com.example.bulkyo.ui.components.MenuItemRow

import kotlinx.coroutines.launch

import androidx.compose.material.icons.filled.Star
import com.example.bulkyo.data.Review

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CatererMenuScreen(catererId: String, onBack: () -> Unit, onCartClick: () -> Unit) {
    val caterer = SampleData.caterers.find { it.id == catererId } ?: return
    val categories = caterer.menu.map { it.category }.distinct()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    
    var selectedTab by remember { mutableStateOf(0) } // 0: Menu, 1: Reviews

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            TopAppBar(
                title = { Text(caterer.businessName) },
                navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, null) } },
                actions = { 
                    IconButton(onClick = { scope.launch { snackbarHostState.showSnackbar("Share feature coming soon") } }) { 
                        Icon(Icons.Default.Share, null) 
                    } 
                }
            )
        },
        bottomBar = {
            if (selectedTab == 0) {
                Surface(shadowElevation = 8.dp) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("2 Items | ₹3500.00", fontWeight = FontWeight.Bold)
                            Text("plus taxes", fontSize = 10.sp, color = Color.Gray)
                        }
                        Button(onClick = onCartClick) {
                            Text("VIEW CART")
                        }
                    }
                }
            }
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding)) {
            SecondaryTabRow(selectedTabIndex = selectedTab) {
                Tab(selected = selectedTab == 0, onClick = { selectedTab = 0 }, text = { Text("Menu") })
                Tab(selected = selectedTab == 1, onClick = { selectedTab = 1 }, text = { Text("Reviews (${caterer.reviews.size})") })
            }

            LazyColumn(modifier = Modifier.fillMaxSize()) {
                if (selectedTab == 0) {
                    item {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("⭐ ${caterer.rating} (500+ ratings)", fontWeight = FontWeight.SemiBold)
                            Text("${caterer.location} • Bulk Catering Specialists")
                            Text("FSSAI ID: ${caterer.fssaiNumber}", color = Color(0xFF4CAF50), fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("Capacity: ${caterer.minCapacity} to ${caterer.maxCapacity} people", color = MaterialTheme.colorScheme.secondary)
                        }
                        HorizontalDivider(thickness = 8.dp, color = Color(0xFFF3F3F3))
                    }

                    categories.forEach { category ->
                        item {
                            Text(
                                text = category,
                                modifier = Modifier.padding(16.dp),
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        items(caterer.menu.filter { it.category == category }) { item ->
                            MenuItemRow(item = item, onAdd = { msg ->
                                scope.launch { snackbarHostState.showSnackbar(msg) }
                            })
                            HorizontalDivider(modifier = Modifier.padding(horizontal = 16.dp), thickness = 0.5.dp)
                        }
                    }
                } else {
                    item {
                        RatingOverview(caterer.rating, caterer.reviews.size)
                    }
                    items(caterer.reviews) { review ->
                        ReviewItem(review)
                        HorizontalDivider(modifier = Modifier.padding(horizontal = 16.dp), thickness = 0.5.dp)
                    }
                }
            }
        }
    }
}

@Composable
fun RatingOverview(rating: Float, count: Int) {
    Column(modifier = Modifier.padding(16.dp).fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = rating.toString(), style = MaterialTheme.typography.displayLarge, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary)
        Row {
            repeat(5) { i ->
                Icon(
                    Icons.Default.Star,
                    null,
                    tint = if (i < rating.toInt()) Color(0xFFFFB800) else Color.LightGray,
                    modifier = Modifier.size(24.dp)
                )
            }
        }
        Text(text = "Based on $count reviews", style = MaterialTheme.typography.bodyMedium, color = Color.Gray)
    }
    HorizontalDivider(thickness = 8.dp, color = Color(0xFFF3F3F3))
}

@Composable
fun ReviewItem(review: Review) {
    Column(modifier = Modifier.padding(16.dp)) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(text = review.userName, fontWeight = FontWeight.Bold)
            Text(text = review.date, style = MaterialTheme.typography.labelSmall, color = Color.Gray)
        }
        Row(modifier = Modifier.padding(vertical = 4.dp)) {
            repeat(5) { i ->
                Icon(
                    Icons.Default.Star,
                    null,
                    tint = if (i < review.rating) Color(0xFFFFB800) else Color.LightGray,
                    modifier = Modifier.size(14.dp)
                )
            }
        }
        Text(text = review.comment, style = MaterialTheme.typography.bodyMedium)
    }
}
