var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;

// https://stackoverflow.com/questions/8455685/how-to-implement-post-tags-in-mongo

var statusSchema = new Schema({
  title: {type: String, required: true},
  content: {type: String, required: false},
  tags: [
    {type: String, required: false}
  ],
  // tags: [{
  //   tag: {type: String, required: true}
  // }
  // ],
  totallike: {type: Number, required: false, default: 0},
  statusview: {type: Number, required: false, default: 0},
  totalcomment: {type: Number, required: false, default: 0},
  totalshare: {type: Number, required: false, default: 0},
  date: {type: Date, required: true, default: Date.now},
  username: {type: String, required: true}
})

module.exports = mongoose.model('Status', statusSchema);
