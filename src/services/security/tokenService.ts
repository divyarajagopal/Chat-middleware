export abstract class TokenService {
  public static GetTokenValue = (key: string, sessionToken: string) => {
    key = key + '=';
    const decodeCookie = decodeURIComponent(sessionToken);
    const split_cookie = decodeCookie.split(';');
    let tokenValue = '';
    split_cookie.forEach(function(value) {
      while (value.charAt(0) === ' ') {
        value = value.substring(1);
      }
      if (value.indexOf(key) === 0) {
        tokenValue = value.substring(key.length, value.length);
      }
    });
    return tokenValue;
  };

  public static CreateSessionToken(
    key: string,
    tokenValue: string,
    issuedAt?: string
  ) {
    return `${key}=${tokenValue};issued_at=${issuedAt};path=/`;
  }
}
