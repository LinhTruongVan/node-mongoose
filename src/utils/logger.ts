import winston from "winston";
import "winston-daily-rotate-file";

const transport = new (<any>winston.transports).DailyRotateFile({
  filename: "./logs/%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d"
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [transport]
});

export default logger;
