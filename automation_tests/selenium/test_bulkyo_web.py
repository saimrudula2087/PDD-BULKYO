"""
BulkyO Web Application - Selenium End-to-End Automation Test Suite
Framework: Selenium WebDriver (Python)
Target: Web Application (Chrome/Firefox/Edge)
"""

import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BulkyOWebTests(unittest.TestCase):

    def setUp(self):
        options = webdriver.ChromeOptions()
        options.add_argument('--headless') # Run headless mode for CI/CD
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        
        self.driver = webdriver.Chrome(options=options)
        self.driver.implicitly_wait(10)
        self.base_url = "http://localhost:5173"

    def test_001_landing_page_title_and_headline(self):
        """TC-SEL-001: Verify Landing Page Headline & Cultural Styling"""
        print("[Selenium] Testing Landing Page...")
        self.driver.get(self.base_url)
        
        headline = self.driver.find_element(By.TAG_NAME, "h1")
        self.assertIn("BulkyO", headline.text)

    def test_002_customer_search_and_menu_navigation(self):
        """TC-SEL-002: Verify Customer Caterer Search & View Menu Flow"""
        print("[Selenium] Testing Customer Caterer Search...")
        self.driver.get(f"{self.base_url}/customer")
        
        search_input = self.driver.find_element(By.XPATH, "//input[@placeholder='Search caterers by name or cuisine...']")
        search_input.send_keys("Royal")
        
        view_menu_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'View Menu')]")
        view_menu_btn.click()
        
        # Verify navigation to Menu Details page
        self.assertTrue("/caterer-menu/" in self.driver.current_url)

    def test_003_cart_context_add_item_and_checkout(self):
        """TC-SEL-003: Verify Add to Cart and Checkout Calculation"""
        print("[Selenium] Testing Cart and Checkout...")
        self.driver.get(f"{self.base_url}/caterer-menu/1")
        
        add_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Add')]")
        add_btn.click()
        
        cart_badge = self.driver.find_element(By.XPATH, "//span[contains(text(), 'Items')]")
        self.assertIn("1 Items", cart_badge.text)
        
        cart_badge.click()
        self.assertTrue("/customer/checkout" in self.driver.current_url)

    def tearDown(self):
        if self.driver:
            self.driver.quit()

if __name__ == '__main__':
    unittest.main()
