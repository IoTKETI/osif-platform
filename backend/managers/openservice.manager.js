'use strict';

var debug = require("debug")("keti");
var _ = require("lodash");
var ServiceModel = require('../models/service.model.js');


function _listOpenservices() {

  return new Promise((resolve, reject)=>{

    try{
      ServiceModel.listOpenservices()
        .then((openserviceList)=>{
          openserviceList = openserviceList.map((item)=>{

            item.userCount = item.referenced.length;

            var properties = [
              "openData",
              "serviceName",
              "versionName",
              "versionCode",
              "owner",
              "serviceId",
              "updatedAt",
              "createdAt",
              "referenced",
              "userCount"
            ]
            return _.pick(item, properties);
          });

          resolve(openserviceList);
        })

        .catch((err)=>{
          reject(err);
        });
    }
    catch(ex) {
      reject(ex);
    }

  });

}

/**
 * Expose 'CompositedVoManager'
 */
module.exports.listOpenservices = _listOpenservices;

