# dj-dna-streaming-javascript
DNA Streaming Client - written in Javascript.

## How To Use

#### Installing

This project is an NPM module. That means it can be installed as a kind of library for your main project. To do this go to your main project's root. At the command line execute the following:

~~~~
npm install git+https://git@github.dowjones.net/syndicationhub/dj-dna-streaming-javascript.git --save
~~~~
 
 or 

~~~~
npm install --save dj-dna-streaming-javascript --registry http://registry.npm.wsjfdev.dowjones.net/
~~~~

#### Configuring The App

There are 2 ways to pass configuration variables to the app.* 

Option 1. Modify the 'customerConfig.json' file. In this project's root you will find the 'customerConfig.json' file. Add your service account ID and your subscription ID(s). Ensure your additions follow the JSON data format conventions.

or

Option 2. Set an environment variable. Setting one of the 2 environment variables listed below will override any other configuration setting for that value.

  **SERVICE_ACCOUNT_ID**
    This environment variable is intended to hold your Dow Jones provided service account ID.
    
  **SUBSCRIPTION_IDS**
    This environment variable holds the command delimited list of subscription IDS. This value's required formatting is a not obvious. Here is a sample MacOS command line setting for illustration:
    
      export SUBCRIPTION_IDS="abcdefghi123, jklmnopqr456"
      
 NOTE: You may also pass subscription IDS using a function parameter. See the sample code below.

#### Add Code to Listen to a DNA Subscription or Two:

> var djDnaStreaming = require('dj-dna-streaming');
>
> var onMessageCallback = function(msg) {
>    console.log('One incoming message:' + JSON.stringify(msg.data));
> };
>
> djDnaStreaming.listen(onMessageCallback);

If you wish to specify the subscription IDs in code (rather than configuration) use the following technique:

> var djDnaStreaming = require('dj-dna-streaming');
>
> var onMessageCallback = function(msg) {
>    console.log('One incoming message:' + JSON.stringify(msg.data));
> };
>
> var subscriptionIds = ['abcdefghi123', 'jklmnopqr456']; 
>
> djDnaStreaming.listen(onMessageCallback, subscriptionIds);

#### Running the Demo Code

This modules comes with some demo code shipped. To execute the demo code, set your configuration, the execute the following:

~~~
npm run demo
~~~