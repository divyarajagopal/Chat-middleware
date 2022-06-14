import { Router } from 'express';
import cors, { CorsOptions } from 'cors';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { logger } from '../utils';
import session from 'express-session';
import { AuthService } from '../services/security/authService';
import { TokenService } from '../services/security/tokenService';
import { SecurityConstants } from '../constants/security';

export const HandleCors = (router: Router) => {
  const corsOptions: CorsOptions = {
    credentials: true,
    origin: true
  };
  logger.debug(`Applying the middleware : cors`);
  router.use(cors(corsOptions));
};

export const HandleCompression = (router: Router) => {
  logger.debug(`Applying the middleware : compression`);
  router.use(compression());
};

export const HandleAPIDocs = (router: Router) => {
  if (process.env.SWAGGER === 'ON') {
    logger.debug(`Applying the middleware : swagger-ui-express`);
    const swaggerDocument = require('../config/swagger.json');
    router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
};

export const HandleSession = async (router: Router) => {
  logger.debug(`Applying the middleware : express-session`);
  router.use(
    session({
      secret: SecurityConstants.SESSION_SECRET,
      resave: false,
      saveUninitialized: true
    })
  );

  const setSessionToken = async (req: any) => {
    await AuthService.FetchAndResetRefreshToken();
    if (AuthService.AccessToken) {
      req.session.token = TokenService.CreateSessionToken(
        SecurityConstants.SESSION_TOKEN_KEY,
        AuthService.AccessToken,
        AuthService.IssuedAt
      );
    }
  };

  router.use(async (req, res, next) => {
    if (req.session) {
      if (
        !req.session.token ||
        AuthService.CheckIfTokenHasExpired(req.session.token)
      ) {
        logger.debug(`Setting the session access token`);
        await setSessionToken(req);
      }
    }

    next();
  });
};
