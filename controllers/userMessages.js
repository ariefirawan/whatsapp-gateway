const client = require('../middlewares/auth');

client.on('message', (message) => {
  if (message.body === '!ping') {
    message.reply('pong');
  }
});