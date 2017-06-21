const Listener = require('../Listener');

const onMessageCallback = (msg) => {
  console.log(`Received message: ${JSON.stringify(msg.data)}\r\n`);
};

const listener = new Listener();

listener.listen(onMessageCallback);
