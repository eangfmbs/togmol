var mongoose    = require('mongoose');
var validate   = require('mongoose-validator');
var Schema      = mongoose.Schema;

var likeSchema = new Schema({
  date: {type: Date, required: true, default: Date.now},
  username: {type: String, required: true},
  statusid: {type: String, required: true}
})

module.exports = mongoose.model('Like', likeSchema);
