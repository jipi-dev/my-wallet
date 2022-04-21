const winston = require('winston');

const logLevel = process.env.LOG_LEVEL || 'debug';
const silent = process.env.NODE_ENV === 'test';

const colorizer = winston.format.colorize();

const loggerFormat = winston.format.printf(({ level, message }) => colorizer.colorize(
level,
  `[${level}] ${message}`,
));

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    loggerFormat,
  ),
  transports: [
    new winston.transports.Console(),
  ],
  exitOnError: false,
  silent,
});

// Allow morgan middleware to write to winston
const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
module.exports.stream = stream;
