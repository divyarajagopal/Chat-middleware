import { Response, NextFunction } from 'express';
import { HttpClientError } from './httpErrors/HttpClientError';
import { Http404Error } from './httpErrors';

export const NotFoundErrorHandler = () => {
  throw new Http404Error('Method not found.');
};

export const ClientErrorHandler = (
  err: Error,
  res: Response,
  next: NextFunction
) => {
  const clientError = err as HttpClientError;
  if (clientError) {
    console.warn(clientError);
    res.status(clientError.statusCode).send(clientError.message);
  } else {
    next(clientError);
  }
};

export const ServerErrorHandler = (
  err: Error,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  if (process.env.NODE_ENV === 'production') {
    res.status(500).send('Internal Server Error');
  } else {
    res.status(500).send(err.stack);
  }
};
