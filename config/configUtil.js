const fs = require('fs');

class ConfigUtil {

  constructor() {
    const credentialsPath = process.env.DOW_JONES_APPLICATION_CREDENTIALS;

    if (!credentialsPath) {
      throw new Error('Encountered problem getting environment variable \'DOW_JONES_APPLICATION_CREDENTIALS\'. Is it set?');
    }

    try {
      fs.accessSync(credentialsPath, fs.constants.F_OK);
    } catch (err) {
      throw new Error(`Encountered error trying to find filename and location '${credentialsPath}'. A file with that name does not seem to exist at that location.`);
    }

    try {
      fs.accessSync(credentialsPath, fs.constants.R_OK);
    } catch (err) {
      throw new Error(`Encountered a permission error when trying to read file '${credentialsPath}'.`);
    }

    const credentialsJson = fs.readFileSync(credentialsPath, 'utf8');
    this.credentials = JSON.parse(credentialsJson);
  }

  getUserKey() {
    return this.credentials.dj_dna_streaming.user_key;
  }

  getProjectName() {
    const projectName = this.credentials.dj_dna_streaming.project_name;
    return projectName || 'djsyndicationhub-prod';
  }

  getSubscriptions() {
    return this.credentials.dj_dna_streaming.subscriptions;
  }
}

module.exports = new ConfigUtil();
