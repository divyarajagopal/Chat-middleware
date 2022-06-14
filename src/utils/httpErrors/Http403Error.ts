import { HttpClientError } from './HttpClientError';

export class Http403Error extends HttpClientError {
  constructor(message: object | string = 'Forbidden') {
    super(message);
    this.statusCode = 403;
  }
}
