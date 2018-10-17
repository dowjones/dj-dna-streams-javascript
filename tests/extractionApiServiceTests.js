const sinon = require('sinon');
const ExtractionApiService = require('../services/ExtractionApiService');

describe('extraction API service', () => {
  let sandbox;
  let getServiceAccountHeadersStub;
  const extractionApiService = new ExtractionApiService();
  const serviceAccountHeaders = { Authorization: 'Bearer jwt' };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    getServiceAccountHeadersStub = sandbox.stub(extractionApiService, '_getServiceAccountHeaders', () => {
      return Promise.resolve(serviceAccountHeaders);
    });
  });

  afterEach(() => {
    sandbox.restore();
    extractionApiService.headers = null;
    extractionApiService.prefix = null;
  });

  it('should initialize correctly given service account credentials', () => {
    // Arrange
    extractionApiService.credentials = {
      user_id: 'user_id',
      client_id: 'client_id',
      password: 'password'
    };

    // Act
    extractionApiService._initialize().then(() => {

      // Assert
      expect(getServiceAccountHeadersStub.calledOnce).toBe(true);
      expect(extractionApiService.headers).toEqual(serviceAccountHeaders);
      expect(extractionApiService.prefix).toBe('dna');
    });
  });

  it('should initialize correctly given user key credentials', () => {
    // Arrange
    const headersExpected = { 'user-key': 'test_user_key' };
    extractionApiService.credentials = { user_key: 'test_user_key' };

    // Act
    extractionApiService._initialize().then(() => {

      // Assert
      expect(extractionApiService.headers.user_key).toEqual(headersExpected.user_key);
      expect(extractionApiService.prefix).toBe('alpha');
    });
  });

  it('should correctly extract stream ID from subscription ID', () => {
    // Arrange
    const subIdA = 'dj-dna-streams-account-streamA-filtered-foo';
    const subIdB = 'dj-dna-qos-streamB-filtered-bar';
    const expectedStreamIdA = 'dj-dna-streams-account-streamA';
    const expectedStreamIdB = 'dj-dna-qos-streamB';

    // Act
    const actualStreamIdA = extractionApiService._extractStreamFromSub(subIdA);
    const actualStreamIdB = extractionApiService._extractStreamFromSub(subIdB);

    // Assert
    expect(actualStreamIdA).toBe(expectedStreamIdA);
    expect(actualStreamIdB).toBe(expectedStreamIdB);
  });
});
