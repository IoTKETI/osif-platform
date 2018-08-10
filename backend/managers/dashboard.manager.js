'use strict';

var _ = require("lodash");

var UserModel = require("../models/user.model.js");




var _testDashboardData = {
  'stats': [
    {
      "icon": "far fa-angry",
      "title": "F1",
      "value": "1111",
      "unit": "dollor",             //  number, string, plus, dollar, krw,
      "subIcon": "fas fas-group",
      "subText": "Just Updated"
    },
    {
      "icon": "fas fa-balance-scale",
      "title": "F1",
      "value": "2222",
      "unit": "dollor",             //  number, string, plus, dollar, krw,
      "subIcon": "fas fas-group",
      "subText": "Just Updated"
    },
    {
      "icon": "fas fa-user",
      "title": "F2",
      "value": "3333",
      "unit": "dollor",             //  number, string, plus, dollar, krw,
      "subIcon": "fas fas-group",
      "subText": "Just Updated"
    },
    {
      "icon": "fas fa-users",
      "title": "F3",
      "value": "4444",
      "unit": "dollor",             //  number, string, plus, dollar, krw,
      "subIcon": "fas fas-group",
      "subText": "Just Updated"
    }
  ],
  'chart': [
    {
      "icon": "fas fas-person",
      "title": "Website Views",
      "desc": "Descriptions",
      "subIcon": "fas fas-group",
      "subText": "Just Updated",
      "data": []
    },
    {
      "icon": "fas fas-person",
      "title": "Website Views",
      "desc": "Descriptions",
      "subIcon": "fas fas-group",
      "subText": "Just Updated",
      "data": []
    },
    {
      "icon": "fas fas-person",
      "title": "Website Views",
      "desc": "Descriptions",
      "subIcon": "fas fas-group",
      "subText": "Just Updated",
      "data": []
    }
  ]


};





function _getDashboardData(authToken) {
  return new Promise((resolve, reject)=>{
    try {
      if(authToken) {
        UserModel.findOneByUserId(authToken.userid)
          .then((user)=>{

            _testDashboardData.stats[0].title = 'login user: ' + authToken.username;

            resolve(_testDashboardData);
          })
          .then((vspace)=>{
            resolve(vspace);
          })
          .catch((err)=>{
            reject(err);
          });

      }
      else {
        _testDashboardData.stats[0].title = 'not logged in';

        resolve(_testDashboardData);
      }



    } catch(ex) {
      reject(ex);
    }
  });
}


/**
 * Expose 'dashboard.manager.js'
 */
module.exports.getDashboardData = _getDashboardData;
