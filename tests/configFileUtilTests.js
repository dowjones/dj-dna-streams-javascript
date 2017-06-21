/* eslint-disable import/no-extraneous-dependencies */
const sinon = require('sinon');
const ConfigFileUtil = require('../config/ConfigFileUtil');
const path = require('path');

describe('configUtil', () => {
  let sandbox;
  const pathConfig = path.join(__dirname, './config/testCustomerConfig.json');

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should get the correct customer service account ID.', () => {
    // Arrange

    const configFileUtil = new ConfigFileUtil();
    configFileUtil.setConfigFilePath(pathConfig);

    // Act
    const serviceAccountId = configFileUtil.getServiceAccountId();

    // Assert
    expect(serviceAccountId).toBe('foo');
  });

  it('should get the correct subscription IDs.', () => {
    // Arrange
    const configFileUtil = new ConfigFileUtil();
    configFileUtil.setConfigFilePath(pathConfig);

    // Act
    const subs = configFileUtil.getSubscriptionIds();

    // Assert
    expect(1).toBe(subs.length);
    expect(subs[0] = 'bar');
  });

  xit('should get the correct credentials URI.', () => {
    // Arrange
    const configFileUtil = new ConfigFileUtil();

    // Act
    const credentialsUri = configFileUtil.getCredentialsUri();

    // Assert
    // expect(expectedUri).toBe(credentialsUri);
  });
});
