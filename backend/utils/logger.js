const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const config = require('./config'); 

const transports = [
  new winston.transports.Console({    
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  })
];

if (config.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.DailyRotateFile({
      dirname: '/app/logs/',
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    })
  );
}

const logger = winston.createLogger({
  level: config.NODE_ENV === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports
});

module.exports = logger;