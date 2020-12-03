const sinon = require('sinon');
const ApiService = require('../services/ApiService');

describe('API service', () => {
  let sandbox;
  let getServiceAccountHeadersStub;
  const apiService = new ApiService();
  const serviceAccountHeaders = { Authorization: 'Bearer jwt' };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    getServiceAccountHeadersStub = sandbox.stub(apiService, '_getServiceAccountHeaders', () => {
      return Promise.resolve(serviceAccountHeaders);
    });
  });

  afterEach(() => {
    sandbox.restore();
    apiService.headers = null;
    apiService.prefix = null;
  });

  it('should initialize correctly given service account credentials', () => {
    // Arrange
    apiService.credentials = {
      user_id: 'user_id',
      client_id: 'client_id',
      password: 'password'
    };

    // Act
    apiService._initialize().then(() => {

      // Assert
      expect(getServiceAccountHeadersStub.calledOnce).toBe(true);
      expect(apiService.headers).toEqual(serviceAccountHeaders);
      expect(apiService.prefix).toBe('dna');
    });
  });

  it('should initialize correctly given user key credentials', () => {
    // Arrange
    const headersExpected = { 'user-key': 'test_user_key' };
    apiService.credentials = { user_key: 'test_user_key' };

    // Act
    apiService._initialize().then(() => {

      // Assert
      expect(apiService.headers.user_key).toEqual(headersExpected.user_key);
      expect(apiService.prefix).toBe('alpha');
    });
  });

  it('should correctly extract stream ID from subscription ID', () => {
    // Arrange
    const subIdA = 'dj-dna-streams-account-streamA-filtered-foo';
    const subIdB = 'dj-dna-qos-streamB-filtered-bar';
    const expectedStreamIdA = 'dj-dna-streams-account-streamA';
    const expectedStreamIdB = 'dj-dna-qos-streamB';

    // Act
    const actualStreamIdA = apiService._extractStreamFromSub(subIdA);
    const actualStreamIdB = apiService._extractStreamFromSub(subIdB);

    // Assert
    expect(actualStreamIdA).toBe(expectedStreamIdA);
    expect(actualStreamIdB).toBe(expectedStreamIdB);
  });
});
