import { HttpClientError } from './HttpClientError';

export class Http401Error extends HttpClientError {
  constructor(message: object | string = 'Unauthorized') {
    super(message);
    this.statusCode = 401;
  }
}
