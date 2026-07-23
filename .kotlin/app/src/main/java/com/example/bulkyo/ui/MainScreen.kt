package com.example.bulkyo.ui

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import kotlinx.coroutines.launch
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.bulkyo.ui.screens.CustomerHomeScreen
import com.example.bulkyo.ui.screens.OrderHistoryScreen
import com.example.bulkyo.ui.screens.ProfileScreen
import com.example.bulkyo.ui.screens.SearchScreen

sealed class BottomNavScreen(val route: String, val label: String, val icon: ImageVector) {
    object Home : BottomNavScreen("home_tab", "Home", Icons.Default.Home)
    object Search : BottomNavScreen("search_tab", "Search", Icons.Default.Search)
    object Orders : BottomNavScreen("orders_tab", "Orders", Icons.Default.History)
    object Profile : BottomNavScreen("profile_tab", "Profile", Icons.Default.Person)
}

@Composable
fun MainScreen(onCatererClick: (String) -> Unit, onLogout: () -> Unit, onCartClick: () -> Unit) {
    val navController = rememberNavController()
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()
    
    val items = listOf(
        BottomNavScreen.Home,
        BottomNavScreen.Search,
        BottomNavScreen.Orders,
        BottomNavScreen.Profile
    )

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentDestination = navBackStackEntry?.destination
                items.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = null) },
                        label = { Text(screen.label) },
                        selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = BottomNavScreen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(BottomNavScreen.Home.route) { 
                CustomerHomeScreen(
                    onCatererClick = onCatererClick,
                    onAction = { msg ->
                        scope.launch { snackbarHostState.showSnackbar(msg) }
                    }
                ) 
            }
            composable(BottomNavScreen.Search.route) { SearchScreen(onCatererClick) }
            composable(BottomNavScreen.Orders.route) { 
                OrderHistoryScreen(
                    onReorder = { msg ->
                        scope.launch { snackbarHostState.showSnackbar(msg) }
                    }
                ) 
            }
            composable(BottomNavScreen.Profile.route) { 
                ProfileScreen(
                    onLogout = onLogout,
                    onAction = { msg ->
                        scope.launch { snackbarHostState.showSnackbar(msg) }
                    }
                ) 
            }
        }
    }
}
