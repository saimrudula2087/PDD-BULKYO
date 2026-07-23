package com.example.bulkyo.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.bulkyo.data.MenuItem
import com.example.bulkyo.data.repository.BulkyORepository
import com.example.bulkyo.data.repository.FakeBulkyORepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ManageMenuViewModel(
    private val repository: BulkyORepository = FakeBulkyORepository()
) : ViewModel() {

    private val _menuItems = MutableStateFlow<List<MenuItem>>(emptyList())
    val menuItems: StateFlow<List<MenuItem>> = _menuItems.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    fun loadMenu(catererId: String) {
        viewModelScope.launch {
            _isLoading.value = true
            repository.getCatererDetails(catererId).collect { caterer ->
                _menuItems.value = caterer?.menu ?: emptyList()
                _isLoading.value = false
            }
        }
    }

    fun addItem(catererId: String, item: MenuItem) {
        viewModelScope.launch {
            _isLoading.value = true
            repository.addMenuItem(catererId, item).collect { success ->
                if (success) {
                    _menuItems.value = _menuItems.value + item
                }
                _isLoading.value = false
            }
        }
    }

    fun deleteItem(catererId: String, itemId: String) {
        viewModelScope.launch {
            // Simulate deletion in fake backend
            _menuItems.value = _menuItems.value.filter { it.id != itemId }
        }
    }
}
