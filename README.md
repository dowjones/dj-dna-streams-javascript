# dj-dna-streaming-javascript
DNA Streaming Client - written in Javascript.

## How To Use

#### Installing

Install this at your project root by invoking the following command line:

~~~~
npm install git+https://git@github.dowjones.net/syndicationhub/dj-dna-streaming-javascript.git --save
~~~~
 
 or 

~~~~
npm install --save dj-dna-streaming-javascript --registry http://registry.npm.wsjfdev.dowjones.net/
~~~~

#### Add Code to Subscribe to a DNA Topic or Two:

> var djDnaStreaming = require('dj-dna-streaming');
>
> var onMessageCallback = function(msg, topic) {
>    console.log('One incoming message:' + JSON.stringify(msg.data));
>    console.log('Incoming message\'s topic: ' + topic);  
> };
>
> djDnaStreaming.subscribe(onMessageCallback);


#### Specifying Different Topics

The event topics will default to those listed in the Dow Jones supplied credentials file. 

However if you want to specify your own topics you can. Add a 'topics' argument to the subscribe function call like so:

> var topics = ['someEvent1', 'someOtherEvent'];

> djDnaStreaming.subscribe(onMessageCallback, topics);


#### Execute with Environment Variables

When executing code that invokes this module ensure you have set the following environment variables -- GOOGLE_CLOUD_AUTHENTICATION, GCLOUD_PROJECT and SUBSCRIBER_NAME.

###### GOOGLE_CLOUD_AUTHENTICATION

This environment variable should hold the file path of your Dow Jones provided security json file (sometimes called 'googleApplicationCredentials.json').

###### Example Execution Command (MacOS)

````
export GOOGLE_APPLICATION_CREDENTIALS=./googleApplicationCredentials.json && node index.js
````
