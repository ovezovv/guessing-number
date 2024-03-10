import winston from 'winston';
const { timestamp, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  )
});

export default logger;