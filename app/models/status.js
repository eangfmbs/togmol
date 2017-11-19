var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;



var statusSchema = new Schema({
  title: {type: String, required: true},
  content: {type: String, required: false},
  totallike: {type: String, required: false, default: '0'},
  statusview: {type: String, required: false, default: '0'},
  totalcomment: {type: String, required: false, default: '0'},
  date: {type: Date, required: true, default: Date.now},
  username: {type: String, required: true}
})

module.exports = mongoose.model('Status', statusSchema);
