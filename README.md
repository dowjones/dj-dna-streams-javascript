# dj-dna-streaming-javascript
DNA Streaming Client - written in Javascript.

## How To Use

#### Installing

This project is an NPM module. That means it can be installed as a kind of library for your main project. To do this go to your main project's root. At the command line execute the following:

~~~~
npm install git+https://git@github.com/dowjones/dj-dna-streams-javascript.git --save
~~~~

Alternatively you can simply check out this project from Git.

#### Authentication

User Key
   
#### Configuring The App

There are three ways to pass configuration variables to the app. Please note that environment variables (Option 1) will override values provided in the `customerConfig.json` file (Option 2).  
They will not override values passed directly to the `Listener` constructor (Option 3).

Option 1. Set environment variables.

###### User Key

  **USER_KEY**
     Dow Jones provided user key.
  
  **SUBSCRIPTION_ID**
     This environment variable holds the subscription ID.   
   
Option 2. Modify the 'customerConfig.json' file. In this project's root you will find the 'customerConfig.json' file. Add your credentials and subscription ID. Ensure your additions follow the JSON data format conventions.

###### User Key

```
{
  "user_key": "<Dow Jones provided user key>",
  "subscription_id": "<Subscription ID returned upon stream creation>"
}
```

or

Option 3: Passing values as function arguments. Specifically you can pass either the service account credentials and/or subscription ID. When you start a listener you can pass the service account crendentials to the Listener constructor as an object with the field "user_key", like so:

~~~~
  var Listener = require('dj-dna-streaming-javascript').Listener;

  var onMessageCallback = function(msg) {
     console.log('One incoming message:' + JSON.stringify(msg.data));
  };

  const listener = new Listener({
    /**
     User Key
    */
    user_key: "<YOUR USER KEY HERE>"
  });
  listener.listen(onMessageCallback);
~~~~

This will override both the environment variable and the configuration file service account credentials.

If you want to pass the subscription ID via function arguments, take a look at the following code:

~~~~
  var Listener = require('dj-dna-streaming-javascript').Listener;

  var onMessageCallback = function(msg) {
     console.log('One incoming message:' + JSON.stringify(msg.data));
  };

  var subscriptionId = 'abcdefghi123'; 

  const listener = new Listener();
  listener.listen(onMessageCallback, subscriptionId);
~~~~


#### Running the Demo Code

This modules comes with demonstration code. To execute the demo code, configure your app (See _Configuring the App_ section above). Then execute the following:

~~~
npm run demo
~~~

##### Docker Demo

To execute the demo code in a Docker container, perform the following steps.

Step 1: Build the docker image. Execute the following command line:

~~~
  docker build -f ./DockerfileDemo -t dj-dna-streaming-javascript .
~~~
  
Step 2: Run the docker image

###### User Key

~~~
docker run -it \
-e USER_KEY="<your user key>" \
-e SUBSCRIPTION_ID="<your subscription ID>" \
dj-dna-streaming-javascript
~~~

###### Client Credentials
~~~
docker run -it \
-e USER_ID="<your user ID>" \
-e CLIENT_ID="<your client ID>" \
-e PASSWORD="<your password>" \
-e SUBSCRIPTION_ID="<your subscription ID>" \
dj-dna-streaming-javascript
~~~


#### Writing Your Own Code

The following is some very basic code. Use it to listen to a DNA subscription. It assumes you have configured the app correct. (See the *Configuring The App* section above).

~~~~
  var Listener = require('dj-dna-streaming-javascript').Listener;
 
  var onMessageCallback = function(msg) {
     console.log('One incoming message:' + JSON.stringify(msg.data));
  };
 
  const listener = new Listener();
  listener.listen(onMessageCallback);
~~~~

###### Error Handling

If your callback fails, the message will be nack'd and the listener will rethrow the error. If you wish to write your own error handling for callbacks then set the `userErrorHandling` parameter to true. This allows you to use an error handler callback to force the callback handler to nack messages. The following is a very basic example illustrating how this may work.

~~~~
  var Listener = require('dj-dna-streaming-javascript').Listener;
 
  var onMessageCallback = function((msg, handleErr) {
     let err = null;
     try {
      console.log('One incoming message:' + JSON.stringify(msg.data));
      } catch (e) {
        err = e
      };
    handleErr(err)
  };
 
  const listener = new Listener();
  listener.listen(onMessageCallback, my_subscription_id, true);
~~~~
