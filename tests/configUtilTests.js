/* eslint-disable import/no-extraneous-dependencies */
const sinon = require('sinon');
const ConfigUtil = require('../config/ConfigUtil');

describe('configUtil', () => {
  let sandbox;
  const configUtil = new ConfigUtil();

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
    process.env[configUtil.Constants.SUBSCRIPTION_ID] = 'ABC';

    // Act
    const sub = configUtil.getSubscriptionId();

    // Assert
    expect(sub).toBe('ABC');
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

  it('should use the passed account ID.', () => {
    // Arrange
    // Act
    const configUtilSpecial = new ConfigUtil('123');

    // Assert
    expect('123').toBe(configUtilSpecial.getServiceAccountId());
  });
});
