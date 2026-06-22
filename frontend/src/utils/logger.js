// src/utils/logger.js

function baseLog(level, ...args) {
  const alwaysVisible = ['info', 'warn', 'error']
  const isDev = import.meta.env.MODE === 'development'

  if (alwaysVisible.includes(level) || isDev) {
    const prefix = `[${level.toUpperCase()}]`
    if (typeof console[level] === 'function') {
      console[level](prefix, ...args)
    } else {
      console.log(prefix, ...args)
    }
  }
}

export const logger = {
  info: (...args) => baseLog('info', ...args),
  error: (...args) => baseLog('error', ...args),
  warn: (...args) => baseLog('warn', ...args),
  debug: (...args) => baseLog('debug', ...args),
  log: (...args) => baseLog('log', ...args)
}
