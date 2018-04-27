const sinon = require('sinon');
const Listener = require('../Listener');


describe('Given Listener object', () => {
  let sandbox;
  let subscribeCalls = 0;
  const expectedUserKey = 'Lemon';
  const pubSubStub =  {
      subscription: () => {
      subscribeCalls += 1;
        return {
            get: () => Promise.resolve([{
              on: (resultType, fn) => {}
            }])
        };
      }
  };




  const expectedSubId = 'bar';
  let getCredentialsStub = null;
  let getConfigUtilStub = null;
  const listener = new Listener(null, pubSubStub);

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    process.env.USER_KEY = expectedUserKey;

    getCredentialsStub = sandbox.stub(listener, 'getCredentials', () => {
      return Promise.resolve({
        project_id: 'foo'
      });
    });

    getConfigUtilStub = sandbox.stub(listener.configUtil, 'getSubscriptionId', function () {
      return expectedSubId;
    });
  });

  afterEach(function () {
    sandbox.restore();
    subscribeCalls = 0;
  });

  it('listening should succeed with default subscriptions.', (done) => {

    // Arrange
    expect(listener).toBeDefined();

    // NOTE: 11-18-2016: fleschec: No need to provide a first argument 'onMessageCallback' since we are mocking
    // the test in such a way that no messages will ever be returned.
    // Act

    const promise = listener.listen(null);

    // Assert
    promise.then(() => {
      expect(getConfigUtilStub.calledOnce).toBe(true);
      expect(getCredentialsStub.calledOnce).toBe(true);
      expect(subscribeCalls).toBe(1);
      done();
    });
  });

  it('listening should succeed with subscriptions input as args.', (done) => {
    const subscription = 'foo';
    const promise = listener.listen(null, subscription);

    promise.then((result) => {
      expect(result).toBe(true);
      expect(1).toBe(subscribeCalls);
      done();
    });
  });
});
