# dj-dna-streaming-javascript
DNA Streaming Client - written in Javascript.

## How To Use

#### Installing

Install this at your project root by invoking the following command line:

~~~~
npm install git+https://git@github.dowjones.net/syndicationhub/dj-dna-streaming-javascript.git --save 
~~~~

#### Add Code to Subscribe to a DNA Topic or Two:

> const djDnaStreaming = require('dj-dna-streaming')
>
> const onMessageCallback = function(msg, topic) {
>    console.log('One incoming message:' + JSON.stringify(msg.data));
>    console.log('Incoming message\'s topic: ' + topic);  
> };
>
> djDnaStreaming.subscribe(['topic-1', 'topic-2'], onMessageCallback);


#### Execute with Environment Variables

When executing code that invokes this module ensure you have set the following environment variables -- GOOGLE_CLOUD_AUTHENTICATION, GCLOUD_PROJECT and SUBSCRIBER_NAME.

###### GOOGLE_CLOUD_AUTHENTICATION

This environment variable should hold the file path of your Dow Jones provided security json file (googleApplicationCredentials.json).

###### GCLOUD_PROJECT

Set this environment variable to the Dow Jones provided Google Cloud Project name.

###### SUBSCRIBER_NAME

Set this environment variable to your Dow Jones provided subscriber name.

###### Example Execution Command (MacOS)

````
export GOOGLE_APPLICATION_CREDENTIALS=./googleApplicationCredentials.json && export GCLOUD_PROJECT=djsyndicationhub && export SUBSCRIBER_NAME=your-company-name-here && node index.js
````

