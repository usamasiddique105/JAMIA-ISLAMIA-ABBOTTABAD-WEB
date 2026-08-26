/**
 * Jamia Islamia Abbottabad - Production-safe Logger Utility
 * Suppresses debugging logs in production while keeping error monitoring active
 */

const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    // Errors are logged safely
    console.error(...args);
  }
};
