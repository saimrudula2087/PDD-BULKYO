"""
BulkyO Android Application - Appium End-to-End Automation Test Suite
Framework: Appium (Python Client)
Target: Android Mobile Application / WebView
"""

import unittest
import time
from appium import webdriver
from appium.options.android import UiAutomator2Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BulkyOAndroidTests(unittest.TestCase):

    def setUp(self):
        options = UiAutomator2Options()
        options.platform_name = 'Android'
        options.device_name = 'Android Emulator'
        options.app_package = 'com.bulkyo.app'
        options.app_activity = '.MainActivity'
        options.automation_name = 'UiAutomator2'
        options.no_reset = True
        
        # Connect to local Appium Server
        self.driver = webdriver.Remote('http://localhost:4723/wd/hub', options=options)
        self.driver.implicitly_wait(10)

    def test_001_customer_login_flow(self):
        """TC-APP-001: Verify Customer Login on Android App"""
        print("[Appium] Testing Customer Login...")
        login_btn = self.driver.find_element(By.XPATH, "//android.widget.Button[@text='Login']")
        login_btn.click()
        
        email_field = self.driver.find_element(By.XPATH, "//android.widget.EditText[@hint='Enter email']")
        email_field.send_keys("customer@bulkyo.com")
        
        password_field = self.driver.find_element(By.XPATH, "//android.widget.EditText[@hint='Enter password']")
        password_field.send_keys("SecurePass123!")
        
        submit_btn = self.driver.find_element(By.XPATH, "//android.widget.Button[@text='Login']")
        submit_btn.click()
        
        # Verify Customer Dashboard Header
        header = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.XPATH, "//android.widget.TextView[@text='Customer Portal']"))
        )
        self.assertIsNotNone(header)

    def test_002_caterer_fssai_upload(self):
        """TC-APP-002: Verify Caterer FSSAI Certificate Upload Screen"""
        print("[Appium] Testing Caterer FSSAI Upload Screen...")
        register_btn = self.driver.find_element(By.XPATH, "//android.widget.Button[@text='Register as Caterer']")
        register_btn.click()
        
        fssai_input = self.driver.find_element(By.XPATH, "//android.widget.Button[@text='FSSAI Certificate Upload']")
        self.assertTrue(fssai_input.is_displayed())

    def test_003_checkout_guest_count_validation(self):
        """TC-APP-003: Verify Minimum Guest Count Enforcement (>= 50 Guests)"""
        print("[Appium] Testing Guest Count Validation...")
        # Simulate mobile guest count entry
        guest_input = self.driver.find_element(By.XPATH, "//android.widget.EditText[@type='number']")
        guest_input.clear()
        guest_input.send_keys("25")
        
        submit_booking = self.driver.find_element(By.XPATH, "//android.widget.Button[@text='Confirm Booking Request']")
        submit_booking.click()
        
        # Alert check
        alert_text = self.driver.switch_to.alert.text
        self.assertIn("Minimum guest count is 50", alert_text)

    def tearDown(self):
        if self.driver:
            self.driver.quit()

if __name__ == '__main__':
    unittest.main()
