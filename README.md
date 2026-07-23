# BulkyO E2E Selenium Automation Framework

This repository hosts a production-ready, enterprise-grade End-to-End (E2E) Test Automation Framework designed for the BulkyO React application using Node.js, Selenium WebDriver, Mocha, Chai, ExcelJS, Winston, and GitHub Actions.

---

## 🌟 Framework Architecture

The framework is structured using the **Page Object Model (POM)** design pattern, separation of concerns, and config-driven parameters.

```
project-root/
├── .github/workflows/   # CI/CD workflows (GitHub Actions)
├── config/              # Global environment configurations
├── data/                # Discovered test metadata and schemas
├── excel/               # Generated multi-sheet Excel reports
├── logs/                # Execution log files
├── pages/               # Page Object Model classes
├── reports/             # HTML and JSON test execution reports
├── screenshots/         # Screenshots captured on failures
├── tests/               # Test setups and spec files
├── utilities/           # Selenium wrappers, excel, and logger engines
├── package.json         # Project dependencies and script runner
└── README.md            # Framework documentation
```

### Key Capabilities

1. **Dynamic Page & Form Discovery**: Custom utility scans the React application (`App.jsx` and components inside `pages`) at runtime to map all routing and input element constraints. It then dynamically generates validation tests (boundary checks, email validation, minimum guests checks, mandatory fields) instead of relying solely on hardcoded values.
2. **Page Object Model (POM)**: Simplifies element locating and action packaging, enabling reusable methods and readable test files.
3. **Robust Reusable Utilities**: Wraps raw Webdriver clicks, types, alerts, scrolls, file uploads, and explicit waits to guard against flakiness and page load sync issues.
4. **Winston-Powered Logging**: Logs detailed execution steps to both standard terminal output and persistent log files.
5. **ExcelJS Report Engine**: Generates a professional multi-sheet Excel workbook (`excel/E2E_Report.xlsx`) detailing execution metrics, passing percentages, individual run logs, and failure details.
6. **Mochawesome HTML Reporter**: Generates clean, graphical, interactive web-based reports with failing traces and failure screenshots embedded.
7. **CI/CD Integration**: Executes tests headlessly inside GitHub Actions on push/pull request and archives Excel test reports, Mochawesome charts, screenshots, and logs.

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** (v18 or higher recommended)
- **Google Chrome** (or Microsoft Edge / Mozilla Firefox)

### ⚙️ Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/saimrudula2087/PDD-BULKYO.git
   cd PDD-BULKYO
   ```
2. Install framework dependencies at the root:
   ```bash
   npm install
   ```
3. Install React frontend application dependencies:
   ```bash
   cd frontend && npm install && cd ..
   ```

---

## 💻 Running the Tests

To launch the application server, perform dynamic route/form discovery, execute the E2E suite, and generate all reports, run:
```bash
npm run test
```

### Running Mocha Spec Directly (App already running)
If your React application is already running on `http://localhost:5173`, run:
1. Scan page routes & build dynamic configurations:
   ```bash
   npm run discover
   ```
2. Launch tests:
   ```bash
   npm run test:mocha
   ```

---

## ⚙️ Configuration & Environment Control

Global configuration parameters are located under `config/config.js`. You can override defaults using environment variables or a `.env` file in the root:

| Variable | Description | Default | Options |
| --- | --- | --- | --- |
| `BASE_URL` | Base application URL | `http://localhost:5173` | Any URL |
| `BROWSER` | Target browser for execution | `chrome` | `chrome`, `firefox`, `edge` |
| `HEADLESS` | Run browser in headless mode | `true` | `true`, `false` |
| `TIMEOUT_IMPLICIT` | Implicit wait in milliseconds | `5000` | Any positive integer |
| `TIMEOUT_EXPLICIT` | Explicit wait in milliseconds | `10000` | Any positive integer |

Example `.env` file:
```env
BROWSER=chrome
HEADLESS=false
BASE_URL=http://localhost:5173
```
