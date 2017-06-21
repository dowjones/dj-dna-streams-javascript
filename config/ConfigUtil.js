const ConfigFileUtil = require('./ConfigFileUtil');

class ConfigUtil {

  constructor(accountId) {
    this.accountId = accountId;
    this.Constants = {
      SERVICE_ACCOUNT_ID: 'SERVICE_ACCOUNT_ID',
      SUBSCRIPTION_IDS: 'SUBSCRIPTION_IDS',
      CREDENTIALS_URI: 'CREDENTIALS_URI',
      DEFAULT_CREDENTIALS_URI: 'https://api.beta.dowjones.io/alpha/accounts/streaming-credentials'
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

  getSubscriptions() {
    let subscriptionIds = null;
    if (process.env[this.Constants.SUBSCRIPTION_IDS]) {
      const subIdsRaw = process.env[this.Constants.SUBSCRIPTION_IDS];

      const subIds = subIdsRaw.split(',');
      subscriptionIds = JSON.parse(`["${subIds.join('","')}"]`);
    } else {
      subscriptionIds = this.getConfigFileUtil().getSubscriptionIds();
    }

    return subscriptionIds;
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
