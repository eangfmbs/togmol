var mongoose    = require('mongoose');
var validate    = require('mongoose-validator');
var Schema      = mongoose.Schema;

var commentSchema = new Schema({
  comment: {type: String, required: true},
  image: {type: String, required: false},
  vote: {type: Number, required: true, default: 0},
  date: {type: Date, required: true, default: Date.now},
  username: {type: String, required: true},
  statusid: {type: String, required: true}
})

module.exports = mongoose.model('Comment', commentSchema);
