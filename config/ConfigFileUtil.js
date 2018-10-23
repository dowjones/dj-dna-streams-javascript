const fs = require('fs');
const _ = require('lodash');

class ConfigFileUtil {

  constructor(configFilePath) {
    this.configFilePath = configFilePath;
    this.initialized = false;
  }

  initialize() {
    try {
      fs.accessSync(this.configFilePath, fs.constants.F_OK);
    } catch (err) {
      throw new Error(`Encountered error trying to find filename and location '${this.configFilePath}'. A file with that name does not seem to exist at that location.`);
    }

    try {
      fs.accessSync(this.configFilePath, fs.constants.R_OK);
    } catch (err) {
      throw new Error(`Encountered a permission error when trying to read file '${this.configFilePath}'.`);
    }

    const configString = fs.readFileSync(this.configFilePath, 'utf8');

    this.config = JSON.parse(configString);

    this.initialized = true;
  }

  setConfigFilePath(configFilePath) {
    this.configFilePath = configFilePath;
    this.initialize();
  }

  getSubscriptionId() {
    if (!this.initialized) {
      this.initialize();
    }
    return this.config.subscription_id;
  }

  getAccountCredentials() {
    if (!this.initialized) {
      this.initialize();
    }

    return {
      user_key: _.trim(this.config.user_key),
      user_id: _.trim(this.config.user_id),
      client_id: _.trim(this.config.client_id),
      password: _.trim(this.config.password)
    };
  }
}

module.exports = ConfigFileUtil;
