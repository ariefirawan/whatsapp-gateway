const express = require('express');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const qrcode = require('qrcode');

const connectDB = require('./config/database');
const client = require('./middlewares/auth');

const replyMsg = require('./models/replyMessage');

const server = express();

dotenv.config({ path: 'config/config.env' });

client.on('ready', () => {
  console.log('Client is Ready');
});

const replyHandler = async (msg) => {
  const reply = replyMsg.find({ message: msg });
  console.log(reply);
  return reply;
};

client.on('qr', (qr) => {
  qrcode.toDataURL(qr, function (err, url) {
    console.log(url);
    if (err) {
    }
  });
});

client.on('message', (message) => {
  if (message.body === '!ping') {
    message.reply(replyHandler(message));
  }
});

client.initialize();

server.listen(4000, () => {
  connectDB();
  console.log(`Server running on PORT 4000`);
});
