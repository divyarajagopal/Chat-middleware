import express from 'express';
import { logger } from './src/utils';
import chalk from 'chalk';
import { Startup } from './src/utils/setupFiles/startup';

const app = express();
const { PORT = 4300 } = process.env;

Startup.ConfigureRouter(app);

app.listen(PORT, () => {
  const message = `Listening for requests on port ${PORT}`;
  logger.info(message);
  console.log(chalk.green(message));
});
