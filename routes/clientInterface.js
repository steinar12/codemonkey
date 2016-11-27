var express = require('express');
var router = express.Router();
var databaseInterfaceModule = require('../models/databaseInterface');
var testerModule = require('../models/tester');

var tester = new testerModule();
var databaseInterface = new databaseInterfaceModule();
databaseInterface.init();
var problems_with_scores = [];

function submitScore(player,problem,score,sendToClient)
{
	function isNameTaken(taken)
	{
		sendToClient(taken);
	}

	databaseInterface.insert(player,problem,score,isNameTaken);

}

function gradeSolution(solution,problem,sendToClient)
{
	var response = tester.gradeSolution(solution,problem);
	console.log('type after grading solution: ' + response.type);
	switch(response.type) {
        case 'error':
        	sendToClient(response);
        	break;
         case 'answer':
        	sendToClient(response);
        	break;
         case 'score':
         	determineRank(response.message,problem,sendToClient);
            break;
        default:
            console.log('failed to grade solution');
    }
	
}

function loadProblems(sendToClient)
{	
	problems_with_scores = [];

	function deliverProblems(problems)
	{
		
		function addHighscoreToProblem(scores,problem,original_problems)
		{
			scores.sort(function(a,b) {
	    		return b.score - a.score;
	  		});
			//scores.reverse();
			for(var i = 0; i<scores.length; i++)
			{
				if(i >= 10) return;
				score = 
				{
					rank : (i+1),
					name : scores[i].name,
					score : scores[i].score,
				}
				problem.highscores.push(score);
			}
			problems_with_scores.push(problem);
			if(problem.id >= original_problems.length) sendToClient(problems_with_scores);
		}

		for(var i = 0; i<problems.length; i++)
		{
			databaseInterface.getHighScores(problems[i],addHighscoreToProblem,problems);
		}		

	}

	databaseInterface.getProblems(deliverProblems);	
}

function determineRank(score,problem,sendToClient)
{
	console.log('entered determine rank');
	function createResponse(scores,problem)
	{
		var problem_scores = [];
		for(var i = 0; i<scores.length; i++)
		{
			problem_scores.push(scores.score);
		}
		var response =
		{
			type : 'rank',
			message : '',
			score : score,
		}

		scores.sort(function(a,b) {
    		return b.score - a.score;
  		});
		//scores.reverse();
		for(var i = 0; i<scores.length; i++)
		{
			
			if(score > scores[i].score)
			{
				response.message = 'You are ranked number '+(i+1)+' out of '+(scores.length+1)+' players';
				sendToClient(response);
				return;
			}
		}

		response.message = 'You are ranked number '+(scores.length+1)+' out of '+(scores.length+1)+' players';
		sendToClient(response);
	}

	databaseInterface.getScores(problem,createResponse);

}

function functionizeSolution(solution)
{
	var functionIzedSolution = 'function solution_function(n){'+solution+'}';
	return functionIzedSolution;
}


//var fun = 'return 50;';


var problem = 'primefactors';
//gradeSolution(functionizeSolution(fun),problem,sendToClient);
//loadProblems();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Submit solution */
router.post('/submit', function(req, res, next) {

	function sendToClient(response)
	{
		console.log('SENDING TO CLIENT');
		console.log(response);
		res.send(response);
	}

	var solution = req.body.solution;
	gradeSolution(functionizeSolution(solution),problem,sendToClient);	
});

router.post('/submitScore', function(req, res, next) {
	var playerName = req.body.name;
	var problem = req.body.problem;//eða id á þeim sem var að solvea
	//submitScore(playerName,problem,score,isNameTaken);
	
});

router.get('/loadProblems', function(req, res, next) {

	function sendToClient(response)
	{
		console.log('SENDING TO CLIENT');
		console.log(response);
		res.send(response);
	}

	loadProblems(sendToClient);
});



module.exports = router;
