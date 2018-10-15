const request = require('request-promise');
const JwtService = require('./JwtService');

class ExtractionApiService {

  constructor(host, credentials, oauthUrl) {
    this.host = host;
    this.credentials = credentials;
    this.oauthUrl = oauthUrl;
    this.UNINITIALIZED_MSG = 'Extraction API Service not yet initialized\n' +
      'Must call initialize(<HOST>, <ACCOUNT_CREDENTIALS>, <OAUTH_URL>) to set up authentication for extraction API requests before calling this method';
  }

  // the reason this is outside the constructor is that getting headers is async
  // want to keep async operations outside of constructor
  initialize() {
    if (this.headers && this.prefix) {
      // already initialized
      return Promise.resolve(true);
    } else if (this._isServiceAccountAuth(this.credentials)) {
      this._getServiceAccountHeaders(this.credentials, this.oauthUrl).then((headers) => {
        this.headers = headers;
        this.prefix = 'dna';
        return true;
      });
    } else if (this.credentials && this.credentials.user_key) {
      this.headers = { 'user-key': this.credentials.user_key };
      this.prefix = 'alpha';
      return Promise.resolve(true);
    } else {
      return Promise.reject(new Error(
        'Error: No account this.credentials specified\n' +
        'Must specify user_id, client_id, and password as args to Listener constructor, env vars, or via customerConfig.json file\n' +
        'See dj-dna-streaming-javascript README.md'
      ));
    }
  }

  _isInitialized() {
    return this.headers && this.host;
  }

  _isServiceAccountAuth(credentials) {
    return credentials && credentials.user_id && credentials.client_id && credentials.password;
  }

  _getServiceAccountHeaders(credentials, oauthUrl) {
    const jwtService = new JwtService(credentials, oauthUrl);
    return jwtService.fetchJwt().then((jwt) => {
      return {
        Authorization: jwt
      };
    });
  }

  getStreamingCredentials() {
    this.initialize().then(() => {
      const options = {
        method: 'GET',
        uri: `${this.host}/${this.prefix}/accounts/streaming-credentials`,
        headers: this.headers,
        json: false
      };

      // TODO: 06-21-2017: fleschec: Remove this when 3Scale fixes their cert problems with https://api.beta.dowjones.io/
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

      return request(options).then((response) => {
        const result = JSON.parse(response);
        if (!result.data || !result.data.attributes || !result.data.attributes.streaming_credentials) {
          throw new Error("Error: Unable to find streaming credentials for given account");
        }
        const credentials = result.data.attributes.streaming_credentials;

        return JSON.parse(credentials);
      });
    });
  }

  isStreamDisabled(subscriptionId) {
    this.initialize().then(() => {
      const disabledStatus = 'DOC_COUNT_EXCEEDED';
      const streamId = '-'.join(subscriptionId.split('-').slice(0,4));

      const options = {
        method: 'GET',
        uri: `${this.host}/${this.prefix}/streams/${streamId}`,
        headers: this.headers
      };

      return request(options).then((response) => {
        const result = JSON.parse(response);
        if (!result.data || !result.data.attributes || !result.data.attributes.job_status) {
          throw new Error("Error: Unable to find stream for given subscription ID");
        }
        return result.data.attributes.job_status === disabledStatus;
      });
    });
  }
}

module.exports = ExtractionApiService;
