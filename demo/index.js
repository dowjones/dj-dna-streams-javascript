const Listener = require('../Listener');

const quietDemo = process.env.QUIET_DEMO;

async function onMessageCallback(msg) {
  let message = `${msg.data}`;
  if (quietDemo === true.toString()) {
    message = `${message.substring(0, 50)} ...`;
  }
  console.log(`Received message: ${message}\n`);
}

const listener = new Listener();

listener.listen(onMessageCallback);
