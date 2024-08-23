// src/utils/logger.ts
const isProduction = process.env.NODE_ENV === "production";

export const log = (...args: any[]): void => {
  if (!isProduction) {
    console.log(...args);
  }
};

export const consoleError = (...args: any[]): void => {
  if (!isProduction) {
    console.error(...args);
  }
};
