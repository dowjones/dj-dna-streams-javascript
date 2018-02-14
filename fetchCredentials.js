const request = require('request-promise');


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
        const credentials = result.data.attributes.streaming_credentials;

        return JSON.parse(credentials);
      })
      .catch((err) => {
        console.log(`Error: ${JSON.stringify(err)}`);
        return err;
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
    return fetchJwt(configUtil.Constants.OAUTH_URL, oauthCreds)
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
      throw new Error(
        "No account credentials specified\n" +
        "Must specify user_id, client_id, and password as args to Listener constructor, env vars, or via customerConfig.json file\n" +
        "See dj-dna-streaming-javascript README.md"
      );
    }
  }
}


const fetchJwt = (oauthUrl, creds) => {
  
  // two requests need to be made to the same URL to obtain a JWT
  // the second request to obtain the JWT contains parameters from the response of the init request
  const initReqOptions = {
    method: 'POST',
    uri: oauthUrl,
    body: {
      username: creds.userId,
      client_id: creds.clientId,
      password: creds.password,
      connection: 'service-account',
      grant_type: 'password',
      scope: 'openid service_account_id'
    },
    json: true
  };

  const requestJwt = (initResponse) => {
    const jwtReqOptions = {
      method: 'POST',
      uri: oauthUrl,
      body: {
        scope: 'openid pib',
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        access_token: initResponse.access_token,
        connection: 'service-account',
        client_id: creds.clientId,
        assertion: initResponse.id_token
      },
      json: true
    };

    return request(jwtReqOptions)
      .then((response) => {
        return response.token_type + ' ' + response.access_token;
      }).catch((error) => {
        console.log(error);
      });
  };

  return request(initReqOptions)
    .then((response) => {
      return requestJwt(response);
    })
}

module.exports = fetchCredentials;
