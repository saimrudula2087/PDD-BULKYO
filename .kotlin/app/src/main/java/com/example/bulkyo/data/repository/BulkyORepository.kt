package com.example.bulkyo.data.repository

import com.example.bulkyo.data.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.map

interface BulkyORepository {
    fun getCaterers(location: String): Flow<List<Caterer>>
    fun getCatererDetails(id: String): Flow<Caterer?>
    fun placeOrder(order: Order): Flow<Boolean>
    
    // Professional Backend Methods for Caterers
    fun signupCaterer(user: User): Flow<Boolean>
    fun createCatererProfile(caterer: Caterer): Flow<Boolean>
    fun addMenuItem(catererId: String, item: MenuItem): Flow<Boolean>
    fun updateCapacity(catererId: String, min: Int, max: Int): Flow<Boolean>
}

class FakeBulkyORepository : BulkyORepository {
    // In-memory "Backend" state to simulate a real database
    private val _caterers = MutableStateFlow(SampleData.caterers)
    private val _users = MutableStateFlow(SampleData.customers)

    override fun getCaterers(location: String): Flow<List<Caterer>> = _caterers.map { list ->
        delay(1000) // Simulate network latency
        list.filter { it.location.contains(location, ignoreCase = true) }
    }

    override fun getCatererDetails(id: String): Flow<Caterer?> = _caterers.map { list ->
        delay(500)
        list.find { it.id == id }
    }

    override fun placeOrder(order: Order): Flow<Boolean> = flow {
        delay(2000)
        emit(true)
    }

    override fun signupCaterer(user: User): Flow<Boolean> = flow {
        delay(1500)
        _users.value = _users.value + user
        emit(true)
    }

    override fun createCatererProfile(caterer: Caterer): Flow<Boolean> = flow {
        delay(1500)
        _caterers.value = _caterers.value + caterer
        emit(true)
    }

    override fun addMenuItem(catererId: String, item: MenuItem): Flow<Boolean> = flow {
        delay(1000)
        _caterers.value = _caterers.value.map {
            if (it.id == catererId) {
                it.copy(menu = it.menu + item)
            } else it
        }
        emit(true)
    }

    override fun updateCapacity(catererId: String, min: Int, max: Int): Flow<Boolean> = flow {
        delay(1000)
        _caterers.value = _caterers.value.map {
            if (it.id == catererId) {
                it.copy(minCapacity = min, maxCapacity = max)
            } else it
        }
        emit(true)
    }
}
