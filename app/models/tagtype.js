var mongoose    = require('mongoose');
var validate    = require('mongoose-validator');
var Schema      = mongoose.Schema;

var tagTypeSchema = new Schema({
  tagname: {type: String, required: true, unique: true}
})

module.exports = mongoose.model('TagType', tagTypeSchema)
