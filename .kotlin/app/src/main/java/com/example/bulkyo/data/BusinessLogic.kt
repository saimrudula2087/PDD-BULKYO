package com.example.bulkyo.data

import java.time.LocalDateTime
import java.time.Duration

object BulkyORules {
    // Customers should order food at least 16 hours prior
    fun canOrder(eventTime: LocalDateTime): Boolean {
        return Duration.between(LocalDateTime.now(), eventTime).toHours() >= 16
    }

    // Customers can cancel before 14 hours of event time
    fun canCancel(eventTime: LocalDateTime): Boolean {
        return Duration.between(LocalDateTime.now(), eventTime).toHours() >= 14
    }

    // Customers should pay the bill before 12 hours of event time
    fun isPaymentRequiredNow(eventTime: LocalDateTime): Boolean {
        return Duration.between(LocalDateTime.now(), eventTime).toHours() <= 12
    }

    fun getPaymentDeadline(eventTime: LocalDateTime): LocalDateTime {
        return eventTime.minusHours(12)
    }

    // Caterers can register if they are having fssai certificate only
    fun isValidFssai(fssaiNumber: String): Boolean {
        // Basic validation: FSSAI is usually 14 digits
        return fssaiNumber.length == 14 && fssaiNumber.all { it.isDigit() } || fssaiNumber.startsWith("FSSAI-")
    }

    fun getOrderRuleMessage() = "Orders must be placed at least 16 hours before the event."
    fun getCancelRuleMessage() = "Cancellations are allowed up to 14 hours before the event."
    fun getPaymentRuleMessage() = "Full payment must be completed 12 hours before the event."
}
