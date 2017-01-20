const sinon = require('sinon');
const subscriber = require('../subscriber');
const configUtil = require('../config/configUtil');

describe('Given Subscriber object', () => {
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

  it('subscribing should succeed.', () => {
    let subscribeCalls = 0;

    const pubSub = sandbox.stub(subscriber.gCloudProject, 'pubsub', () => {
      return {
        subscribe: (topic, name, options) => {
          subscribeCalls += 1;

          expect(name.startsWith(topic)).toBe(true);
          expect(name.endsWith(expectedUserKey)).toBe(true);
          expect(options.reuseExisting).toBe(true);
          expect(options.autoAck).toBe(true);
          expect(options.interval).toBe(10);
          expect(options.maxInProgress).toBe(100);
          expect(options.timeout).toBe(20000);
        },
      };
    });

    expect(subscriber).toBeDefined();

    // NOTE: 11-18-2016: fleschec: No need to provide a first argument 'onMessageCallback' since we are mocking
    // the test in such a way that no messages will ever be returned.
    subscriber.subscribe(null);

    expect(pubSub.calledOnce).toBe(true);
    expect(subscribeCalls).toBe(2);
  });

  it('and no topic is provided subscribing should use the default topic.', () => {
    let subscribeCalls = 0;
    const pubSub = sandbox.stub(subscriber.gCloudProject, 'pubsub', () => {
      return {
        subscribe: (topic, name, options) => {
          subscribeCalls += 1;
        },
      };
    });

    const topics = ['foo', 'bar', 'banana'];
    subscriber.subscribe(null, topics);

    expect(pubSub.calledOnce).toBe(true);
    expect(subscribeCalls).toBe(3);
  });
});
