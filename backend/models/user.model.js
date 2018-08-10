var mongoose = require('mongoose')
var timestamps = require('mongoose-timestamp');
var crypto = require('crypto');

var Schema = mongoose.Schema;

var UserModel = new Schema({
  username: String,
  userid: String,
  password: String,
  admin: { type: Boolean, default: false }
})


var config = global.CONFIG;
if(!config) {
  config = require('../config.js')();
}

// create new User document
UserModel.statics.create = function(username, userid, password) {
  const encrypted = crypto.createHmac('sha1', config.security.authSecret)
    .update(password)
    .digest('base64');

  var user = new this({
    username,
    userid,
    password: encrypted
  })

  // return the Promise
  return user.save()
}

// find one user by using userid
UserModel.statics.findOneByUserId = function(userid) {
  return this.findOne({
    userid
  }).exec()
}


// verify the password of the User documment
UserModel.methods.verify = function(password) {
  const encrypted = crypto.createHmac('sha1', config.security.authSecret)
    .update(password)
    .digest('base64');

  return this.password === encrypted
}

UserModel.methods.assignAdmin = function() {
  this.admin = true
  return this.save()
}

UserModel.plugin(timestamps);

module.exports = mongoose.model('User', UserModel)
