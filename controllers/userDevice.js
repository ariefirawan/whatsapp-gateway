const client = require('../middlewares/auth');
const qrcode = require('qrcode');

exports.qrCode = (req, res, next) => {
  client.on('qr', (qr) => {
    qrcode.toDataURL(qr, function (err, url) {
      if (err) {
        res.status(422).json({
          status: 'failed',
          errMessage: err,
        });
      }
      res.status(200).json({
        qr: url,
      });
    });
  });
};
