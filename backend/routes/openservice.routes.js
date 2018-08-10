const express = require('express');
const router = express.Router();

const openserviceManager = require('../managers/openservice.manager.js')

/* GET control node types that supports backend. */
router.get('/', (req, res) => {
  openserviceManager.listOpenservices()
    .then(function(openserviceList){
      //  Success listControlNodeTypes
      res.status(200).send(openserviceList);

    }, function(err){
      //  Fail listControlNodeTypes
      res.status(500).send(err.message);
    })
});


module.exports = router;
