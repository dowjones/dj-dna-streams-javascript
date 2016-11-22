const googleCloud = require('google-cloud');

/** Class that allows you to subscribe to a Dow Jones topic feed. This is a singleton. */
class Subscriber {

  constructor() {
    this.gCloudProjectName = (process.env.GCLOUD_PROJECT) ? process.env.GCLOUD_PROJECT : 'djsyndicationhub';
    this.gCloudProject = googleCloud({ project: this.gCloudProjectName });
  }

  getUserKey() {
    if (!process.env.USER_KEY) {
      throw new Error('Encountered error attempting to subscribe to a Dow Jones event. The USER_KEY environment variable was not set." + ' +
        ' Ensure you set this variable to the Dow Jones supplied value.');
    }
    return process.env.USER_KEY;
  }

  /**
   * This callback type is called `subscriptionOnMessageCallback` and is displayed as part of this class.
   *
   * @callback Subscriber~subscriptionOnMessageCallback
   * @param {object} message - The actual Google pubsub message from published from the server and subscribed to by this function.
   * @param {string} topic - The message's topic
   */

  /**
   * This function allows you to subscribe to published topic messages.
   *
   * @param {subscriptionOnMessageCallback} onMessageCallback - The callback that handles the topic message when it arrives.
   * @param {string[]=['ContentEventTranslated']} [topics] - [Optional] collection of topics you wish to subscribe to. Defaults to 'ContentEventTranslated'. Leave as null or undefined if you
   * want to use the default.
   */
  subscribe(onMessageCallback, topics) {
    const ensuredTopics = topics || ['ContentEventTranslated'];

    const pubsubClient = this.gCloudProject.pubsub();
    const subscriptions = [];

    ensuredTopics.forEach((topic) => {
      console.log(`Subscribing to ${topic}`);

      const onMessage = (msg) => {
        msg.skip();
        return onMessageCallback(msg, topic);
      };

      const name = `${topic}_Live_${this.getUserKey()}`;
      console.log(`Subscription name: ${name}`);

      pubsubClient.subscribe(topic, name, { reuseExisting: true, autoAck: true, interval: 10, maxInProgress: 100, timeout: 20000 },
        (err, subscription) => {
          if (err) {
            console.log(`Subscription Error: ${err}`);
          }

          subscriptions.push(subscription);

          subscription.on('error', (subErr) => {
            console.log(`On Subscription Error: ${subErr}`);
            subscription.removeListener('message', onMessage);
            subscription.on('message', onMessage);
          });
          subscription.on('message', onMessage);
        });
    });
  }
}

module.exports = new Subscriber();
