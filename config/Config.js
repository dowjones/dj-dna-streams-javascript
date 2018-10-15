const ConfigFileUtil = require('./ConfigFileUtil');
const path = require('path');

class Config {

  constructor(credentials) {
    this.credentials = credentials;

    this.Constants = {
      OAUTH_URL_ENV: 'OAUTH_URL',
      OAUTH_URL_DEFAULT: 'https://accounts.dowjones.com/oauth2/v1/token',
      USER_ID_ENV: 'USER_ID',
      CLIENT_ID_ENV: 'CLIENT_ID',
      PASSWORD_ENV: 'PASSWORD',
      USER_KEY_ENV: 'USER_KEY',
      SUBSCRIPTION_ID_ENV: 'SUBSCRIPTION_ID',
      EXTRACTION_API_HOST_ENV: 'EXTRACTION_API_HOST_ENV',
      EXTRACTION_API_HOST_DEFAULT: 'https://api.dowjones.com',
      CONFIG_FILE_PATH_DEFAULT: path.join(__dirname, '../customerConfig.json')
    };

    this._configFileUtil = new ConfigFileUtil(this.Constants.CONFIG_FILE_PATH_DEFAULT);
  }

  // needed to use a separate config file for testing
  setConfigFilePath(configFilePath) {
    this._configFileUtil = new ConfigFileUtil(configFilePath);
  }

  getExtractionApiHost() {
    const extractionApiHost = process.env[this.Constants.EXTRACTION_API_HOST_ENV];
    return extractionApiHost || this.Constants.EXTRACTION_API_HOST_DEFAULT;
  }

  getOauthUrl() {
    const oauthUrl = process.env[this.Constants.OAUTH_URL_ENV];
    return oauthUrl || this.Constants.OAUTH_URL_DEFAULT;
  }

  getSubscriptionId() {
    const subscriptionId = process.env[this.Constants.SUBSCRIPTION_ID_ENV];
    return subscriptionId || this._configFileUtil.getSubscriptionId();
  }

  getAccountCredentials() {
    // first get credentials from parameters if they're defined there
    let accountCreds = this.credentials;

    // if creds not passed in as params check env vars for credentials
    if (!this._areCredsSet(accountCreds)) {
      accountCreds = this._initCredsFromEnv();

      // finally check config file for credentials
      if (!this._areCredsSet(accountCreds)) {
        accountCreds = this._configFileUtil.getAccountCredentials();
      }
    }

    return this._areCredsSet(accountCreds) ? accountCreds : new Error(
      'Error: No account credentials specified\n' +
      'Must specify user_id, client_id, and password as args to Listener constructor, env vars, or via customerConfig.json file\n' +
      'See dj-dna-streaming-javascript README.md'
    );
  }

  _initCredsFromEnv() {
    return {
      user_id: process.env[this.Constants.USER_ID_ENV],
      client_id: process.env[this.Constants.CLIENT_ID_ENV],
      password: process.env[this.Constants.PASSWORD_ENV],
      user_key: process.env[this.Constants.USER_KEY_ENV]
    };
  }

  _areCredsSet(accountCreds) {
    return accountCreds && (accountCreds.user_key || (accountCreds.user_id && accountCreds.client_id && accountCreds.password));
  }
}

module.exports = Config;
