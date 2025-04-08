import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

const logDir = "logs";

if (process.env.NODE_ENV !== "production" && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.printf(({ level, message, timestamp, stack }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
    })
  ),
  transports: [new transports.Console()],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    })
  );

  logger.add(
    new transports.File({
      filename: path.join(logDir, "combined.log"),
    })
  );
}

export default logger;
