const request = require('request-promise');

const fetchCredentials = (configUtil) => {

  const options = {
    method: 'GET',
    uri: configUtil.getCredentialsUri(),
    headers: {
      'user-key': configUtil.getServiceAccountId()
    },
    json: false
  };

  // TODO: 06-21-2017: fleschec: Remove this when 3Scale fixes their cert problems with https://api.beta.dowjones.io/
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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

module.exports = fetchCredentials;
