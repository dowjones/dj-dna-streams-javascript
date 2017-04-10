const listener = require('./listener');

// module.exports = listener;

const onMessageCallback = (msg, topic) => {
  console.log(`Received '${topic}' message: ${JSON.stringify(msg.data)}\r\n`);
};

listener.listen(onMessageCallback);
