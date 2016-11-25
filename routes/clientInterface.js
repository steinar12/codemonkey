var express = require('express');
var router = express.Router();
var databaseInterfaceModule = require('../models/databaseInterface');
var testerModule = require('../models/tester');

var tester = new testerModule();
var databaseInterface = new databaseInterfaceModule();

function isNameTaken(taken)
{
	console.log('name is taken: ' + taken);
}

function sendToClient(data)
{
	res.send(data);
}

//databaseInterface.init();
//databaseInterface.insertScore('trimbóni','Sort','13337777',isNameTaken);

var fun = 'function tester(text) {abababafsfs console.log(text)}';
tester.testSolution(fun,'sort');
//var func = eval(fun);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
