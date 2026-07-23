package com.example.bulkyo.ui

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.bulkyo.ui.screens.*

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Signup : Screen("signup")
    object CatererSetup : Screen("caterer_setup")
    object Main : Screen("main")
    object CatererHome : Screen("caterer_home")
    object ManageMenu : Screen("manage_menu")
    object BusinessInfo : Screen("business_info")
    object Cart : Screen("cart")
    object PaymentSuccess : Screen("payment_success")
    object CatererDetail : Screen("caterer_detail/{catererId}") {
        fun createRoute(catererId: String) = "caterer_detail/$catererId"
    }
}

@Composable
fun BulkyONavHost(navController: NavHostController) {
    NavHost(navController = navController, startDestination = Screen.Login.route) {
        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = { role ->
                    if (role == "CUSTOMER") {
                        navController.navigate(Screen.Main.route) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                        }
                    } else if (role == "CATERER") {
                        navController.navigate(Screen.CatererHome.route) {
                            popUpTo(Screen.Login.route) { inclusive = true }
                        }
                    }
                },
                onNavigateToSignup = { navController.navigate(Screen.Signup.route) }
            )
        }
        
        composable(Screen.Signup.route) {
            SignupScreen(
                onSignupSuccess = { role ->
                    if (role == "CATERER") {
                        navController.navigate(Screen.CatererSetup.route)
                    } else {
                        navController.navigate(Screen.Login.route)
                    }
                },
                onNavigateToLogin = { navController.popBackStack() }
            )
        }
        
        composable(Screen.CatererSetup.route) {
            CatererSetupScreen(
                onSetupComplete = {
                    navController.navigate(Screen.CatererHome.route) {
                        popUpTo(Screen.Signup.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Main.route) {
            MainScreen(
                onCatererClick = { catererId ->
                    navController.navigate(Screen.CatererDetail.createRoute(catererId))
                },
                onLogout = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                },
                onCartClick = {
                    navController.navigate(Screen.Cart.route)
                }
            )
        }

        composable(Screen.CatererHome.route) {
            CatererHomeScreen(
                onManageMenu = { navController.navigate(Screen.ManageMenu.route) },
                onBusinessInfo = { navController.navigate(Screen.BusinessInfo.route) },
                onLogout = {
                    navController.navigate(Screen.Login.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.CatererDetail.route) { backStackEntry ->
            val catererId = backStackEntry.arguments?.getString("catererId") ?: ""
            CatererMenuScreen(
                catererId = catererId,
                onBack = { navController.popBackStack() },
                onCartClick = { navController.navigate(Screen.Cart.route) }
            )
        }

        composable(Screen.ManageMenu.route) {
            ManageMenuScreen(onBack = { navController.popBackStack() })
        }

        composable(Screen.BusinessInfo.route) {
            BusinessInfoScreen(onBack = { navController.popBackStack() })
        }

        composable(Screen.Cart.route) {
            CartScreen(
                onBack = { navController.popBackStack() },
                onCheckout = {
                    navController.navigate(Screen.PaymentSuccess.route)
                }
            )
        }

        composable(Screen.PaymentSuccess.route) {
            PaymentSuccessScreen(
                onGoHome = {
                    navController.navigate(Screen.Main.route) {
                        popUpTo(Screen.Main.route) { inclusive = true }
                    }
                }
            )
        }
    }
}
