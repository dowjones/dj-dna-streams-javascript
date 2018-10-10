/* eslint-disable import/no-extraneous-dependencies */
const sinon = require('sinon');
const ConfigFileUtil = require('../config/ConfigFileUtil');
const path = require('path');

describe('configFileUtil', () => {
  let sandbox;
  const pathConfig = path.join(__dirname, './config/testCustomerConfig.json');

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get the correct customer user key.', () => {
    // Arrange
    const configFileUtil = new ConfigFileUtil();
    configFileUtil.setConfigFilePath(pathConfig);

    // Act
    const creds = configFileUtil.getAccountCredentials();
    const userKey = creds.user_key;

    // Assert
    expect(userKey).toBe('foo');
  });

  it('should get the correct customer service account credentials.', () => {
    // Arrange
    const configFileUtil = new ConfigFileUtil();
    configFileUtil.setConfigFilePath(pathConfig);

    const expectedUserId = 'account@account.com';
    const expectedClientId = 'clientID123';
    const expectedPassword = 'Password123';

    // Act
    const accountCreds = configFileUtil.getAccountCredentials();
    const actualUserId = accountCreds.user_id;
    const actualClientId = accountCreds.client_id;
    const actualPassword = accountCreds.password;

    // Assert
    expect(actualUserId).toBe(expectedUserId);
    expect(actualClientId).toBe(expectedClientId);
    expect(actualPassword).toBe(expectedPassword);
  });

  it('should get the correct subscription ID.', () => {
    // Arrange
    const configFileUtil = new ConfigFileUtil();
    configFileUtil.setConfigFilePath(pathConfig);

    // Act
    const sub = configFileUtil.getSubscriptionId();

    // Assert
    expect(sub).toBe('bar');
  });
});
