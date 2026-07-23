import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { logger } from './logger.js';

export class ExcelReporter {
  constructor() {
    this.results = [];
    this.logs = [];
  }

  // Record a test result
  recordResult({ id, module, scenario, browser, status, startTime, endTime, duration, failureReason, screenshotPath, url }) {
    this.results.push({
      id,
      module,
      scenario,
      browser,
      status,
      startTime,
      endTime,
      duration,
      failureReason,
      screenshotPath,
      url
    });
  }

  // Record an execution log step
  recordLog(testName, stepDescription, result, remarks = '') {
    this.logs.push({
      timestamp: new Date().toISOString(),
      testName,
      stepDescription,
      result,
      remarks
    });
  }

  // Generate Excel report
  async generateReport(environment = 'QA') {
    logger.info('Generating E2E Excel Report...');
    const workbook = new ExcelJS.Workbook();
    
    // 1. Sheet 1: Summary
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
      { header: 'Execution Date', key: 'date', width: 25 },
      { header: 'Environment', key: 'env', width: 15 },
      { header: 'Total Tests', key: 'total', width: 15 },
      { header: 'Passed', key: 'passed', width: 12 },
      { header: 'Failed', key: 'failed', width: 12 },
      { header: 'Skipped', key: 'skipped', width: 12 },
      { header: 'Pass Percentage', key: 'passPercent', width: 18 },
      { header: 'Execution Duration (ms)', key: 'duration', width: 25 }
    ];

    const totalTests = this.results.length;
    const passed = this.results.filter(r => r.status.toLowerCase() === 'passed').length;
    const failed = this.results.filter(r => r.status.toLowerCase() === 'failed').length;
    const skipped = this.results.filter(r => r.status.toLowerCase() === 'skipped').length;
    const passPercent = totalTests > 0 ? `${((passed / totalTests) * 100).toFixed(2)}%` : '0%';
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    const summaryRow = summarySheet.addRow({
      date: new Date().toLocaleString(),
      env: environment,
      total: totalTests,
      passed,
      failed,
      skipped,
      passPercent,
      duration: totalDuration
    });

    // Style Summary Sheet
    this.styleHeaderRow(summarySheet);
    this.styleDataRow(summaryRow);

    // 2. Sheet 2: Test Cases
    const tcSheet = workbook.addWorksheet('Test Cases');
    tcSheet.columns = [
      { header: 'Test ID', key: 'id', width: 15 },
      { header: 'Module', key: 'module', width: 20 },
      { header: 'Scenario Name', key: 'scenario', width: 45 },
      { header: 'Browser', key: 'browser', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Start Time', key: 'startTime', width: 25 },
      { header: 'End Time', key: 'endTime', width: 25 },
      { header: 'Duration (ms)', key: 'duration', width: 15 }
    ];

    this.results.forEach(r => {
      const row = tcSheet.addRow({
        id: r.id,
        module: r.module,
        scenario: r.scenario,
        browser: r.browser,
        status: r.status,
        startTime: r.startTime.toLocaleString(),
        endTime: r.endTime.toLocaleString(),
        duration: r.duration
      });
      this.styleDataRow(row, r.status);
    });
    this.styleHeaderRow(tcSheet);

    // 3. Sheet 3: Failed Tests
    const failedSheet = workbook.addWorksheet('Failed Tests');
    failedSheet.columns = [
      { header: 'Test Name', key: 'name', width: 45 },
      { header: 'Failure Reason', key: 'reason', width: 50 },
      { header: 'Screenshot Path', key: 'screenshot', width: 50 },
      { header: 'Browser', key: 'browser', width: 15 },
      { header: 'URL', key: 'url', width: 40 }
    ];

    const failedTests = this.results.filter(r => r.status.toLowerCase() === 'failed');
    failedTests.forEach(r => {
      const row = failedSheet.addRow({
        name: r.scenario,
        reason: r.failureReason,
        screenshot: r.screenshotPath || 'N/A',
        browser: r.browser,
        url: r.url || 'N/A'
      });
      this.styleDataRow(row, 'Failed');
    });
    this.styleHeaderRow(failedSheet);

    // 4. Sheet 4: Execution Logs
    const logSheet = workbook.addWorksheet('Execution Logs');
    logSheet.columns = [
      { header: 'Timestamp', key: 'timestamp', width: 25 },
      { header: 'Test Name', key: 'testName', width: 40 },
      { header: 'Step Description', key: 'desc', width: 50 },
      { header: 'Result', key: 'result', width: 15 },
      { header: 'Remarks', key: 'remarks', width: 30 }
    ];

    this.logs.forEach(l => {
      const row = logSheet.addRow({
        timestamp: l.timestamp,
        testName: l.testName,
        desc: l.stepDescription,
        result: l.result,
        remarks: l.remarks
      });
      this.styleDataRow(row, l.result);
    });
    this.styleHeaderRow(logSheet);

    // Write to folder
    const reportDir = path.join('excel');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, 'E2E_Report.xlsx');
    await workbook.xlsx.writeFile(reportPath);
    logger.info(`Excel Report saved at: ${reportPath}`);
  }

  // Styling Helpers
  styleHeaderRow(sheet) {
    const headerRow = sheet.getRow(1);
    headerRow.height = 28;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E3A8A' } // Dark blue
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' },
        bold: true,
        size: 11,
        name: 'Segoe UI'
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'medium', color: { argb: 'FFCBD5E1' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
      };
    });
  }

  styleDataRow(row, status = '') {
    row.height = 20;
    row.eachCell((cell) => {
      cell.font = { size: 10, name: 'Segoe UI' };
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFF1F5F9' } },
        left: { style: 'thin', color: { argb: 'FFF1F5F9' } },
        bottom: { style: 'thin', color: { argb: 'FFF1F5F9' } },
        right: { style: 'thin', color: { argb: 'FFF1F5F9' } }
      };
    });

    // Status styling highlights
    let statusCell = null;
    row.eachCell((cell, colNumber) => {
      const col = row.worksheet.getColumn(colNumber);
      if (col && (col.key === 'status' || col.key === 'result')) {
        statusCell = cell;
      }
    });

    if (statusCell) {
      statusCell.alignment = { vertical: 'middle', horizontal: 'center' };
      statusCell.font = { bold: true, size: 10, name: 'Segoe UI' };
      const statusText = (statusCell.value || '').toString().toLowerCase();
      if (statusText === 'passed' || statusText === 'pass' || statusText === 'success') {
        statusCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD1FAE5' } // Soft Green
        };
        statusCell.font.color = { argb: 'FF065F46' };
      } else if (statusText === 'failed' || statusText === 'fail') {
        statusCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFEE2E2' } // Soft Red
        };
        statusCell.font.color = { argb: 'FF991B1B' };
      } else if (statusText === 'skipped') {
        statusCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FEF3C7' } // Soft Amber
        };
        statusCell.font.color = { argb: 'FF92400E' };
      }
    }
  }
}
export const excelReporter = new ExcelReporter();
