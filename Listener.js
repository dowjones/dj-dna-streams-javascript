const PubSub = require('@google-cloud/pubsub');
const Config = require('./config/Config');
const ExtractionApiService = require('./services/ExtractionApiService');

/** Class that allows you to listen to a number of Dow Jones PubSub subscriptions. This is a singleton. */
class Listener {

  constructor(accountCredentials, pubsubClient) {
    this.config = new Config(accountCredentials);
    this.extractionApiService = new ExtractionApiService(
      this.config.getExtractionApiHost(),
      this.config.getAccountCredentials(),
      this.config.getOauthUrl()
    );
    this.pubsubClient = pubsubClient;
  }

  initialize(credentials) {
    this.projectId = credentials.project_id;
    this.pubsubClient = this.pubsubClient || new PubSub({
      projectId: this.projectId,
      credentials
    });

    this.defaultSubscriptionId = this.config.getSubscriptionId();
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
    return this.extractionApiService.getStreamingCredentials().then((credentials) => {
      this.initialize(credentials);
      this.readyListener(onMessageCallback, subscription);
      return true;
    }).catch((err) => {
      if (err.message) {
        console.error(err.message);
      } else {
        console.error(JSON.stringify(err));
      }
      return false;
    });
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

    this.checkDocCountExceeded(sub);

    pubsubSubscription.get().then((data) => {
      const pubsubSub = data[0];
      pubsubSub.on('message', onMessage);
      pubsubSub.on('error', (subErr) => {
        console.error(`On Subscription Error: ${subErr}`);
        pubsubSub.removeListener('message', onMessage);
        pubsubSub.on('message', onMessage);
      });
    }).catch((err) => {
      console.error(`Error retrieving subscription from Google PubSub: ${err}`);
    });

    console.log('Listeners for subscriptions have been configured, set and await message arrival.');
  }

  checkDocCountExceeded(subscriptionId) {
    const streamDisabledMsg =
      '\nOOPS! Looks like you\'ve exceeded the maximum number of documents received for your account.\n' +
      'As such, no new documents will be added to your stream\'s queue.\n' +
      'However, you won\'t lose access to any documents that have already been added to the queue.\n' +
      'These will continue to be streamed to you.\n';
    const interval = 30000;
    this.extractionApiService.isStreamDisabled(subscriptionId).then((isDisabled) => {
      if (isDisabled) {
        console.error(streamDisabledMsg);
      }
      setTimeout(this.checkDocCountExceeded.bind(this), interval, subscriptionId);
    }).catch((err) => {
      console.error(err);
      setTimeout(this.checkDocCountExceeded.bind(this), interval, subscriptionId);
    });
  }
}

module.exports = Listener;
