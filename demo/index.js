const Listener = require('../Listener');

const quietDemo = process.env.QUIET_DEMO;

const onMessageCallback = (msg) => {
  if (quietDemo === true.toString()) {
    message = `${msg.data.substring(0, 50)} ...`;
  }
  console.log(`Received message: ${msg.data}\n`);
};

const listener = new Listener();

listener.listen(onMessageCallback);
