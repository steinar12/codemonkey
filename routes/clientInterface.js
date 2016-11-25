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

function testSolution(solution,problem)
{
	response = tester.testSolution(solution,problem);
	return response;
}

function gradeSolution(solution,problem)
{
	response = tester.gradeSolution(solution,problem);
	return response;
}

function functionizeSolution(solution)
{
	var functionIzedSolution = 'function solution_function(n){'+solution+'}';
	return functionIzedSolution;
}

//databaseInterface.init();
//databaseInterface.insertScore('trimbóni','Sort','13337777',isNameTaken);

var fun = 'n.sort();';
//gradeSolution(functionizeSolution(fun));
//var func = eval(fun);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Submit solution */
router.post('/submit', function(req, res, next) {
	var solution = req.body.solution;
	var response = gradeSolution(functionizeSolution(solution));
	res.send("bla");
});

module.exports = router;
