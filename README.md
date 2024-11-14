# dj-dna-streaming-javascript

DNA Streaming Client - written in Javascript.

## How To Use

### Installing

This project is an NPM module. That means it can be installed as a kind of library for your main project. To do this go to your main project's root. At the command line execute the following:

~~~~
npm install git+https://git@github.com/dowjones/dj-dna-streams-javascript.git --save
~~~~

Alternatively you can simply check out this project from Git.

### Authentication

User Key
   
### Configuring The App

There are three ways to pass configuration variables to the app. Please note that environment variables (Option 1) will override values provided in the `customerConfig.json` file (Option 2).  
They will not override values passed directly to the `Listener` constructor (Option 3).

#### Option 1. Set environment variables.

Export the following envirnment variables:

  **USER_KEY**
     Dow Jones provided user key.
  
  **SUBSCRIPTION_ID**
     This environment variable holds the subscription ID.

#### Option 2. Modifying `customerConfig.json`
   
In this project's root you will find the `customerConfig.json` file. Add your credentials and subscription ID. Ensure your additions follow the JSON data format conventions.

```
{
  "user_key": "<Dow Jones provided user key>",
  "subscription_id": "<Subscription ID returned upon stream creation>"
}
```

#### Option 3. Passing values as function arguments.

Specifically you can pass either the service account credentials and/or subscription ID. When you start a listener you can pass the service account crendentials to the Listener constructor as an object with the field "user_key", like so:

~~~~
  const Listener = require('dj-dna-streaming-javascript').Listener;

  const onMessageCallback = async function(msg) {
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
  const Listener = require('dj-dna-streaming-javascript').Listener;

  const onMessageCallback = async function(msg) {
     console.log('One incoming message:' + JSON.stringify(msg.data));
  };

  const subscriptionId = 'abcdefghi123'; 

  const listener = new Listener();
  listener.listen(onMessageCallback, subscriptionId);
~~~~


### Running the Demo Code

This modules comes with demonstration code. To execute the demo code, configure your app (See _Configuring the App_ section above). Then execute the following:

~~~
npm run demo
~~~

### Docker Demo

To execute the demo code in a Docker container, perform the following steps.

Step 1: Build the docker image. Execute the following command line:

~~~
  docker build -f ./DockerfileDemo -t dj-dna-streaming-javascript .
~~~
  
Step 2: Run the docker image

~~~
docker run -it \
-e USER_KEY="<your user key>" \
-e SUBSCRIPTION_ID="<your subscription ID>" \
dj-dna-streaming-javascript
~~~

## Writing Your Own Code

The following is some very basic code. Use it to listen to a DNA subscription. It assumes you have correctly configured the app. (See the *Configuring The App* section above).

You can use two patterns to consume the messages from the subscription. The first option is using an async function or function returning a Promise or theanable:

### Async Function, Promise or Theanable

Write an async function or function returning a Promise/Theanable processing the messages. When the
promise is resolved the message is acknowledged, in case the promise is rejected the message will be
not acknowledged, so it can be processed again.

~~~~
  const Listener = require('dj-dna-streaming-javascript').Listener;
 
  const onMessageCallback = async function(msg) {
     console.log('One incoming message:' + JSON.stringify(msg.data));
  };
 
  const listener = new Listener();
  listener.listen(onMessageCallback);
~~~~

### Callback pattern

Write a callback function with two parameters, the first one being the message. The second one is a function which must be called with null as a parameter if the message is correctly processed or an error. If the parameter is null when calling handleErr, the message will be acknowledged, if not, the message will be not acknowledged.

~~~~
  const Listener = require('dj-dna-streaming-javascript').Listener;

  const onMessageCallback = (msg, handleErr) => {
    let err = null;
    try {
      console.log('One incoming message:' + JSON.stringify(msg.data));
    } catch (e) {
      err = e
    };
    
    handleErr(err)
  };
  
  const listener = new Listener();
  listener.listen(onMessageCallback, null, false);
~~~~

### Migrating from a synchronous callback function

The latest version of the client require the callback function to conform to the callback pattern or using a function returning a Promise or Theanable.

When having a synchronous callback function as the following:
~~~~~
  const oldSynchronousCallback = (msg) => {
    console.log('One incoming message:' + JSON.stringify(msg.data));
  }
~~~~~

#### Create Promise from the old callback function:

~~~~
  const Listener = require('dj-dna-streaming-javascript').Listener;

  const newAsyncCallback = (msg) => {
    return new Promise((resolve, reject) => {
      try {
        resolve(oldSynchronousCallback(msg));
      } catch (e) {
        reject(e);
      }
    });
  };

  const listener = new Listener();
  listener.listen(newAsyncCallback);
~~~~

#### Use the callback pattern:
~~~~
  const Listener = require('dj-dna-streaming-javascript').Listener;

  const onMessageCallback = (msg, handleErr) => {
    let err = null;
    try {
      oldSynchronousCallback(msg);
    } catch (e) {
      err = e
    };
    
    handleErr(err)
  };
  
  const listener = new Listener();
  listener.listen(onMessageCallback, null, false);
~~~~
