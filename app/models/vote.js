var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var voteSchema = new Schema({
  date: {type: Date, required: true, default: Date.now},
  username: {type: String, required: true},
  commentid: {type: String, required: true},
  statusid: {type: String, required: true}
})

module.exports = mongoose.model('Vote', voteSchema);
