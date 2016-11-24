var express = require('express');
var router = express.Router();
var databaseInterfaceModule = require('../models/databaseInterface');
var databaseInterface = new databaseInterfaceModule();

databaseInterface.init();
databaseInterface.getScores();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
