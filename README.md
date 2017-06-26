# dj-dna-streaming-javascript
DNA Streaming Client - written in Javascript.

## How To Use

#### Installing

This project is an NPM module. That means it can be installed as a kind of library for your main project. To do this go to your main project's root. At the command line execute the following:

~~~~
npm install git+https://git@github.com/dowjones/syndicationhub/dj-dna-streaming-javascript.git --save
~~~~
 
 or 

~~~~
npm install --save dj-dna-streaming-javascript
~~~~

#### Configuring The App

There are three ways to pass configuration variables to the app.  

Option 1. Modify the 'customerConfig.json' file. In this project's root you will find the 'customerConfig.json' file. Add your service account ID and your subscription ID(s). Ensure your additions follow the JSON data format conventions.

or

Option 2. Set an environment variable. Setting one of the 2 environment variables listed below will override any other configuration setting for that value.

  **SERVICE_ACCOUNT_ID**
    This environment variable is intended to hold your Dow Jones provided service account ID. This will override any setting in your config file.
    
  **SUBSCRIPTION_ID**
    This environment variable holds the subscription ID.
      

Option 3: Passing values as function arguments. Specifically you can pass either the service account ID or subscription IDs. When you start a listener you can pass the service account ID to the Listener constructor like so:

> var Listener = require('Listener');
>
> var onMessageCallback = function(msg) {
>    console.log('One incoming message:' + JSON.stringify(msg.data));
> };
>
> const listener = new Listener("<YOUR ACCOUNT ID HERE>");
> listener.listen(onMessageCallback);

This will override both the environmental variable and the configuration file service account ID setting.

If you want to pass the subscription IDs via function arguments, take a look at the following code:

> var Listener = require('Listener');
>
> var onMessageCallback = function(msg) {
>    console.log('One incoming message:' + JSON.stringify(msg.data));
> };
>
> var subscriptionId = 'abcdefghi123'; 
>
> const listener = new Listener();
> listener.listen(onMessageCallback, subscriptionId);


#### Running the Demo Code

This modules comes with some demo code shipped. To execute the demo code, set your configuration, the execute the following:

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

~~~
docker run -it \
-e SERVICE_ACCOUNT_ID="<your service account ID" \
-e SUBSCRIPTION_ID="<your subscription ID>" \
dj-dna-streaming-javascript
~~~


#### Writing Your Own Code

The following is some very basic code. Use it to listen to a DNA subscription. It assumes you have set the correct values in the configuration file or have set the correct environment variables (see the *Configuring The App* section above).

> var Listener = require('Listener');
>
> var onMessageCallback = function(msg) {
>    console.log('One incoming message:' + JSON.stringify(msg.data));
> };
>
> const listener = new Listener();
> listener.listen(onMessageCallback);
