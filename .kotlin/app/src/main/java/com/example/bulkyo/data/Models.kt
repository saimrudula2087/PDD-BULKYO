package com.example.bulkyo.data

import java.time.LocalDateTime

enum class UserRole { CUSTOMER, CATERER }

enum class EventType { MARRIAGE, FUNCTION, MEETING, BIRTHDAY }

data class User(
    val id: String,
    val name: String,
    val email: String,
    val role: UserRole,
    val location: String
)

data class MenuItem(
    val id: String,
    val name: String,
    val description: String,
    val price: Double, // Cost in Rupees
    val category: String, // e.g., Breakfast, Lunch, Dinner, Snack
    val imageUrl: String? = null
)

data class Review(
    val id: String,
    val userName: String,
    val rating: Int,
    val comment: String,
    val date: String
)

data class Caterer(
    val id: String,
    val userId: String,
    val businessName: String,
    val menu: List<MenuItem>,
    val minCapacity: Int = 10,
    val maxCapacity: Int = 2000,
    val location: String,
    val rating: Float,
    val fssaiNumber: String, // Required for registration
    val imageUrl: String? = null,
    val reviews: List<Review> = emptyList()
)

data class Order(
    val id: String,
    val customerId: String,
    val catererId: String,
    val items: List<OrderItem>,
    val eventType: EventType,
    val eventDate: LocalDateTime,
    val orderDate: LocalDateTime,
    val status: OrderStatus,
    val totalAmount: Double,
    val isPaid: Boolean = false
)

data class OrderItem(
    val menuItemId: String,
    val quantity: Int
)

enum class OrderStatus {
    PENDING, CONFIRMED, CANCELLED, COMPLETED
}
