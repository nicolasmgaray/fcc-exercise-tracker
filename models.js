const mongoose = require('mongoose')
const Schema  = mongoose.Schema;
const shortid = require('shortid');

var logSchema = new Schema({
    userId: String,
    description: String,
    duration: Number,
    date:Date,
  _id: {
  'type': String,
  'default': shortid.generate
}
  });


var userSchema = new Schema({
    username:  String,  
  _id: {
  'type': String,
  'default': shortid.generate
},
  });

exports.User = mongoose.model('User', userSchema);

exports.Log = mongoose.model('Log', logSchema);