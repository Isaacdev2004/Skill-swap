type LogLevel = "info" | "warn" | "error" | "debug" | "audit";

interface LogMeta {
  [key: string]: unknown;
}

function formatMessage(level: LogLevel, message: string, meta?: LogMeta): string {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };

  return JSON.stringify(payload);
}

export const logger = {
  info(message: string, meta?: LogMeta): void {
    process.stdout.write(`${formatMessage("info", message, meta)}\n`);
  },
  warn(message: string, meta?: LogMeta): void {
    process.stdout.write(`${formatMessage("warn", message, meta)}\n`);
  },
  error(message: string, meta?: LogMeta): void {
    process.stderr.write(`${formatMessage("error", message, meta)}\n`);
  },
  debug(message: string, meta?: LogMeta): void {
    if (process.env.NODE_ENV !== "production") {
      process.stdout.write(`${formatMessage("debug", message, meta)}\n`);
    }
  },
  audit(action: string, meta?: LogMeta): void {
    process.stdout.write(`${formatMessage("audit", action, meta)}\n`);
  },
};
