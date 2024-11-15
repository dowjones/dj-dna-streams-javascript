const Listener = require('../Listener');

const quietDemo = process.env.QUIET_DEMO;

const onMessageCallback = (msg, handleErr) => {
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
  
  handleErr(err)
};

const listener = new Listener();

listener.listen(onMessageCallback, null, false);
