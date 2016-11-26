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

function testSolution(solution,problem)
{
	response = tester.testSolution(solution,problem);
	return response;
}

function sendToClient(response)
{
	console.log(response);
	//res.send(response);
}

function gradeSolution(solution,problem,sendToClient)
{
	response = tester.gradeSolution(solution,problem);
	switch(response.type) {
        case 'error':
        	sendToClient(response);
         case 'answer':
        	sendToClient(response);
         case 'score':
         	determineRank(response.message,problem,sendToClient);
            break;
        default:
            console.log('failed to grade solution');
    }

	sendToClient(response);
}

function determineRank(score,problem,sendToClient)
{
	function createResponse(scores)
	{
		console.log('length of scores: '+scores.length);
		problem_scores = [];
		for(var i = 0; i<scores.length; i++)
		{
			problem_scores.push(scores.score);
		}
		var response =
		{
			type : 'rank',
			message : '',
		}

		scores.sort();
		scores.reverse();
		for(var i = 0; i<scores.length; i++)
		{
			if(score > scores[i])
			{
				response.message = 'You are ranked number '+(i+1)+' out of '+scores.length+' players';
				sendToClient(response);
			}
		}

		response.message = 'You are ranked number '+(scores.length+1)+' out of '+scores.length+' players';
		sendToClient(response);
	}

	databaseInterface.getScores(problem,createResponse);

}




function functionizeSolution(solution)
{
	var functionIzedSolution = 'function solution_function(n){'+solution+'}';
	return functionIzedSolution;
}

//databaseInterface.init();
//databaseInterface.insertScore('trimbóni','Sort','13337777',isNameTaken);


var fun = 'return [2,2,23,149];';

//var response = testSolution(functionizeSolution(fun));
//console.log('RESPONSE: ' + response);

var problem = 'primefactors';
gradeSolution(functionizeSolution(fun),problem,sendToClient);
//console.log('type of response: ' + response.type);
//console.log('message of response: ' + response.message);




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Submit solution */
router.post('/submit', function(req, res, next) {
	var solution = req.body.solution;

	//gradeSolution(functionizeSolution(solution),problem,sendToClient);
	//res.send(response);
});

module.exports = router;
