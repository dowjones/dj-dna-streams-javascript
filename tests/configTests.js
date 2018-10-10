/* eslint-disable import/no-extraneous-dependencies */
const sinon = require('sinon');
const Config = require('../config/config');
const path = require('path');

describe('config', () => {
  let sandbox;
  let config;
  const configFilePath = path.join(__dirname, './config/testCustomerConfig.json');

  beforeEach(() => {
    config = new Config();
    config.setConfigFilePath(configFilePath);
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should properly set credentials from config file if no overrides present', () => {
    // Arrange
    const expectedUserId = 'account@account.com';
    const expectedClientId = 'clientID123';
    const expectedPassword = 'Password123';

    // Act
    const accountCreds = config.getAccountCredentials();
    const actualUserId = accountCreds.user_id;
    const actualClientId = accountCreds.client_id;
    const actualPassword = accountCreds.password;

    // Assert
    expect(actualUserId).toBe(expectedUserId);
    expect(actualClientId).toBe(expectedClientId);
    expect(actualPassword).toBe(expectedPassword);
  });

  it('should prioritize user key from env over service account creds in config file', () => {
    // Arrange
    const expectedUserKey = '123A';
    process.env[config.Constants.USER_KEY_ENV] = expectedUserKey;

    // Act
    const creds = config.getAccountCredentials();
    const actualUserKey = creds.user_key;

    // Assert
    expect(actualUserKey).toBe(expectedUserKey);
  });

  it('should prioritize credentials set thru env vars over config file', () => {
    // Arrange
    const expectedUserId = 'userId';
    const expectedClientId = 'clientId';
    const expectedPassword = 'password';

    process.env[config.Constants.USER_ID_ENV] = expectedUserId;
    process.env[config.Constants.CLIENT_ID_ENV] = expectedClientId;
    process.env[config.Constants.PASSWORD_ENV] = expectedPassword;

    // Act
    const accountCreds = config.getAccountCredentials();
    const actualUserId = accountCreds.user_id;
    const actualClientId = accountCreds.client_id;
    const actualPassword = accountCreds.password;

    // Assert
    expect(actualUserId).toBe(expectedUserId);
    expect(actualClientId).toBe(expectedClientId);
    expect(actualPassword).toBe(expectedPassword);
  });

  it('should prioritize credentials set thru params over config file', () => {
    // Arrange
    const expectedUserId = 'userId';
    const expectedClientId = 'clientId';
    const expectedPassword = 'password';

    const configSpecial = new Config({
      user_id: expectedUserId,
      client_id: expectedClientId,
      password: expectedPassword
    });

    // Act
    const accountCreds = configSpecial.getAccountCredentials();
    const actualUserId = accountCreds.user_id;
    const actualClientId = accountCreds.client_id;
    const actualPassword = accountCreds.password;

    // Assert
    expect(actualUserId).toBe(expectedUserId);
    expect(actualClientId).toBe(expectedClientId);
    expect(actualPassword).toBe(expectedPassword);
  });

  it('should prioritize user key param over service account credentials in config file', () => {
    // Arrange
    const userKeyExpected = '123';
    const configSpecial = new Config({ user_key: userKeyExpected });

    // Act
    const accountCreds = configSpecial.getAccountCredentials();
    const userKeyActual = accountCreds.user_key;

    // Assert
    expect(userKeyExpected).toBe(userKeyActual);
    expect(accountCreds.user_id).toBe(undefined);
  });

  it('should get the correct subscription ID from config file if no overrides present.', () => {
    // Arrange
    const expectedSub = 'bar';

    // Act
    const sub = config.getSubscriptionId();

    // Assert
    expect(sub).toBe(expectedSub);
  });

  it('should get the correct subscription IDs from env.', () => {
    // Arrange
    const expectedSub = 'ABC';
    process.env[config.Constants.SUBSCRIPTION_ID_ENV] = expectedSub;

    // Act
    const sub = config.getSubscriptionId();

    // Assert
    expect(sub).toBe(expectedSub);
  });
});
