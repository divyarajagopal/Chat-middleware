import { TokenService } from './tokenService';
import { PostRefreshToken } from '../graphql/vaData.service';
import { SecurityConstants } from '../../constants/security';
import { logger } from '../../utils';

export abstract class AuthService {
  public static AccessToken?: string;
  public static IssuedAt?: string;
  // This function check if user's authorization token has expired
  public static CheckIfTokenHasExpired = (sessionToken: string) => {
    logger.debug(
      `Checking whether session token has expired or not: ${sessionToken}`
    );
    // Get the number of seconds the token will expire
    const thirtyMinuteInseconds = 30 * 60;
    // get the cookie token. The cookie named token stores a value of when-in milliseconds,  the token was issued
    const issuedAt = TokenService.GetTokenValue(
      SecurityConstants.ISSUED_AT,
      sessionToken
    );
    // get the current time in milliseconds
    const currentTime = new Date().getTime();
    // get the time elapsed between when the token was first issed and the current time
    const timeElasped = currentTime - parseInt(issuedAt, 10);
    // convert the elasped time from milliseconds to seconds
    const timeElaspedInSeconds = timeElasped / 1000;
    // check if the numbers of seconds elapsed, is greater than 30minutes
    const expired = timeElaspedInSeconds >= thirtyMinuteInseconds;
    if (expired) {
      logger.debug(`Session token has expired!!!`);
    }
    return expired ? true : false;
  };

  public static FetchAndResetRefreshToken = async () => {
    const tokenResponse = await PostRefreshToken();
    AuthService.AccessToken =
      tokenResponse && tokenResponse[SecurityConstants.ACCESS_TOKEN];
    AuthService.IssuedAt =
      tokenResponse && tokenResponse[SecurityConstants.ISSUED_AT];
  };
}
