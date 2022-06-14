import log4js, { Appender } from 'log4js';

interface LogCategory {
  [name: string]: {
    appenders: string[];
    level: string;
  };
}

const logFileAppender: Appender = {
  type: 'file',
  filename: 'log/application.log'
};

const logFileCategory: LogCategory = {
  default: { appenders: ['logFileAppender'], level: 'all' }
};

log4js.configure({
  appenders: {
    logFileAppender
  },
  categories: logFileCategory
});

export const logger = log4js.getLogger('Virtual Agent Middle Server');

if (process.env.NODE_ENV === 'development') {
  logger.level = 'debug';
} else if (process.env.NODE_ENV === 'production') {
  logger.level = 'error';
}
