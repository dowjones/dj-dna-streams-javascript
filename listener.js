const googleCloud = require('google-cloud');
const configUtil = require('./config/configUtil');

/** Class that allows you to listen to a number of Dow Jones PubSub subscriptions. This is a singleton. */
class Listener {

  constructor() {
    this.gCloudProjectName = configUtil.getProjectName();
    this.gCloudProject = googleCloud({ project: this.gCloudProjectName, credentials: configUtil.credentials });
    this.userKey = configUtil.getUserKey();
    this.defaultSubscriptions = configUtil.getSubscriptions();
  }

  /**
   * This callback type is called `subscriptionOnMessageCallback` and is displayed as part of this class.
   *
   * @callback Subscriber~subscriptionOnMessageCallback
   * @param {object} message - The actual Google pubsub message from published from the server and subscribed to by this function.
   * @param {string} topic - The message's topic
   */

  /**
   * This function allows you to listen to messages from a subscription.
   *
   * @param {subscriptionOnMessageCallback} onMessageCallback - The callback that handles the topic message when it arrives.
   * @param {string[]=['ContentEventTranslated']} [subscriptions] - [Optional] collection of subscriptions you wish to listen to. Defaults to the subscriptions listed in your credentials security file.
   * Leave as null or undefined if you
   * want to use the default.
   */
  listen(onMessageCallback, subscriptions) {
    const pubsubClient = this.gCloudProject.pubsub({ projectId: this.gCloudProjectName });
    const subs = subscriptions || this.defaultSubscriptions;

    if (!subs || subs.length <= 0) {
      throw new Error('No subscriptions specified. Must specify subscriptions in credentials file or as parameters to this function');
    }

    subs.forEach((subscription) => {
      console.log(`Listening to subscription: ${subscription.name}`);

      const onMessage = (msg) => {
        msg.ack();
        return onMessageCallback(msg, subscription.topic);
      };

      const pubsubSubscription = pubsubClient.subscription(subscription.name);

      pubsubSubscription.get().then((data) => {
        const pubsubSub = data[0];
        pubsubSub.on('message', onMessage);
        pubsubSub.on('error', (subErr) => {
          console.log(`On Subscription Error: ${subErr}`);
          pubsubSub.removeListener('message', onMessage);
          pubsubSub.on('message', onMessage);
        });
      }).catch((err) => {
        console.log(`Error retrieving subscription from Google PubSub: ${err}`);
      });
    });

    console.log('Listeners for subscriptions have been configured, set and await message arrival.');
  }
}

module.exports = new Listener();
