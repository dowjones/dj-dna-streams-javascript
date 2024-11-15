const fetch = require('node-fetch');

class ApiService {

  constructor(host, credentials) {
    this.host = host;
    this.credentials = credentials;
  }

  // the reason this is outside the constructor is that getting headers is async
  // want to keep async operations outside of constructor
  _initialize() {
    if (this.headers && this.prefix) {
      // already initialized
      return Promise.resolve(true);
    } else if (this.credentials && this.credentials.user_key) {
      this.headers = { 'user-key': this.credentials.user_key };
      this.prefix = 'alpha';
      return Promise.resolve(true);
    } else {
      return Promise.reject(new Error(
        'Error: No account credentials specified\n' +
        'Must specify user_key as args to Listener constructor, env vars, or via customerConfig.json file\n' +
        'See dj-dna-streaming-javascript README.md'
      ));
    }
  }

  getStreamingCredentials() {
    return this._initialize().then(() => {
      const options = {
        method: 'GET',
        headers: this.headers,
        json: false
      };

      const uri = `${this.host}/${this.prefix}/accounts/streaming-credentials`;

      return fetch(uri, options).then(response => response.json()).then(result => {
        if (!result.data || !result.data.attributes || !result.data.attributes.streaming_credentials) {
          throw new Error('Error: Unable to find streaming credentials for given account');
        }
        const credentials = result.data.attributes.streaming_credentials;

        return JSON.parse(credentials);
      }).catch((error) => {
        console.error('Error retrieving streaming credentials\n');
        throw error;
      });
    });
  }

  getAccountInfo() {
    return this._initialize().then(() => {
      const accountId = this.headers.Authorization ? this.credentials.client_id : this.headers['user-key'];
      const options = {
        method: 'GET',
        headers: this.headers,
        json: false
      };

      const uri = `${this.host}/${this.prefix}/accounts/${accountId}`;

      return fetch(uri, options).then(response => response.json()).then(result => {
        if (!result.data || !result.data.attributes) {
          throw new Error('Error: Unable to find account info');
        }
        return result.data.attributes;
      }).catch((error) => {
        console.error('Error retrieving account info\n');
        throw error;
      });
    });
  }

  isStreamDisabled(subscriptionId) {
    return this._initialize().then(() => {
      const disabledStatus = 'DOC_COUNT_EXCEEDED';
      const streamId = this._extractStreamFromSub(subscriptionId);

      const options = {
        method: 'GET',
        headers: this.headers
      };

      const uri = `${this.host}/${this.prefix}/streams/${streamId}`;

      return fetch(uri, options).then(response => response.json()).then(result => {
        if (!result.data || !result.data.attributes || !result.data.attributes.job_status) {
          throw new Error('Error: Unable to find stream for given subscription ID');
        }
        return result.data.attributes.job_status === disabledStatus;
      }).catch((error) => {
        console.error('Error checking status of stream\n');
        throw error;
      });
    });
  }

  _extractStreamFromSub(subscriptionId) {
    const subIdComponents = subscriptionId.split('-');
    const streamIdEndIndex = subIdComponents.indexOf('filtered');
    return subIdComponents.slice(0, streamIdEndIndex).join('-');
  }
}

module.exports = ApiService;
