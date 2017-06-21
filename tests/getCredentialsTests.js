/* eslint-disable import/no-extraneous-dependencies */
const sinon = require('sinon');

const request = require('request-promise');

describe('getCredentials', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('foo.', function (done) {
    const options = {
      method: 'GET',
      uri: 'http://localhost:8080/alpha/accounts/streaming-credentials',
      headers: {
        'user-key': '0e314c38802b8ae800bcebed7bace8f9'
      },
      json: true
    };

    request(options)
      .then(() => {
        done();
        // Request was successful, use the response object at will
      })
      .catch((err) => {
        console.log(`Error: ${JSON.stringify(err)}`);
        done();
      });
  }, 12000);
});
