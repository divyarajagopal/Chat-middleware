import { Router } from 'express';
import express from 'express';
import request from 'supertest';
import { Startup } from '../../utils/setupFiles/startup';

describe('Health Routes', () => {
  let app: Router;
  const originalConsoleWarn = console.warn;

  beforeAll(() => {
    console.warn = (message: any) => {
      if (
        JSON.stringify(message).startsWith(
          `{"name":"Http404Error","statusCode":404}`
        )
      ) {
        return;
      }

      originalConsoleWarn(message);
    };
  });

  beforeEach(() => {
    app = express();
    Startup.ConfigureRouter(app);
  });

  test('should test validity of PING endpoint', async () => {
    const response: any = await request(app).get('/ping');
    expect(response.status).toEqual(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.result).toBe('success');
  });

  test('should test validity of invalid endpoint', async () => {
    const response: any = await request(app).get('/invalid');
    expect(response.status).toEqual(404);
    expect(response.text).toBe('Method not found.');
  });

  afterAll(() => {
    console.warn = originalConsoleWarn;
  });
});
