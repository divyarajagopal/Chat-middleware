import { Router } from 'express';
import express from 'express';
import request from 'supertest';
import { Startup } from '../utils/setupFiles/startup';

describe('GraphQL Routes', () => {
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

  test('should test validity of GraphQL basic question endpoint', async done => {
    request(app)
      .post('/graphql')
      .send({
        query: `{
            question(text: "what is vpn")
            {
              id
              text
              answers {
                id
                text
                webSearchUrl
              }
            }
          }`,
        variables: null
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        expect(res.body.data).toBeTruthy();
        expect(res.body.data.question).toBeTruthy();
        expect(res.body.data.question.text).toBe('what is vpn');
        expect(res.body.data.question.id).toBeTruthy();

        expect(res.body.data.question.answers).toBeTruthy();
        expect(res.body.data.question.answers.length).toBeGreaterThan(0);
        expect(res.body.data.question.answers[0].id).toBeTruthy();
        expect(res.body.data.question.answers[0].webSearchUrl).toBe('');
        expect(
          (res.body.data.question.answers[0].text as string).trim()
        ).toContain('A virtual private network (VPN) extends');
        done();
      });
  }, 30000);

  test('should test validity of GraphQL decision tree endpoint', async done => {
    request(app)
      .post('/graphql')
      .send({
        query: `{
            question(text: "Your answer didn't match my question", answerID: "385", connectorID: "453")
            {
              id
              text
              connectorQuestion
              answers {
                id
                answerID
                text
                webSearchUrl
              }
              connectors {
                connectorID
                defaultClickText
                displayRank
              }
            }
          }`,
        variables: null
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        done();
      });
  }, 30000);

  afterAll(() => {
    console.warn = originalConsoleWarn;
  });
});
