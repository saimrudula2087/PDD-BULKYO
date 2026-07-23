import dotenv from 'dotenv';
dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:5173',
  browserName: process.env.BROWSER || 'chrome', // 'chrome' | 'firefox' | 'edge'
  headless: process.env.HEADLESS === 'true' || process.env.HEADLESS === undefined, // default to headless
  timeouts: {
    implicit: parseInt(process.env.TIMEOUT_IMPLICIT || '5000', 10),
    explicit: parseInt(process.env.TIMEOUT_EXPLICIT || '10000', 10),
  },
  environment: process.env.NODE_ENV || 'development',
};
