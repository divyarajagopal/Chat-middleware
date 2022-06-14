import { Request, Response, NextFunction, Router } from 'express';
import {
  ClientErrorHandler,
  ServerErrorHandler,
  NotFoundErrorHandler
} from '../utils/errorHandler';
import { Converter, logger } from '../utils';
import chalk from 'chalk';

const Handle404Error = (router: Router) => {
  router.use((req: Request, res: Response) => {
    NotFoundErrorHandler();
  });
};

const HandleClientError = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ClientErrorHandler(err, res, next);
  });
};

const HandleServerError = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ServerErrorHandler(err, res, next);
  });
};

// Unhandled exception handlers
process.on('uncaughtException', e => {
  const errorMessage =
    'UncaughtException event occured: ' + Converter.Stringify(e);
  logger.error(errorMessage);
  console.log(chalk.red(errorMessage));
  process.exit(1);
});

process.on('unhandledRejection', () => {
  const errorMessage = 'UnhandledRejection event occured';
  logger.error(errorMessage);
  console.log(chalk.red(errorMessage));
  process.exit(1);
});

export default [Handle404Error, HandleClientError, HandleServerError];
