const request = require('request-promise');
const configUtil = require('./config/configUtil');

const credentialsFetcher = () => {

  const options = {
    method: 'GET',
    uri: configUtil.getCredentialsUri(),
    headers: {
      'user-key': configUtil.getServiceAccountId()
    },
    json: false
  };

  return request(options)
    .then((response) => {
      const result = JSON.parse(response);
      const credentials = result.data.attributes.streaming_credentials;

      return JSON.parse(credentials);
    })
    .catch((err) => {
      console.log(`Error: ${JSON.stringify(err)}`);
      return err;
    });
};

module.exports = credentialsFetcher;
