const sinon = require('sinon');
const listener = require('../listener');
const configUtil = require('../config/configUtil');

describe('Given Listener object', () => {
  let sandbox;
  const expectedUserKey = 'cool-guy';

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    process.env.USER_KEY = expectedUserKey;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should use the expected sample user key', () => {
    expect(process.env.GCLOUD_PROJECT).not.toBeDefined();

    expect(configUtil.getUserKey()).toBe(expectedUserKey);
  });

  it('listening should succeed with default subscriptions.', () => {
    let subscribeCalls = 0;

    const pubSub = sandbox.stub(listener.gCloudProject, 'pubsub', () => {
      return {
        subscription: (name) => {
          subscribeCalls += 1;
          return {
            get: () => {
              return Promise.resolve([{
                on: (event, cb) => { return 'foo'; },
                removeListener: (event, cb) => { return true; },
              }]);
            },
          };
        },
      };
    });

    expect(listener).toBeDefined();

    // NOTE: 11-18-2016: fleschec: No need to provide a first argument 'onMessageCallback' since we are mocking
    // the test in such a way that no messages will ever be returned.
    listener.listen(null);

    expect(pubSub.calledOnce).toBe(true);
    expect(subscribeCalls).toBe(2);
  });

  it('listening should succeed with subscriptions input as args.', () => {
    let subscribeCalls = 0;
    const pubSub = sandbox.stub(listener.gCloudProject, 'pubsub', () => {
      return {
        subscription: (name) => {
          subscribeCalls += 1;
          return {
            get: () => {
              return Promise.resolve([{
                on: (event, cb) => { return 'foo'; },
                removeListener: (event, cb) => { return true; },
              }]);
            },
          };
        },
      };
    });

    const subscriptions = [
      {
        name: 'foo',
        topic: 'foo',
      },
      {
        name: 'bar',
        topic: 'bar',
      },
      {
        name: 'banana',
        topic: 'banana',
      },
    ];
    listener.listen(null, subscriptions);

    expect(pubSub.calledOnce).toBe(true);
    expect(subscribeCalls).toBe(3);
  });
});
