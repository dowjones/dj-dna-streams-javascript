const request = require('request-promise');
const JwtService = require('./JwtService');

const fetchCredentials = (configUtil) => {

  const requestCredentials = (headers) => {
    const options = {
      method: 'GET',
      uri: configUtil.getCredentialsUri(),
      headers: headers,
      json: false
    };

    // TODO: 06-21-2017: fleschec: Remove this when 3Scale fixes their cert problems with https://api.beta.dowjones.io/
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    return request(options)
      .then((response) => {
        const result = JSON.parse(response);
        if (!result.data.attributes || !result.data.attributes.streaming_credentials) {
          throw new Error("Error: Unable to find streaming credentials for given account");
        }
        const credentials = result.data.attributes.streaming_credentials;

        return JSON.parse(credentials);
      });
  };

  return getAuthHeaders(configUtil)
    .then((headers) => {
      return requestCredentials(headers);
    });
};


const getAuthHeaders = (configUtil) => {
  const oauthCreds = configUtil.getAccountCredentials();

  if (oauthCreds) {
    const jwtService = new JwtService(oauthCreds, configUtil.Constants.OAUTH_URL);
    return jwtService.fetchJwt()
      .then((jwt) => {
        return {
          'Authorization': jwt
        };
      });
  }

  else {
    // missing oauth creds, authenticate the old way via account ID
    const accountId = configUtil.getServiceAccountId();

    if (accountId) {
      return Promise.resolve({
        'user-key': accountId
      });
    }

    else {
      // missing oauth creds and account ID, throw error
      return Promise.reject(new Error(
        "Error: No account credentials specified\n" +
        "Must specify user_id, client_id, and password as args to Listener constructor, env vars, or via customerConfig.json file\n" +
        "See dj-dna-streaming-javascript README.md"
      ));
    }
  }
}

module.exports = fetchCredentials;
