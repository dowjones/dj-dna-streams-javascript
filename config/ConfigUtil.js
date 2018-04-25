const ConfigFileUtil = require(
  './ConfigFileUtil');

class ConfigUtil {

  constructor(credentials) {
    /* Going forward, credentials should be an object containing the needful 
     * fields to authenticate a client's service account via the new authentication flow.
     * However, to avoid breaking the previous auth flow, we are, for the time being, 
     * allowing credentials to be a string containing the service account ID.
     */
    if (typeof credentials === 'string') {
      this.accountId = credentials; 
    } else if (credentials && credentials.userId && credentials.clientId && credentials.password) {
      this.accountCreds = credentials;
    } 
    
    this.Constants = {
      OAUTH_URL: 'https://accounts.dowjones.com/oauth2/v1/token',
      USER_ID: 'USER_ID',
      CLIENT_ID: 'CLIENT_ID',
      PASSWORD: 'PASSWORD',
      SERVICE_ACCOUNT_ID: 'SERVICE_ACCOUNT_ID',
      SUBSCRIPTION_ID: 'SUBSCRIPTION_ID',
      CREDENTIALS_URI: 'CREDENTIALS_URI',
      DEFAULT_CREDENTIALS_URI_API_KEY_AUTH: 'https://api.dowjones.com/alpha/accounts/streaming-credentials',
      DEFAULT_CREDENTIALS_URI_CLIENT_AUTH: 'https://api.dowjones.com/dna/accounts/streaming-credentials'
    };
  }


  // depricated: going forward clients should instead use getAccountCredentials
  getServiceAccountId() {
    if (this.accountId) {
      return this.accountId;
    }

    if (process.env[this.Constants.SERVICE_ACCOUNT_ID]) {
      this.accountId = process.env[this.Constants.SERVICE_ACCOUNT_ID];
    } else {
      this.accountId = this.getConfigFileUtil().getServiceAccountId();
    }

    return this.accountId;
  }

  getAccountCredentials() {
    if (!this.accountCreds) {
      if (
        process.env[this.Constants.USER_ID] && 
        process.env[this.Constants.CLIENT_ID] &&
        process.env[this.Constants.PASSWORD]
      ) {
        this.accountCreds = {
          userId: process.env[this.Constants.USER_ID],
          clientId: process.env[this.Constants.CLIENT_ID],
          password: process.env[this.Constants.PASSWORD]
        };
      } else {
        this.accountCreds = this.getConfigFileUtil().getAccountCredentials();
      }
    }

    return this.accountCreds;
  }

  getConfigFileUtil() {
    if (!this.configFileUtil) {
      this.configFileUtil = new ConfigFileUtil();
    }

    return this.configFileUtil;
  }

  getSubscriptionId() {
    let subscriptionId = null;
    if (process.env[this.Constants.SUBSCRIPTION_ID]) {
      subscriptionId = process.env[this.Constants.SUBSCRIPTION_ID];
    } else {
      subscriptionId = this.getConfigFileUtil().getSubscriptionId();
    }

    return subscriptionId;
  }

  getCredentialsUri() {
    let credentialsUri = null;
    if (process.env[this.Constants.CREDENTIALS_URI]) {
      credentialsUri = process.env[this.Constants.CREDENTIALS_URI];
    } else {
      credentialsUri = this.accountId ?
          this.Constants.DEFAULT_CREDENTIALS_URI_API_KEY_AUTH :
          this.Constants.DEFAULT_CREDENTIALS_URI_CLIENT_AUTH;
    }

    return credentialsUri;
  }
}

module.exports = ConfigUtil;
