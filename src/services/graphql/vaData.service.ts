import request, { RequestPromiseOptions } from 'request-promise';
import { AuthService } from '../security/authService';
import { Headers } from 'request';

const {
  VIRTUAL_AGENT_B2C_SERVER_BASE_URL = `https://test-va-demo-app.azurewebsites.net`,
  VIRTUAL_AGENT_SERVER_BASE_URL = `https://caelum-t-apimng.uk-1.paas.cloud.global.fujitsu.com:10443`
} = process.env;

function getRequestHeaders() {
  let headers: Headers = {};
  if (AuthService.AccessToken) {
    headers = {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${AuthService.AccessToken}`,
      Cookie: `translationSetting=No Translation; lang=en_EN;`
    };
  }

  return headers;
}

export const PostRefreshToken = async () => {
  const url = `${VIRTUAL_AGENT_B2C_SERVER_BASE_URL}/token`;
  const options: RequestPromiseOptions = {
    method: 'POST'
  };
  try {
    const response = await request(url, options);
    return JSON.parse(JSON.parse(response)); // We need to parse twice to get hold of the object
  } catch (error) {
    throw new Error(error);
  }
};

export const PostIntentForTheQuestion = async (question: string) => {
  const url = `${VIRTUAL_AGENT_B2C_SERVER_BASE_URL}/intent`;
  const requestHeaders: Headers = getRequestHeaders();
  const options: RequestPromiseOptions = {
    method: 'POST',
    body: `q=${question}`,
    headers: requestHeaders
  };
  try {
    const response = await request(url, options);
    return JSON.parse(response);
  } catch (error) {
    throw new Error(error);
  }
};

export const PostSearchResults = async (intent: {
  q: string;
  site: string;
}) => {
  const url = `${VIRTUAL_AGENT_B2C_SERVER_BASE_URL}/search`;
  const requestHeaders: Headers = getRequestHeaders();
  const options: RequestPromiseOptions = {
    method: 'POST',
    body: `q=${intent.q}&site=${intent.site}`,
    headers: requestHeaders
  };
  try {
    const response = await request(url, options);
    return JSON.parse(response);
  } catch (error) {
    throw new Error(error);
  }
};

export const PostVirtualAgentResults = async (
  question: string,
  answerID?: string,
  connectorID?: string
) => {
  const url = `${VIRTUAL_AGENT_SERVER_BASE_URL}/v1/sccva-translation-options-route`;
  const requestHeaders: Headers = getRequestHeaders();
  let jftdbodyData = `ident=2642611296297913668488&entry=${question}`;
  jftdbodyData = answerID
    ? `${jftdbodyData}&DTreeRequest=${question}&connector_ID=${connectorID}&DTREE_NODE_ID=&DTREE_OBJECT_ID=&ICS_SOURCE_ANSWER_ID=${answerID}"`
    : jftdbodyData;
  const bodyData =
    'vaCustomData=' +
    JSON.stringify({
      clientLanguage: 'en_GB',
      language: 'en',
      email: `user@test.com`,
      preferredName: `John Smith`
    }) +
    '&' +
    jftdbodyData;

  const options: RequestPromiseOptions = {
    method: 'POST',
    body: bodyData,
    headers: requestHeaders
  };
  try {
    const response = await request(url, options);
    return JSON.parse(response);
  } catch (error) {
    throw new Error(error);
  }
};
