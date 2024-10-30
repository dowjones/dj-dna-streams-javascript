/* eslint-disable import/no-extraneous-dependencies */
const sinon = require('sinon');

const fetch = require('node-fetch');

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
      headers: {
        'user-key': 'bar'
      },
      json: true
    };

    const uri = 'http://localhost:8080/alpha/accounts/streaming-credentials';

    fetch(uri, options)
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
