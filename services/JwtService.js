const request = require('request-promise');

class JwtService {

  constructor(credentials, oauthUrl) {
    this.credentials = credentials;
    this.oauthUrl = oauthUrl;
  }

  fetchJwt() {
    // two requests need to be made to the same URL to obtain a JWT
    // the second request to obtain the JWT contains parameters from the response of the init request
    const initReqOptions = {
      method: 'POST',
      uri: this.oauthUrl,
      body: {
        username: this.credentials.userId,
        client_id: this.credentials.clientId,
        password: this.credentials.password,
        connection: 'service-account',
        grant_type: 'password',
        scope: 'openid user_key'
      },
      json: true
    };

    const requestJwt = (initResponse) => {
      const jwtReqOptions = {
        method: 'POST',
        uri: this.oauthUrl,
        body: {
          scope: 'openid pib',
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          access_token: initResponse.access_token,
          connection: 'service-account',
          client_id: this.credentials.clientId,
          assertion: initResponse.id_token
        },
        json: true
      };

      return request(jwtReqOptions)
        .then((response) => {
          return `${response.token_type} ${response.access_token}`;
        });
    };

    return request(initReqOptions)
      .then((response) => {
        return requestJwt(response);
      })
      .catch((error) => {
        if (error.statusCode && (error.statusCode == 403 || error.statusCode == 401)) {
          throw new Error("Error: Unable to authenticate service account with given credentials:\n" +
            `\tUser ID: ${this.credentials.userId}\n` +
            `\tClient ID: ${this.credentials.clientId}\n` +
            `\tPassword: ${this.credentials.password}`);
        } else throw error;
      });
  }
}

module.exports = JwtService;
