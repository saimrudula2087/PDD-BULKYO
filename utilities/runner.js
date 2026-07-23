import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import kill from 'tree-kill';
import { logger } from './logger.js';

const FRONTEND_DIR = path.resolve('frontend');

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkAppReady() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5173', (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.end();
  });
}

async function run() {
  logger.info('--- STEP 1: Running React Routes & Form Discoverer ---');
  const discoverProcess = spawn('node', ['utilities/discoverer.js'], { stdio: 'inherit' });
  await new Promise((resolve) => discoverProcess.on('close', resolve));

  logger.info('--- STEP 2: Launching Vite React Application ---');
  const appProcess = spawn('npm', ['run', 'dev'], {
    cwd: FRONTEND_DIR,
    stdio: 'pipe',
    shell: true
  });

  appProcess.stderr.on('data', (data) => {
    logger.error(`[Vite Error] ${data.toString().trim()}`);
  });

  // Wait for application to be ready
  let isReady = false;
  for (let i = 0; i < 30; i++) {
    isReady = await checkAppReady();
    if (isReady) {
      break;
    }
    await wait(1000);
  }

  if (!isReady) {
    logger.error('React application failed to start on http://localhost:5173 within 30 seconds.');
    if (appProcess.pid) kill(appProcess.pid);
    process.exit(1);
  }
  logger.info('React application is running and accessible on http://localhost:5173');

  logger.info('--- STEP 3: Executing E2E Selenium Test Suite ---');
  const testProcess = spawn('npm', ['run', 'test:mocha'], {
    stdio: 'inherit',
    shell: true
  });

  testProcess.on('close', (code) => {
    logger.info(`Selenium E2E Test Execution finished with code: ${code}`);
    logger.info('--- STEP 4: Cleaning up Background Processes ---');
    if (appProcess.pid) {
      kill(appProcess.pid, 'SIGTERM', (err) => {
        if (err) logger.error(`Failed to terminate Vite app process tree: ${err.message}`);
        else logger.info('Successfully terminated Vite app process tree.');
        process.exit(code);
      });
    } else {
      process.exit(code);
    }
  });
}

run().catch(err => {
  logger.error(`Runner encountered error: ${err.message}`);
  process.exit(1);
});
