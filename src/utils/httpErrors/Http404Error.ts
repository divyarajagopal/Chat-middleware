import { HttpClientError } from './HttpClientError';

export class Http404Error extends HttpClientError {
  constructor(message: object | string = 'Not Found') {
    super(message);
    this.statusCode = 404;
  }
}
