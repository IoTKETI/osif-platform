var mongoose = require('mongoose')
var timestamps = require('mongoose-timestamp');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var ModelService = new Schema({
  "serviceId": {
    type: String,
    default: shortid.generate
  },
  "serviceName": String,
  "versionName": String,
  "versionCode": String,
  "owner": {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  "open": Boolean,
  "openData": {
    "local": Schema.Types.Mixed,
    "global": Schema.Types.Mixed
  }
})

// create new User document
ModelService.statics.create = function(owner, serviceProfile) {

  serviceProfile.owner = owner;
  var service = new this(serviceProfile);

  return service.save()
};

ModelService.statics.listOpenservices = function() {

  return new Promise((resolve, reject)=>{
    try {

      var cursor = this.aggregate(
        // Pipeline
        [
          // Stage 1
          {
            $match: {
              "open": true
            }
          },

          // Stage 2
          {
            $lookup: {
              "from" : "myservices",
              "foreignField" : "service",
              "localField" : "_id",
              "as" : "referenced"
            }
          },

          // Stage 3
          {
            $project: {
              "userCount": {$size: { "$ifNull": [ "$referenced", [] ]}},
              "openData" : 1,
              "serviceName" : 1,
              "versionName" : 1,
              "versionCode" : 1,
              "open" : 1,
              "owner" : 1,
              "serviceId" : 1,
              "updatedAt" : 1,
              "createdAt" : 1
            }
          },

          // Stage 4
          {
            $sort: {
              "userCount": -1
            }
          }

        ])

        .allowDiskUse(true)
        .cursor({ batchSize: 100 })
        .exec();

      var result = [];
      cursor.on('data', (doc)=>{
        result.push(doc);
      })
      .on('end', ()=>{
        resolve(result);
      });
    }
    catch(ex) {
      debug.log('Exception: ', ex);
      reject(ex);
    }
  });
};

ModelService.plugin(timestamps);

module.exports = mongoose.model('Service', ModelService);
