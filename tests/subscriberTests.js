const sinon = require('sinon');
const subscriber = require('../subscriber');

describe('Given Subscriber object', () => {
  let sandbox;
  const expectedUserKey = 'AcmeCompany';

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    process.env.USER_KEY = expectedUserKey;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should use the default cloud project', () => {
    expect(process.env.GCLOUD_PROJECT).not.toBeDefined();
    expect(subscriber.gCloudProjectName).toBe('djsyndicationhub');
  });

  it('subscribing should succeed.', () => {
    const topics = ['foo', 'bar'];

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
    subscriber.subscribe(null, topics);

    expect(pubSub.calledOnce).toBe(true);
    expect(subscribeCalls).toBe(topics.length);
  });

  it('and no topic is provided subscribing should use the default topic.', () => {
    let subscribeCalls = 0;
    const pubSub = sandbox.stub(subscriber.gCloudProject, 'pubsub', () => {
      return {
        subscribe: (topic, name, options) => {
          subscribeCalls += 1;

          expect(topic).toBe('ContentEventTranslated');
        },
      };
    });

    subscriber.subscribe(null);

    expect(pubSub.calledOnce).toBe(true);
    expect(subscribeCalls).toBe(1);
  });
});
