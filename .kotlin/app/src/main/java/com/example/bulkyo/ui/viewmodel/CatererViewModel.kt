package com.example.bulkyo.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.bulkyo.data.Caterer
import com.example.bulkyo.data.repository.BulkyORepository
import com.example.bulkyo.data.repository.FakeBulkyORepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class CatererViewModel(
    private val repository: BulkyORepository = FakeBulkyORepository()
) : ViewModel() {

    private val _caterers = MutableStateFlow<List<Caterer>>(emptyList())
    val caterers: StateFlow<List<Caterer>> = _caterers.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    fun loadCaterers(location: String) {
        viewModelScope.launch {
            _isLoading.value = true
            repository.getCaterers(location).collect {
                _caterers.value = it
                _isLoading.value = false
            }
        }
    }
}
