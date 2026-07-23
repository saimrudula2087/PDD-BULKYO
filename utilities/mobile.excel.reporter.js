import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { mobileLogger } from './mobile.logger.js';

export class MobileExcelReporter {
  constructor() {
    this.results = [];
    this.logs = [];
    this.deviceInfo = {
      deviceName: process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
      platformVersion: process.env.ANDROID_PLATFORM_VERSION || 'Android 13.0',
    };
  }

  addTestCaseResult(testResult) {
    this.results.push(testResult);
  }

  addExecutionLog(logEntry) {
    this.logs.push(logEntry);
  }

  async generateReport() {
    const excelDir = path.resolve('excel');
    if (!fs.existsSync(excelDir)) {
      fs.mkdirSync(excelDir, { recursive: true });
    }

    const filePath = path.join(excelDir, 'Mobile_E2E_Report.xlsx');
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'BulkyO Mobile QA Automation Architect';
    workbook.created = new Date();

    const headerFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E293B' } // Dark Slate
    };
    const headerFont = { color: { argb: 'FFFFFF' }, bold: true, size: 11 };

    // --- Sheet 1: Summary ---
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Metric', key: 'metric', width: 28 },
      { header: 'Value', key: 'value', width: 45 }
    ];

    const totalTests = this.results.length;
    const passed = this.results.filter(r => r.status === 'PASSED').length;
    const failed = this.results.filter(r => r.status === 'FAILED').length;
    const skipped = this.results.filter(r => r.status === 'SKIPPED').length;
    const passPercentage = totalTests > 0 ? ((passed / totalTests) * 100).toFixed(2) + '%' : '0%';
    const totalDurationMs = this.results.reduce((acc, r) => acc + (r.durationMs || 0), 0);
    const totalDurationSec = (totalDurationMs / 1000).toFixed(2) + 's';

    summarySheet.addRows([
      { metric: 'Execution Date', value: new Date().toLocaleString() },
      { metric: 'Device Name', value: this.deviceInfo.deviceName },
      { metric: 'Android Version', value: this.deviceInfo.platformVersion },
      { metric: 'Automation Tool', value: 'Appium 2.x (UiAutomator2)' },
      { metric: 'Total Tests', value: totalTests },
      { metric: 'Passed', value: passed },
      { metric: 'Failed', value: failed },
      { metric: 'Skipped', value: skipped },
      { metric: 'Pass Percentage', value: passPercentage },
      { metric: 'Execution Duration', value: totalDurationSec }
    ]);

    // --- Sheet 2: Test Cases ---
    const tcSheet = workbook.addWorksheet('Test Cases');
    tcSheet.columns = [
      { header: 'Test ID', key: 'testId', width: 15 },
      { header: 'Module', key: 'module', width: 22 },
      { header: 'Scenario', key: 'scenario', width: 50 },
      { header: 'Device', key: 'device', width: 22 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Start Time', key: 'startTime', width: 22 },
      { header: 'End Time', key: 'endTime', width: 22 },
      { header: 'Duration (ms)', key: 'duration', width: 15 }
    ];

    this.results.forEach(r => {
      const row = tcSheet.addRow({
        testId: r.testId || 'TC-MOB-000',
        module: r.module || 'Mobile E2E',
        scenario: r.scenario,
        device: this.deviceInfo.deviceName,
        status: r.status,
        startTime: r.startTime,
        endTime: r.endTime,
        duration: r.durationMs
      });

      const statusCell = row.getCell('status');
      if (r.status === 'PASSED') {
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D1FAE5' } };
        statusCell.font = { color: { argb: '065F46' }, bold: true };
      } else if (r.status === 'FAILED') {
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
        statusCell.font = { color: { argb: '991B1B' }, bold: true };
      }
    });

    // --- Sheet 3: Failed Tests ---
    const failSheet = workbook.addWorksheet('Failed Tests');
    failSheet.columns = [
      { header: 'Test Name', key: 'testName', width: 45 },
      { header: 'Failure Reason', key: 'reason', width: 60 },
      { header: 'Screenshot Path', key: 'screenshot', width: 55 },
      { header: 'Device', key: 'device', width: 20 },
      { header: 'Android Version', key: 'version', width: 18 },
      { header: 'Activity Name', key: 'activity', width: 35 }
    ];

    this.results.filter(r => r.status === 'FAILED').forEach(f => {
      failSheet.addRow({
        testName: f.scenario,
        reason: f.failureReason || 'N/A',
        screenshot: f.screenshotPath || 'N/A',
        device: this.deviceInfo.deviceName,
        version: this.deviceInfo.platformVersion,
        activity: f.activity || '.MainActivity'
      });
    });

    // --- Sheet 4: Execution Logs ---
    const logSheet = workbook.addWorksheet('Execution Logs');
    logSheet.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 24 },
      { header: 'Test Name', key: 'testName', width: 40 },
      { header: 'Step', key: 'step', width: 50 },
      { header: 'Result', key: 'result', width: 12 },
      { header: 'Remarks', key: 'remarks', width: 40 }
    ];

    this.logs.forEach(l => {
      logSheet.addRow({
        timestamp: l.timestamp || new Date().toISOString(),
        testName: l.testName || 'Global',
        step: l.step,
        result: l.result || 'INFO',
        remarks: l.remarks || ''
      });
    });

    // Apply Styles to Headers
    [summarySheet, tcSheet, failSheet, logSheet].forEach(sheet => {
      sheet.getRow(1).eachCell(cell => {
        cell.fill = headerFill;
        cell.font = headerFont;
      });
    });

    await workbook.xlsx.writeFile(filePath);
    mobileLogger.info(`Mobile E2E Excel Report generated successfully at: ${filePath}`);
    return filePath;
  }
}
