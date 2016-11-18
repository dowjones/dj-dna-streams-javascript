const sinon = require('sinon');
const subscriber = require('../subscriber');

describe('Given Subscriber object', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('subscribing should succeed.', () => {
    const expectedSubscriberName = 'AcmeCompany';
    process.env.SUBSCRIBER_NAME = expectedSubscriberName;

    const topics = ['foo', 'bar'];

    let subscribeCalls = 0;

    const pubSub = sandbox.stub(subscriber.gCloudProject, 'pubsub', () => {
      return {
        subscribe: (topic, name, options) => {
          subscribeCalls += 1;

          expect(name.endsWith(expectedSubscriberName)).toBe(true);
          expect(options.reuseExisting).toBe(true);
          expect(options.autoAck).toBe(true);
          expect(options.interval).toBe(10);
          expect(options.maxInProgress).toBe(100);
          expect(options.timeout).toBe(20000);
        },
      };
    });

    expect(subscriber).toBeDefined();

    // NOTE: 11-18-2016: fleschec: No need to provide a second argument 'onMessageCallback' since we are mocking
    // the test in such a way that no messages will ever be returned.
    subscriber.subscribe(topics, null);

    expect(pubSub.calledOnce).toBe(true);
    expect(subscribeCalls).toBe(topics.length);
  });
});
