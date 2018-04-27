const PubSub = require('@google-cloud/pubsub');
const ConfigUtil = require('./config/ConfigUtil');
const fetchCredentials = require('./services/fetchCredentials');
const path = require('path');
const os = require('os');

/** Class that allows you to listen to a number of Dow Jones PubSub subscriptions. This is a singleton. */
class Listener {

  constructor(accountCredentials, pubsubClient) {
    this.configUtil = new ConfigUtil(accountCredentials);
    this.pubsubClient = pubsubClient;
  }

  initialize(credentials, pubSub) {
    this.projectId = credentials.project_id;
    this.pubsubClient = this.pubsubClient || new PubSub({
      projectId: this.projectId,
      credentials
    });

    this.defaultSubscriptionId = this.configUtil.getSubscriptionId();
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
   * @param {string[]=['<your subscription ID here>']} [subscriptions] - [Optional] collection of subscriptions you wish to listen to. Defaults to the subscriptions listed in your credentials security file.
   * Leave as null or undefined if you
   * want to use the default.
   */
  listen(onMessageCallback, subscription) {
    return this.getCredentials().then((credentials) => {
      this.initialize(credentials);
      this.readyListener(onMessageCallback, subscription);
      return true;
    }).catch((err) => {
      if (err.message) {
        console.log(err.message);
      } else {
        console.log(JSON.stringify(err));
      }
      return false;
    });
  }

  getCredentials() {
    return fetchCredentials(this.configUtil);
  }

  readyListener(onMessageCallback, subscriptionId) {
    const sub = subscriptionId || this.defaultSubscriptionId;

    if (!sub || sub.length <= 0) {
      throw new Error('No subscriptions specified. You must specify subscriptions when calling the \'listen\' function.');
    }

    const subscriptionFullName = `projects/${this.projectId}/subscriptions/${sub}`;

    console.log(`Listening to subscription: ${subscriptionFullName}`);

    const onMessage = (msg) => {
      msg.ack();
      return onMessageCallback(msg);
    };

    const pubsubSubscription = this.pubsubClient.subscription(subscriptionFullName);

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

    console.log('Listeners for subscriptions have been configured, set and await message arrival.');
  }
}

module.exports = Listener;
