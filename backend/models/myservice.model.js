var mongoose = require('mongoose')
var timestamps = require('mongoose-timestamp');

var Schema = mongoose.Schema;

var ModelMyservice = new Schema({
  "owner": {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  "service": {
    type: Schema.Types.ObjectId,
    ref: 'Service'
  }
});

// create new User document
ModelMyservice.statics.create = function(owner, service) {

  var myservice = new this({
    owner: owner,
    service: service
  });






  return myservice.save()
};

// create new User document
ModelMyservice.statics.list = function(owner) {

  return this.find({
    owner: owner
  }).populate('service').sort({ createdAt: -1 }).exec();

};


ModelMyservice.plugin(timestamps);

module.exports = mongoose.model('Myservice', ModelMyservice);
