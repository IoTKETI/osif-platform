'use strict';

var _ = require("lodash");

var UserModel = require("../models/user.model.js");
var VSpaceModel = require("../models/model.vspace.js");


function _createVirtualSpace(userid, vspace) {
  return new Promise((resolve, reject)=>{
    try {

      UserModel.findOneByUserId(userid)
        .then((user)=>{
          return VSpaceModel.create(user, vspace.spaceType, vspace.spaceTitle, vspace.description, vspace.gpsPosition);
        })
        .then((vspace)=>{
          resolve(vspace);
        })
        .catch((err)=>{
          reject(err);
        });

    } catch(ex) {
      reject(ex);
    }
  });
}
function _listVirtualSpaces(userid) {

  return new Promise(function(resolve, reject){
    try {
      UserModel.findOneByUserId(userid)
        .then((owner)=>{
          return VSpaceModel.list(owner);
        })
        .then((vspaceList)=>{
          resolve(vspaceList);
        })
        .catch((err)=>{
          debug.log(err);

          reject(err);
        });
    } catch(ex) {
      debug.log(ex);
      reject(ex);
    }
  });

}


function _getVirtualSpace(userid, spaceId) {

  return new Promise(function(resolve, reject){
    try {

      UserModel.findOneByUserId(userid)
        .then((owner)=>{
          return VSpaceModel.findOneBySpaceId(owner, spaceId);
        })
        .then((vspace)=>{
          resolve(vspace);
        })
        .catch((err)=>{
          reject(err);
        });

    } catch(ex) {
      reject(ex);
    }
  });

}




/**
 * Expose 'VirtualSpaceManager'
 */
module.exports.createVirtualSpace = _createVirtualSpace;
module.exports.listVirtualSpaces = _listVirtualSpaces;
module.exports.getVirtualSpace = _getVirtualSpace;

