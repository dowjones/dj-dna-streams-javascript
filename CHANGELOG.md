
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
