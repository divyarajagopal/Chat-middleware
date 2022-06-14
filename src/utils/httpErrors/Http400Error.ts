import { HttpClientError } from './HttpClientError';

export class Http400Error extends HttpClientError {
  constructor(message: object | string = 'Unauthorized') {
    super(message);
    this.statusCode = 400;
  }
}
