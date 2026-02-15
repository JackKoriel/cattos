const format = (level: string, message: unknown, meta?: unknown) => {
  const timestamp = new Date().toISOString()
  if (meta !== undefined) {
    try {
      return `[${timestamp}] ${level} - ${message} ${typeof meta === 'string' ? meta : JSON.stringify(meta)}`
    } catch {
      return `[${timestamp}] ${level} - ${message} (meta)`
    }
  }
  return `[${timestamp}] ${level} - ${message}`
}

export const logger = {
  info: (msg: unknown, meta?: unknown) => console.log(format('INFO', msg, meta)),
  warn: (msg: unknown, meta?: unknown) => console.warn(format('WARN', msg, meta)),
  error: (msg: unknown, meta?: unknown) => console.error(format('ERROR', msg, meta)),
  debug: (msg: unknown, meta?: unknown) => console.debug(format('DEBUG', msg, meta)),
}

export default logger
