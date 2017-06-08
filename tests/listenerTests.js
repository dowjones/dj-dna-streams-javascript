const sinon = require('sinon');
const listener = require('../listener');

describe('Given Listener object', () => {
  let sandbox;
  const expectedUserKey = 'Lemon';
  let pubSub;
  let subscribeCalls = 0;
  const expectedSubIds = ['bar', 'banana'];
  let getCredentialsStub = null;
  let getConfigUtilStub = null;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    process.env.USER_KEY = expectedUserKey;

    getCredentialsStub = sandbox.stub(listener, 'getCredentials', () => {
      return Promise.resolve({
        project_id: 'foo'
      });
    });

    pubSub = sandbox.stub(listener, 'getPubSubClient', function () {
      return {
        subscription: () => {
          console.log('Called sub');
          subscribeCalls += 1;
          return {
            get: () => Promise.resolve([{
              on: (resultType, fn) => {
              }
            }])
          };
        }
      };
    });

    getConfigUtilStub = sandbox.stub(listener, 'getConfigUtil', function () {
      return {
        getSubscriptions: () => {
          return expectedSubIds;
        }
      };
    });
  });

  afterEach(function () {
    sandbox.restore();
    subscribeCalls = 0;
  });

  it('listening should succeed with default subscriptions.', (done) => {
    expect(listener).toBeDefined();

    // NOTE: 11-18-2016: fleschec: No need to provide a first argument 'onMessageCallback' since we are mocking
    // the test in such a way that no messages will ever be returned.
    const promise = listener.listen(null);

    promise.then(() => {
      expect(getConfigUtilStub.calledOnce).toBe(true);
      expect(getCredentialsStub.calledOnce).toBe(true);
      expect(pubSub.calledOnce).toBe(true);
      expect(expectedSubIds.length).toBe(subscribeCalls);
      done();
    });
  });

  it('listening should succeed with subscriptions input as args.', (done) => {
    const subscriptions = ['foo', 'bar', 'banana', 'dragonFruit'];
    const promise = listener.listen(null, subscriptions);

    promise.then((result) => {
      expect(result).toBe(true);
      expect(pubSub.calledOnce).toBe(true);
      expect(subscriptions.length).toBe(subscribeCalls);
      done();
    });
  });
});
