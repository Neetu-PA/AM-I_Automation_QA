import winston from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Ensure logs directory exists
const logsDir = join(process.cwd(), 'reports', 'logs');
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` | Meta: ${JSON.stringify(meta)}`;
    }
    
    if (stack) {
      log += `\nStack: ${stack}`;
    }
    
    return log;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'playwright-cucumber-tests',
    environment: process.env.NODE_ENV || 'development',
    sessionId: process.env.TEST_SESSION_ID || 'local',
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: join(logsDir, 'test-execution.log'),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
    
    // Separate file for errors
    new winston.transports.File({
      filename: join(logsDir, 'errors.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 3,
    }),
  ],
  
  // Handle uncaught exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: join(logsDir, 'exceptions.log'),
    }),
  ],
  
  rejectionHandlers: [
    new winston.transports.File({
      filename: join(logsDir, 'rejections.log'),
    }),
  ],
});

// Enhanced logging methods with context
export class TestLogger {
  private context: string;
  
  constructor(context: string = 'General') {
    this.context = context;
  }
  
  private formatMessage(message: string): string {
    return `[${this.context}] ${message}`;
  }
  
  debug(message: string, meta?: any): void {
    logger.debug(this.formatMessage(message), meta);
  }
  
  info(message: string, meta?: any): void {
    logger.info(this.formatMessage(message), meta);
  }
  
  warn(message: string, meta?: any): void {
    logger.warn(this.formatMessage(message), meta);
  }
  
  error(message: string, error?: Error | any, meta?: any): void {
    const logMeta = { ...meta };
    
    if (error instanceof Error) {
      logMeta.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else if (error) {
      logMeta.error = error;
    }
    
    logger.error(this.formatMessage(message), logMeta);
  }
  
  // Test-specific logging methods
  testStart(testName: string, meta?: any): void {
    this.info(`🚀 Test Started: ${testName}`, { testName, ...meta });
  }
  
  testEnd(testName: string, status: 'PASSED' | 'FAILED' | 'SKIPPED', duration?: number, meta?: any): void {
    const emoji = status === 'PASSED' ? '✅' : status === 'FAILED' ? '❌' : '⏭️';
    this.info(`${emoji} Test ${status}: ${testName}`, { 
      testName, 
      status, 
      duration: duration ? `${duration}ms` : undefined,
      ...meta 
    });
  }
  
  stepStart(stepName: string, meta?: any): void {
    this.debug(`📝 Step: ${stepName}`, { stepName, ...meta });
  }
  
  stepEnd(stepName: string, status: 'PASSED' | 'FAILED', meta?: any): void {
    const emoji = status === 'PASSED' ? '✓' : '✗';
    this.debug(`${emoji} Step ${status}: ${stepName}`, { stepName, status, ...meta });
  }
  
  pageAction(action: string, element?: string, meta?: any): void {
    this.debug(`🎭 Page Action: ${action}${element ? ` on ${element}` : ''}`, { 
      action, 
      element, 
      ...meta 
    });
  }
  
  apiCall(method: string, url: string, status?: number, duration?: number, meta?: any): void {
    this.info(`🌐 API ${method} ${url}`, { 
      method, 
      url, 
      status, 
      duration: duration ? `${duration}ms` : undefined,
      ...meta 
    });
  }
  
  screenshot(path: string, reason?: string): void {
    this.info(`📸 Screenshot taken: ${path}${reason ? ` (${reason})` : ''}`, { 
      screenshotPath: path, 
      reason 
    });
  }
  
  performance(metric: string, value: number, unit: string = 'ms', meta?: any): void {
    this.info(`⚡ Performance: ${metric} = ${value}${unit}`, { 
      metric, 
      value, 
      unit, 
      ...meta 
    });
  }
}

// Create default logger instances
export const testLogger = new TestLogger('Test');
export const pageLogger = new TestLogger('Page');
export const apiLogger = new TestLogger('API');
export const hookLogger = new TestLogger('Hook');

// Utility function for creating context-specific loggers
export function createLogger(context: string): TestLogger {
  return new TestLogger(context);
}

// Log file helper for Cucumber attachments
export function appendToFile(logType: 'logs' | 'errors' | 'performance' = 'logs'): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${logType}-${timestamp}.log`;
  const filepath = join(logsDir, filename);
  
  logger.info(`Log file created: ${filepath}`);
  return filepath;
}


