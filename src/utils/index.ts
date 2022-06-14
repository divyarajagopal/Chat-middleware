import { Router } from 'express';
import { Wrapper, Route } from './types';
import { logger } from './logger';

export * from './logger';
export * from './converter';

export const ApplyMiddleware = (
  router: Router,
  ...middlewareWrappers: Wrapper[]
) => {
  for (const wrapper of middlewareWrappers) {
    if (wrapper.name) {
      logger.debug(`Applying the middleware : ${wrapper.name}`);
    }
    wrapper(router);
  }
};

export const ApplyRoutes = (router: Router, ...routes: Route[]) => {
  for (const route of routes) {
    logger.debug(`Applying the route : ${route.path}`);
    const { method, path, handler } = route;
    (router as any)[method](path, handler);
  }
};
