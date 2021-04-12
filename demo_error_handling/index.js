const Listener = require('../Listener');

const quietDemo = process.env.QUIET_DEMO;

const onMessageCallback = (msg) => {
  let err = null;
  try {
    let message = `${msg.data}`;
    if (quietDemo === true.toString()) {
      message = `${message.substring(0, 50)} ...`;
    }
    console.log(`Received message: ${message}\n`);
  } catch (e) {
   err = e
  };
  
  return {err}
};

const listener = new Listener();

listener.listen(onMessageCallback, null, true);
