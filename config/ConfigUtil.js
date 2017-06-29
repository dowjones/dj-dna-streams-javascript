const ConfigFileUtil = require('./ConfigFileUtil');

class ConfigUtil {

  constructor(accountId) {
    this.accountId = accountId;
    this.Constants = {
      SERVICE_ACCOUNT_ID: 'SERVICE_ACCOUNT_ID',
      SUBSCRIPTION_ID: 'SUBSCRIPTION_ID',
      CREDENTIALS_URI: 'CREDENTIALS_URI',
      DEFAULT_CREDENTIALS_URI: 'https://api.dowjones.com/alpha/accounts/streaming-credentials'
    };
  }

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
      credentialsUri = this.Constants.DEFAULT_CREDENTIALS_URI;
    }

    return credentialsUri;
  }
}

module.exports = ConfigUtil;
