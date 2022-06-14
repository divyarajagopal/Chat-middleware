import { Router } from 'express';
import { ApplyMiddleware, ApplyRoutes } from '..';
import routes from '../../services/health/routes';
import errorHandlers from '../../middleware/errorHandlers';
import graphqlHandler from '../../middleware/graphqlHandler';
import commonHandlers from '../../middleware';

export abstract class Startup {
  public static ConfigureRouter(router: Router) {
    // Register HTTP request pipeline here
    ApplyMiddleware(router, ...commonHandlers);
    ApplyMiddleware(router, graphqlHandler);
    ApplyRoutes(router, ...routes);
    ApplyMiddleware(router, ...errorHandlers);
  }
}
