var express = require('express');
var router = express.Router();

var databaseInterfaceModule = require('../models/databaseInterface');
databaseInterface = new databaseInterfaceModule();
databaseInterface.init();
//databaseInterface.loadInitialData();
//databaseInterface.getScore('Siggi','Sort');
//databaseInterface.insertScore('Siggi','Sort','1337');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
