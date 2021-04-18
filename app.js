const fs = require('fs');
const http = require('http');
const { Client } = require('whatsapp-web.js');
const express = require('express');
const dotenv = require('dotenv');
const socketIO = require('socket.io');
const qrcode = require('qrcode');

const ErrorHandler = require('./utils/ErrorHandler');
const connectDB = require('./config/database');
const replyMsg = require('./models/replyMessage');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

dotenv.config({ path: 'config/config.env' });

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
  puppeteer: { headless: true },
  session: sessionCfg,
});

client.on('authenticated', (session) => {
  console.log('AUTHENTICATED', session);
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      return next(new ErrorHandler('cannot access this resources', 401));
    }
  });
});

io.on('connection', (socket) => {
  socket.emit('message', 'Connecting ....')
});

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
      return next(new ErrorHandler('cannot access this resources', 401));
    }
  });
});

client.on('message', (message) => {
  if (message.body === '!ping') {
    message.reply(replyHandler(message));
  }
});

client.on('message_revoke_me', async (msg) => {
  // Fired whenever a message is only deleted in your own view.
  console.log(msg.body); // message before it was deleted.
});

client.initialize();

app.listen(4000, () => {
  connectDB();
  console.log(`Server running on PORT 4000`);
});
