const {PubSub} = require('@google-cloud/pubsub');
const Config = require('./config/Config');
const ApiService = require('./services/ApiService');

/** Class that allows you to listen to a number of Dow Jones PubSub subscriptions. This is a singleton. */
class Listener {

  constructor(accountCredentials, pubsubClient) {
    this.config = new Config(accountCredentials);
    this.apiService = new ApiService(
      this.config.getApiHost(),
      this.config.getAccountCredentials()
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
  listen(onMessageCallback, subscription, userErrorHandling = false) {
    return this.apiService.getStreamingCredentials().then((credentials) => {
      this.initialize(credentials);
      this.readyListener(onMessageCallback, subscription, userErrorHandling);
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

  readyListener(onMessageCallback, subscriptionId, userErrorHandling) {
    const sub = subscriptionId || this.defaultSubscriptionId;

    if (!sub || sub.length <= 0) {
      throw new Error('No subscriptions specified. You must specify subscriptions when calling the \'listen\' function.');
    }

    const subscriptionFullName = `projects/${this.projectId}/subscriptions/${sub}`;

    console.log(`Listening to subscription: ${subscriptionFullName}`);

    const onMessageTryCatch = (msg) => {
      try {
        onMessageCallback(msg);
        msg.ack();
      } catch (err) {
        console.error(`Error from callback: ${err}\n`);
        msg.nack();
        process.exit(1);
      }
    };

    const onMessageUserHandling = (msg) => {
      let callback = onMessageCallback(msg);
      if (!callback.err) {
          msg.ack();
        } else {
        console.error(`Error from callback: ${callback.err}\n`);
        msg.nack();
        process.exit(1);
        }
      };

    const onMessage = (userErrorHandling) ? onMessageUserHandling : onMessageTryCatch;

    const pubsubSubscription = this.pubsubClient.subscription(subscriptionFullName);

    this.apiService.getAccountInfo().then(accountInfo =>
      this.checkDocCountExceeded(sub, accountInfo.max_allowed_document_extracts));

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

  checkDocCountExceeded(subscriptionId, maxDocumentsReceived) {
    const streamDisabledMsg =
      `\nOOPS! Looks like you've exceeded the maximum number of documents received for your account (${maxDocumentsReceived}).\n` +
      'As such, no new documents will be added to your stream\'s queue.\n' +
      'However, you won\'t lose access to any documents that have already been added to the queue.\n' +
      'These will continue to be streamed to you.\n' +
      'Contact your account administrator with any questions or to upgrade your account limits.';
    const interval = 300000;
    this.apiService.isStreamDisabled(subscriptionId).then((isDisabled) => {
      if (isDisabled) {
        console.error(streamDisabledMsg);
      }
      setTimeout(this.checkDocCountExceeded.bind(this), interval, subscriptionId, maxDocumentsReceived);
    }).catch((err) => {
      console.error(err);
      setTimeout(this.checkDocCountExceeded.bind(this), interval, subscriptionId, maxDocumentsReceived);
    });
  }
}

module.exports = Listener;
