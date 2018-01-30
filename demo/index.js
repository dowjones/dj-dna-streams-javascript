const Listener = require('../Listener');

const quietDemo = process.env.QUIET_DEMO;

const onMessageCallback = (msg) => {
  let message = JSON.stringify(msg.data);
  if (quietDemo === true.toString()) {
    message = `${message.substring(0, 50)} ...`;
  }
  console.log(`Received message: ${message}\n`);
};

const listener = new Listener();

listener.listen(onMessageCallback);
