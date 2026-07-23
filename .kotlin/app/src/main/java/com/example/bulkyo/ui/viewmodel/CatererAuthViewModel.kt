package com.example.bulkyo.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.bulkyo.data.Caterer
import com.example.bulkyo.data.User
import com.example.bulkyo.data.repository.BulkyORepository
import com.example.bulkyo.data.repository.FakeBulkyORepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class CatererAuthViewModel(
    private val repository: BulkyORepository = FakeBulkyORepository()
) : ViewModel() {

    private val _authState = MutableStateFlow<CatererAuthState>(CatererAuthState.Idle)
    val authState: StateFlow<CatererAuthState> = _authState.asStateFlow()

    fun signup(user: User) {
        viewModelScope.launch {
            _authState.value = CatererAuthState.Loading
            repository.signupCaterer(user).collect { success ->
                if (success) {
                    _authState.value = CatererAuthState.SignupSuccess
                } else {
                    _authState.value = CatererAuthState.Error("Signup failed")
                }
            }
        }
    }

    fun completeSetup(caterer: Caterer) {
        viewModelScope.launch {
            _authState.value = CatererAuthState.Loading
            repository.createCatererProfile(caterer).collect { success ->
                if (success) {
                    _authState.value = CatererAuthState.SetupSuccess
                } else {
                    _authState.value = CatererAuthState.Error("Profile setup failed")
                }
            }
        }
    }

    fun resetState() {
        _authState.value = CatererAuthState.Idle
    }
}

sealed class CatererAuthState {
    object Idle : CatererAuthState()
    object Loading : CatererAuthState()
    object SignupSuccess : CatererAuthState()
    object SetupSuccess : CatererAuthState()
    data class Error(val message: String) : CatererAuthState()
}
