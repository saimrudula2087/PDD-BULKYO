package com.example.bulkyo.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import com.example.bulkyo.data.BulkyORules
import com.example.bulkyo.data.SampleData
import com.example.bulkyo.ui.components.BulkyOLogo
import com.example.bulkyo.ui.components.BulkyOSearchBar
import com.example.bulkyo.ui.components.FeaturedCatererCard
import com.example.bulkyo.ui.components.RatingBadge
import com.example.bulkyo.ui.viewmodel.CatererViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomerHomeScreen(
    onCatererClick: (String) -> Unit, 
    onAction: (String) -> Unit,
    viewModel: CatererViewModel = viewModel()
) {
    var searchDoc by remember { mutableStateOf("") }
    var selectedLocation by remember { mutableStateOf(SampleData.indianLocations.first()) }
    var showLocationPicker by remember { mutableStateOf(false) }

    val caterers by viewModel.caterers.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()

    LaunchedEffect(selectedLocation) {
        viewModel.loadCaterers(selectedLocation)
    }

    val filteredCaterers = caterers.filter { 
        searchDoc.isEmpty() || it.businessName.contains(searchDoc, ignoreCase = true)
    }
    
    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .background(MaterialTheme.colorScheme.surface)
                    .shadow(4.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        modifier = Modifier
                            .clickable { showLocationPicker = true }
                            .weight(1f),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        BulkyOLogo(textSize = 20.sp, iconSize = 24.dp)
                        Spacer(modifier = Modifier.width(12.dp))
                        Box(modifier = Modifier.width(1.dp).height(24.dp).background(Color.LightGray))
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.LocationOn, null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(14.dp))
                                Text(" $selectedLocation", style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Bold)
                                Icon(Icons.Default.KeyboardArrowDown, null, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                    Row {
                        IconButton(
                            onClick = { onAction("No new notifications") },
                            modifier = Modifier.size(36.dp).background(Color(0xFFF3F3F3), CircleShape)
                        ) { 
                            Icon(Icons.Default.Notifications, null, modifier = Modifier.size(18.dp)) 
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        IconButton(
                            onClick = { onAction("Profile Settings") },
                            modifier = Modifier.size(36.dp).background(Color(0xFFF3F3F3), CircleShape)
                        ) { 
                            Icon(Icons.Default.Person, null, modifier = Modifier.size(18.dp)) 
                        }
                    }
                }
                BulkyOSearchBar(query = searchDoc, onQueryChange = { searchDoc = it })
            }
        }
    ) { padding ->
        if (showLocationPicker) {
            AlertDialog(
                onDismissRequest = { showLocationPicker = false },
                title = { Text("Select Event Location", fontWeight = FontWeight.Bold) },
                text = {
                    LazyColumn {
                        items(SampleData.indianLocations) { loc ->
                            Text(
                                loc,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        selectedLocation = loc
                                        showLocationPicker = false
                                        onAction("Location updated to $loc")
                                    }
                                    .padding(16.dp),
                                style = MaterialTheme.typography.bodyLarge
                            )
                        }
                    }
                },
                confirmButton = {}
            )
        }

        Box(modifier = Modifier.fillMaxSize().padding(padding)) {
            if (isLoading) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xFFFAFAFA))
                ) {
                    item { PromotionalBanner() }
                    item { RulesBanner() }
                    item {
                        SectionHeader("Grand Events", "Catering for all occasions")
                        LazyRow(
                            contentPadding = PaddingValues(horizontal = 12.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            items(listOf("Wedding", "Birthday", "Function", "Meeting")) { category ->
                                CategoryItem(category, onClick = { onAction("Filtering by $category") })
                            }
                        }
                    }
                    item {
                        SectionHeader("Premium Caterers", "Top rated in $selectedLocation")
                        LazyRow(
                            contentPadding = PaddingValues(horizontal = 12.dp),
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            items(filteredCaterers.take(10)) { caterer ->
                                FeaturedCatererCard(caterer = caterer, onClick = { onCatererClick(caterer.id) })
                            }
                        }
                    }
                    item {
                        SectionHeader("All Specialists", "${filteredCaterers.size} services near you")
                    }
                    items(filteredCaterers.drop(10)) { caterer ->
                        CatererListItem(caterer, onCatererClick)
                    }
                    item { Spacer(modifier = Modifier.height(32.dp)) }
                }
            }
        }
    }
}

