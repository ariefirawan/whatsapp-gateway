const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reply = new Schema({
  message: {
    type: String,
    require: true,
  },
  replyMsg: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('Message', reply);
