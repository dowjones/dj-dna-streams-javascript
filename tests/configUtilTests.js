/* eslint-disable import/no-extraneous-dependencies */
const sinon = require('sinon');
const configUtil = require('../config/configUtil');

describe('configUtil', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get the correct customer service account ID.', () => {
    // Arrange
    process.env[configUtil.Constants.SERVICE_ACCOUNT_ID] = '123A';

    // Act
    const serviceAccountId = configUtil.getServiceAccountId();

    // Assert
    expect(serviceAccountId).toBe('123A');
  });

  it('should get the correct subscription IDs.', () => {
    // Arrange
    process.env[configUtil.Constants.SUBSCRIPTION_IDS] = 'ABC, DEF';

    // Act
    const subs = configUtil.getSubscriptions();

    // Assert
    expect(2).toBe(subs.length);
    expect(subs[0] = 'ABC');
    expect(subs[1] = 'DEF');
  });

  it('should get the correct credentials URI.', () => {
    // Arrange
    const expectedUri = 'http://piglovesslop.com';
    process.env[configUtil.Constants.CREDENTIALS_URI] = expectedUri;

    // Act
    const credentialsUri = configUtil.getCredentialsUri();

    // Assert
    expect(expectedUri).toBe(credentialsUri);
  });
});
