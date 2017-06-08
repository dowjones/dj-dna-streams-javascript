const listener = require('../listener');

const onMessageCallback = (msg) => {
  console.log(`Received message: ${JSON.stringify(msg.data)}\r\n`);
};

listener.listen(onMessageCallback);
