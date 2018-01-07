var mongoose    = require('mongoose');
var validate    = require('mongoose-validator');
var Schema      = mongoose.Schema;

var tagSchema = new Schema({
  tagtypeid: [{type: String, required: true}],
  statusid: {type: String, required: true}
})

module.exports = mongoose.model('Tag', tagSchema);
