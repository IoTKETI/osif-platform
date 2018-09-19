'use strict';



var config = require('../backend/config.js')();


var database = require('../backend/models/mongodb.js');
database.connect(config);

var UserModel = require('../backend/models/user.model.js');
var ServiceModel = require('../backend/models/service.model.js');
var MyserviceModel = require('../backend/models/myservice.model.js');




var serviceNameList = [
  "led", "home", "device", "factory", "environment", "air-quality", "energy", "light", "plug", "temperature"
];

var serviceName2List = [
  "sensing", "control", "measure", "provider", "actuation"
];









function __padding(num, len) {
  var str = '000000000000000000000000000000000' + num;
  return str.substr(str.length - len);
}

var users = [];
var NUM_OF_USERS = 30;

for(var i=1; i < NUM_OF_USERS; i++) {
  users.push({
    username: 'IoTan' + __padding(i,2) + " KETI",
    userid: 'iot' + __padding(i,2) + '@keti.re.kr',
    password: 'user123'
  });
}


var services = [];
var NUM_OF_SERVICES = NUM_OF_USERS * 4;

for(var i=1; i < NUM_OF_SERVICES; i++) {
  var versionCode = {
    "major": parseInt(Math.random() * 2),
    "minor": parseInt(Math.random() * 5),
    "revision": parseInt(Math.random() * 10)
  };

  var localData = JSON.parse('[{"name": "local", "description": "local open data"}]');
  var globalData = JSON.parse('[{"name": "global", "description": "global open data"}]');


  var open = parseInt(Math.random()*4) % 2 == 0;
  var local = parseInt(Math.random()*5) % 2 == 0;
  var global = parseInt(Math.random()*8) % 2 == 0;

  var r1 = parseInt(Math.random() * serviceNameList.length);
  var r2 = parseInt(Math.random() * serviceName2List.length);

  var servicePrefix =  serviceName2List[r2] + '-' + serviceNameList[r1]


  var serviceName = servicePrefix + "-" + __padding(i,3);
  services.push({
    "serviceName": serviceName,
    "serviceDesc": "This service is for " +serviceName,
    "versionCode": versionCode,
    "open": open,
    "openData": {
      "local": local? localData : null,
      "global": global? globalData : null,
    }
  });
}

var dbUsers = null;
var dbServices = null;



UserModel.remove().exec()
  .then(()=>{

    console.log( 'complete remove users');
    return ServiceModel.remove().exec();
  })

  .then(()=>{
    console.log( 'complete remove services');

    return MyserviceModel.remove().exec();
  })

  .then(()=>{
    console.log( 'complete remove myservices');

    return Promise.all(
      users.map((user)=>{
        return  UserModel.create(user.username, user.userid, user.password);
      })
    )
  })

  .then((results)=> {
    console.log( 'complete create users');

    dbUsers = results;

    var createServicePromises = services.map((service) => {

      return new Promise((resolve, reject) => {

        var randomUserIndex = parseInt(Math.random() * users.length);

        var _owner = dbUsers[randomUserIndex];
        var _service = null;
        ServiceModel.create(_owner, service)
          .then((service) => {
            _service = service;
            return MyserviceModel.create(_owner, service);
          })

          .then((myservice) => {
            resolve(_service);
          })

          .catch((err) => {
            reject(err);
          })
        ;

      });
    });

    return Promise.all(createServicePromises);
  })

  .then((results)=>{

    console.log( 'complete create services');

    dbServices = results;

    var myservices = [];
    var NUM_OF_SERVICES = 5;

    for(var u=0; u < users.length; u++) {

      var user = dbUsers[u];
      var count = 0;

      for(var i=1; i < NUM_OF_SERVICES; i++) {

        var randomServiceIndex = parseInt(Math.random() * services.length);

        if(user.userid === dbServices[randomServiceIndex].owner.userid) {
          console.log( 'conflic' );
          continue;
        }

        myservices.push(
          {
            owner: user,
            service: dbServices[randomServiceIndex]
          }
        );

        dbServices[randomServiceIndex].refed = (dbServices[randomServiceIndex].refed||0) + 1;
        count ++;
      }
    }


    return Promise.all(myservices.map((item)=>{
      return MyserviceModel.create(item.owner, item.service);
    }));

  })

  .then((results)=>{
    console.log( 'complete create myservices');

    dbServices.map((item)=>{
      console.log( item.serviceName, item.refed);
    });
    console.log( 'FINISH' );
  });