@Composable
fun SectionHeader(title: String, subtitle: String) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.ExtraBold)
        Text(subtitle, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
    }
}

@Composable
fun PromotionalBanner() {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
            .height(150.dp),
        shape = RoundedCornerShape(20.dp),
        elevation = CardDefaults.cardElevation(4.dp)
    ) {
        Box {
            AsyncImage(
                model = "https://source.unsplash.com/featured/800x400/?indian,wedding,feast",
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.horizontalGradient(
                            colors = listOf(Color.Black.copy(alpha = 0.7f), Color.Transparent)
                        )
                    )
            )
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .align(Alignment.CenterStart)
            ) {
                Text("GRAND WEDDING\nSPECIAL", color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 22.sp, lineHeight = 26.sp)
                Text("Get 20% Off on Bulk Bookings", color = Color.White.copy(alpha = 0.9f), fontSize = 14.sp)
                Spacer(modifier = Modifier.height(12.dp))
                Surface(
                    color = MaterialTheme.colorScheme.primary,
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("BOOK NOW", modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp), color = Color.White, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
fun RulesBanner() {
    Surface(
        modifier = Modifier
            .padding(horizontal = 16.dp)
            .fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        color = Color(0xFFFFFBEE),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFFE082))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Info, null, tint = Color(0xFFFFA000), modifier = Modifier.size(20.dp))
                Text(" Mandatory Booking Rules", modifier = Modifier.padding(start = 8.dp), fontWeight = FontWeight.Bold, color = Color(0xFF6D4C41))
            }
            Spacer(modifier = Modifier.height(8.dp))
            RuleItem(BulkyORules.getOrderRuleMessage())
            RuleItem(BulkyORules.getCancelRuleMessage())
            RuleItem(BulkyORules.getPaymentRuleMessage())
        }
    }
}

@Composable
fun RuleItem(text: String) {
    Row(modifier = Modifier.padding(vertical = 2.dp), verticalAlignment = Alignment.Top) {
        Text("• ", color = Color(0xFFFFA000), fontWeight = FontWeight.Bold)
        Text(text, style = MaterialTheme.typography.bodySmall, color = Color(0xFF6D4C41))
    }
}

@Composable
fun CategoryItem(name: String, onClick: () -> Unit) {
    Surface(
        modifier = Modifier
            .width(100.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        shadowElevation = 2.dp
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(50.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = when(name) {
                        "Wedding" -> Icons.Default.Favorite
                        "Birthday" -> Icons.Default.Cake
                        "Meeting" -> Icons.Default.Groups
                        else -> Icons.Default.Celebration
                    },
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(24.dp)
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(name, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun CatererListItem(caterer: com.example.bulkyo.data.Caterer, onClick: (String) -> Unit) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .clickable { onClick(caterer.id) },
        shape = RoundedCornerShape(16.dp),
        shadowElevation = 1.dp,
        color = Color.White
    ) {
        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            AsyncImage(
                model = caterer.imageUrl,
                contentDescription = caterer.businessName,
                modifier = Modifier
                    .size(110.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color.LightGray),
                contentScale = ContentScale.Crop
            )
            Column(modifier = Modifier.padding(start = 16.dp).weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(caterer.businessName, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.ExtraBold, modifier = Modifier.weight(1f))
                    RatingBadge(rating = caterer.rating, count = caterer.reviews.size)
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(caterer.location, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                Text("Capacity: ${caterer.minCapacity} - ${caterer.maxCapacity} Pax", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.secondary, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Verified, null, tint = Color(0xFF4CAF50), modifier = Modifier.size(14.dp))
                    Text(" FSSAI Certified", style = MaterialTheme.typography.labelSmall, color = Color(0xFF4CAF50), fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
