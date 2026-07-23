# Appium Android E2E Automation Setup & Execution Guide

This document contains step-by-step instructions to set up, configure, run, and maintain the Appium 2.x Android E2E Automation Framework.

---

## Prerequisites

1. **Node.js**: v18.x or v20.x
2. **Java JDK**: OpenJDK 17 or Temurin 17
3. **Android Studio & Android SDK**:
   - `ANDROID_HOME` environment variable configured pointing to Android SDK directory.
   - `platform-tools` added to system PATH (`adb` command line access).
4. **Appium Server 2.x**:
   ```bash
   npm install -g appium
   appium driver install uiautomator2
   ```

---

## Environment Configuration

Create a `.env` file in the project root:

```env
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723
APPIUM_PATH=/

# Android App Launch Options (Supports both APK and Installed App)
APK_PATH=./app/app-release.apk
APP_PACKAGE=com.example.bulkyo
APP_ACTIVITY=.MainActivity

# Target Device Parameters
ANDROID_DEVICE_NAME=Android Emulator
ANDROID_PLATFORM_VERSION=13.0
NO_RESET=true
FULL_RESET=false

# Timeouts (ms)
MOBILE_IMPLICIT_TIMEOUT=7000
MOBILE_EXPLICIT_TIMEOUT=15000
```

---

## Execution Commands

### 1. Run Dynamic Android Screen & Form Analyzer
Scans Kotlin Jetpack Compose screens under `.kotlin/` to discover form fields and generate validation test cases dynamically:
```bash
npm run analyze:mobile
```

### 2. Run Appium E2E Mobile Test Suite
Executes the mobile test suite, generates `excel/Mobile_E2E_Report.xlsx` (4 sheets), Mochawesome HTML reports (`reports/mobile_index.html`), logs, and failure screenshots:
```bash
npm run test:mobile
```

### 3. Run Web + Mobile Test Suites Together
```bash
npm run test
npm run test:mobile
```

---

## Reports & Artifacts Generated

- **Excel Report**: [excel/Mobile_E2E_Report.xlsx](file:///C:/Users/saimr/OneDrive/Apps/BulkyO/BulkyO/BulkyO/excel/Mobile_E2E_Report.xlsx)
  - Sheet 1: Summary Stats
  - Sheet 2: Test Cases Details
  - Sheet 3: Failed Tests with Screenshot Links & Logcat Info
  - Sheet 4: Step-by-Step Execution Logs
- **HTML Report**: [reports/mobile_index.html](file:///C:/Users/saimr/OneDrive/Apps/BulkyO/BulkyO/BulkyO/reports/mobile_index.html)
- **Execution Log**: `logs/mobile_execution.log`
- **Failure Screenshots & Logcats**: `reports/failures/`
