const fs = require('fs');
const { Client } = require('whatsapp-web.js');

const catchAsyncErrors = require('./catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}
// You can use an existing session and avoid scanning a QR code by adding a "session" object to the client options.
// This object must include WABrowserId, WASecretBundle, WAToken1 and WAToken2.

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    sessionCfg = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
      if (err) {
        return next(
          new ErrorHandler('Login first to access this resources', 401)
        );
      }
    });
  });
});

const client = new Client({
  puppeteer: { headless: true },
  session: sessionCfg,
});

module.exports = client;
