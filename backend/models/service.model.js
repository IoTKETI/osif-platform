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
  "serviceDesc": String,
  "versionCode": {
    "major": Number,
    "minor": Number,
    "revision": Number
  },
  "creator": String,
  "owner": {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  "open": Boolean,
  "openData": {
    "local": Schema.Types.Mixed,
    "global": Schema.Types.Mixed
  }
});

// create new User document
ModelService.statics.create = function(owner, serviceProfile) {

  serviceProfile.owner = owner;
  var service = new this(serviceProfile);

  return service.save()
};

ModelService.statics.listOpenservices = function(current, rowsPerPage) {

  current = current || 1;
  rowsPerPage = rowsPerPage || 30;

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
          
          // Stage 2
          {
            $lookup: {
              "from" : "users",
              "foreignField" : "_id",
              "localField" : "owner",
              "as" : "owner"
            }
          },

          // Stage 3
          {
            $project: {
              "userCount": {
                $size: { "$ifNull": [ "$referenced", [] ]}
              },
              "referenced": 1,
              "openData" : 1,
              "serviceName" : 1,
              "versionName" : 1,
              "versionCode" : 1,
              "open" : 1,
              "owner" : { $arrayElemAt: [ {"$ifNull": ["$owner", [null]]}, 0]},
              "serviceId" : 1,
              "updatedAt" : 1,
              "createdAt" : 1
            }
          },

          // Stage 4
          {
            $sort: {
              "createdAt": -1
            }
          },

          {
            $facet: {
              metadata: [ { $count: "total" }, { $addFields: { current: current, rowsPerPage: rowsPerPage } } ],
              data: [ { $skip: (current-1) * rowsPerPage }, { $limit: rowsPerPage } ]
            }
          }

        ])

        .allowDiskUse(true)
        .cursor({ batchSize: 100 })
        .exec();

      var result = null;
      cursor.on('data', (doc)=>{
        result = doc;
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


ModelService.statics.listMyservices = function(owner) {

  var ownerId = owner._id  ;


  return new Promise((resolve, reject)=>{
    try {

      var cursor = this.aggregate(
        // Pipeline
        [
           // Stage 1
          {
            $lookup: {
              "from" : "myservices",
              "foreignField" : "service",
              "localField" : "_id",
              "as" : "referenced"
            }
          },

          // Stage 2
          {
            $lookup: {
              "from" : "users",
              "foreignField" : "_id",
              "localField" : "owner",
              "as" : "owner"
            }
          },

          // Stage 3
          {
            $project: {
              "userCount": {
                $size: { "$ifNull": [ "$referenced", [] ]}
              },
              "refuser": {"$indexOfArray": ["$referenced.owner",  ownerId]},
              "openData" : 1,
              "serviceName" : 1,
              "versionName" : 1,
              "versionCode" : 1,
              "open" : 1,
              "owner" : { $arrayElemAt: [ {"$ifNull": ["$owner", [null]]}, 0]},
              "serviceId" : 1,
              "updatedAt" : 1,
              "createdAt" : 1
            }
          },

          // Stage 4
          {
            $match: {
              "$or" : [
                {"owner._id": ownerId},
                {"refuser": {$ne: -1}}
              ]
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
      })
      .on('error', (err)=>{
        reject(err);
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
