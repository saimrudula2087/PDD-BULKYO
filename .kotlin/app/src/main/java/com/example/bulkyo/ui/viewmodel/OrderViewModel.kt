package com.example.bulkyo.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.bulkyo.data.Order
import com.example.bulkyo.data.repository.BulkyORepository
import com.example.bulkyo.data.repository.FakeBulkyORepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class OrderViewModel(
    private val repository: BulkyORepository = FakeBulkyORepository()
) : ViewModel() {

    private val _orderStatus = MutableStateFlow<OrderStatus>(OrderStatus.Idle)
    val orderStatus: StateFlow<OrderStatus> = _orderStatus.asStateFlow()

    fun placeOrder(order: Order) {
        viewModelScope.launch {
            _orderStatus.value = OrderStatus.Loading
            repository.placeOrder(order).collect { success ->
                if (success) {
                    _orderStatus.value = OrderStatus.Success
                } else {
                    _orderStatus.value = OrderStatus.Error("Failed to place order")
                }
            }
        }
    }

    fun resetStatus() {
        _orderStatus.value = OrderStatus.Idle
    }
}

sealed class OrderStatus {
    object Idle : OrderStatus()
    object Loading : OrderStatus()
    object Success : OrderStatus()
    data class Error(val message: String) : OrderStatus()
}
