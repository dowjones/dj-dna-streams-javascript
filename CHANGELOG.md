
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

1.0.0 / 2017-06-09
==================
- [breaking] App no longer requires 'DOW_JONES_JSON_CONFIG' credentials/config file. Instead customer just needs to set the service account ID and subscription ID(s) in config. See README.md.
- [tests] Updated and added tests.
- [breaking] Removed topic from message callback because the value did not come from the service response. Instead it came from the user's own configuration setting. So this setting provided almost no useful contextual information for the user. Worse yet it could be confusing. So ... removed for clarity.
- [deps] Added lodash, request, and request-promise.
- [patch] Added demo code. See README.md.
- [patch] Added call to 'https://extraction-api-dot-djsyndicationhub-prod.appspot.com/alpha/accounts/streaming-credentials' when listener method invoked. This will download the user credentials. Previous to this version, the credentials were stored in a local config.
- [breaking] Listener must now be constructed. User now has option to pass in account_ID to listener constructor. Otherwise environment variable is used. If environment variable is not set, then customerConfig.json is consulted.
- [docs] Updated README.md.

1.0.1 / 2017-06-09
==================
- [breaking] Removed abililty to consume more than one stream at a time.
- [tests] Updated tests.
- [docs] Updated README.

1.0.2 / 2017-06-29
==================
- [changed] Updated default production URI.
- [changed] Fixed license to MIT.
- [changed] Updated version and GIT URI in package.json.

1.0.3 / 2017-07-05
==================
- [patch] Update to acknowledge each message.

1.0.4 / 2017-08-17
==================
- [patch] Reverting to pull function instead of get because of permission errors we suddenly are encountering.

1.0.5 / 2017-08-17
==================
- [patch] Upgrading Google Cloud version to get better delivery reliability
- [patch] Downgraded demo Docker version to node 6.5.1 slim to match current development version.

1.1.0 / 2018-03-19
==================
- [changed] - updated authentication to use new service account flow (while still supporting old account ID flow for backwards compatibility)
- [changed] - Updated demo code to accept environment variable that, when used, reduces the output volume.
- [changed] - Added test shell script './test/test_run_docker.sh' for testing Docker and streams; to be used only with DNA Engineering assistance.  

1.1.2 / 2020-12-07
==================
- [changed] - Removed references to depreciated Extraction API service, now you may manually specify your API host by exporting API_HOST instead of EXTRACTION_API_HOST

1.2.0 / 2020-01-08
==================
- [changed] - updated to latest dependencies
- [changed] - removed support of JWT authentication

1.3.0 / 2024-11-28
==================
- [changed] - Added a shutdown listener method
- [breaking] - Fixed messages being acknowledged even after a callback failure. See "Migrating from a synchronous callback function" section from the README.md
- [changed] - Updated to latest dependencies
- [changed] - Implemented usage of node-fetch after requests deprecation
