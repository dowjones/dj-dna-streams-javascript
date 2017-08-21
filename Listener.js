const googleCloud = require('google-cloud');
const ConfigUtil = require('./config/ConfigUtil');
const fetchCredentials = require('./fetchCredentials');

/** Class that allows you to listen to a number of Dow Jones PubSub subscriptions. This is a singleton. */
class Listener {

  constructor(accountId) {
    this.accountId = accountId;
    this.configUtil = new ConfigUtil(accountId);
  }


  initialize(credentials) {
    this.gCloudProject = googleCloud({ project_id: credentials.project_id, credentials });
    this.projectId = credentials.project_id;
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
    return this.getCredentials(this.configUtil).then((credentials) => {
      this.initialize(credentials);
      this.readyListener(onMessageCallback, subscription);
      return true;
    }).catch((err) => {
      console.log(`Encountered an error attempting to get cloud credentials on behalf of customer: ${err.message}`);
      return false;
    });
  }

  getCredentials() {
    return fetchCredentials(this.configUtil);
  }

  getPubSubClient() {
    return this.gCloudProject.pubsub({ projectId: this.projectId });
  }

  readyListener(onMessageCallback, subscriptionId) {
    const pubsubClient = this.getPubSubClient();
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

    const pubsubSubscription = pubsubClient.subscription(subscriptionFullName);

    pubsubSubscription.pull().then((data) => {
      const pubsubSub = data[0];
      console.log(`Received ${pubsubSub.length} messages.`);

      pubsubSub.forEach((message) => {
        onMessage(message);
      });
    }).catch((err) => {
      console.log(`Error retrieving subscription from Google PubSub: ${err}`);
    });

    console.log('Listeners for subscriptions have been configured, set and await message arrival.');
  }
}

module.exports = Listener;
