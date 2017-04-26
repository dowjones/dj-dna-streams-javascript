
0.1.0 / 2016-11-18
==================
- [Tests] Added testing framework.
- [docs] Updated README.md. Added method describing how to install package from Dow Jones NPM registry.
- [deps] Added testing dependencies.

0.1.1 / 2016-11-18
==================
- [patch] If GCLOUD_PROJECT environment variable is not passed then the system uses a default Google Cloud Dow Jones project name.
- [docs] Updated README.md. Modified to show env var is now optional.

0.1.2 / 2016-11-22
==================
- [breaking] Changed required environment variable SUBSCRIBER_NAME to USER_KEY.
- [breaking] Changed order of subscribe method arguments - callback comes first now. Topic is the second argument now and optional. If no topic array is passed then the default topic will be 'ContentEventTranslated'.

0.1.3 / 2016-11-30
==================
- [breaking] Removed required environment variables SUBSCRIBER_NAME to USER_KEY.
- [breaking] Added required DOW_JONES_APPLICATION_CREDENTIALS environment variable file.
- [Tests] Updated tests to reflect breaking changes (above).
- [docs] Updated README.md. Modified to reflect these changes.

0.1.4 / 2016-11-30
==================
- [fix] Fixed broken pubsub client construction; now specifying project name.
- [fix] Fixed broken function for finding default topic.

0.1.5 / 2017-01-20
==================
- [fix] Removed '.idea' folder from NPM registry by adding .npmignore to project files.
- [patch] Removed requirement to pass project name in credentials JSON. If none is passed system is hardcoded to default to the Dow Jones DNA production project ID/name.
- [Tests] Add tests for configUtil changes.
- [docs] Updated LICENSE file to reflect actual licensing terms.

0.1.6 / 2017-01-20
==================
- [docs] Updated README.md
- [breaking] Changed the name of the credentials environment variable we look for. See README.md  
- [patch] Changed subscription name we compose for subscriber.

0.1.7 / 2017-02-09
==================
- [patch] Added credential information to google cloud connection since it was not working.

0.1.8 / 2017-04-05
==================
- [docs] Updated README.md

0.1.9 / 2017-04-11
==================
- [breaking] Create listeners on subscriptions instead of creating subscriptions on topics
- [breaking] Changed name of 'subscriber.js' to 'listener.js', and main function name of module from 'subscribe' to 'listen'
- [breaking] Look for subscriptions as objects with 'name' and 'topic' fields in credentials file instead of just topics
- [docs] Updated README.md

0.2.O / 2017-04-25
==================
- [docs] Updated README.md
- [breaking] Changed name of expected Dow Jones JSON config file from 'dowJonesApplicationCredentials.json' to 'DowJonesDNA.json'
- [breaking] Changed environmental variable from 'DOW_JONES_APPLICATION_CREDENTIALS' to 'DOW_JONES_JSON_CONFIG'.
- [tests] Updated tests

0.2.1 / 2017-04-25
==================
- [patch] Fixed bug where getting incorrect message 'Error retrieving subscription from Google PubSub: undefined'.

0.2.2 / 2017-04-26
==================
- [patch] Bug with eslint where trailing commas were always expected in cases where none should have been expected.
- [tests] Refactored some tests by cleaning up unused parameters and simplified return objects in some arrow functions.
