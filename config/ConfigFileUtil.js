const path = require('path');
const fs = require('fs');
const _ = require('lodash');

class ConfigFileUtil {

  constructor() {
    this.configFilePath = path.join(__dirname, '../customerConfig.json');
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

  getSubscriptionIds() {
    if (!this.initialized) {
      this.initialize();
    }
    return this.config.subscription_ids;
  }

  getServiceAccountId() {
    if (!this.initialized) {
      this.initialize();
    }

    const serviceAccountId = _.trim(this.config.service_account_id);
    this.validate(serviceAccountId);

    return serviceAccountId;
  }

  validate(serviceAccountId) {
    if (_.trim(serviceAccountId) === '' || !serviceAccountId) {
      throw new Error('Encountered error while trying to determine the service account ID. It is either blank or not set.');
    }
  }
}

module.exports = ConfigFileUtil;
