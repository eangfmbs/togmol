var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;



var statusSchema = new Schema({
  title: {type: String, required: true},
  content: {type: String, required: false},
  totallike: {type: Number, required: false, default: 0},
  statusview: {type: Number, required: false, default: 0},
  totalcomment: {type: Number, required: false, default: 0},
  totalshare: {type: Number, required: false, default: 0},
  date: {type: Date, required: true, default: Date.now},
  username: {type: String, required: true}
})

module.exports = mongoose.model('Status', statusSchema);
