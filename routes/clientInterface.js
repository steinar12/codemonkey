var express = require('express');
var router = express.Router();
var databaseInterfaceModule = require('../models/databaseInterface');
var testerModule = require('../models/tester');

var tester = new testerModule();
var databaseInterface = new databaseInterfaceModule();
databaseInterface.init();


function submitScore(player,problem,score,isNameTaken)
{
	databaseInterface.insert(player,problem,score,isNameTaken);

}
function isNameTaken(taken)
{
	sendToClient(taken);
}

function sendToClient(response)
{
	console.log(response);
	//res.send(response);
}

function gradeSolution(solution,problem,sendToClient)
{
	var response = tester.gradeSolution(solution,problem);
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

function loadProblems()
{
	var problems_with_scores = [];

	function addHighscoreToProblem(problem,scores)
	{
		scores.sort();
		scores.reverse();
		for(var i = 0; i<scores.length; i++)
		{
			if(i >= 10) return;
			score = 
			{
				rank : (i+1),
				name : scores[i].name,
				rank : scores[i].rank,
			}
			problem.highscores.push(score);
		}
		problems_with_scores.push(problem);
	}

	function deliverProblems(problems)
	{
		for(var i = 0; i<problems.length; i++)
		{

		}

		databaseInterface.getScores(problem,addHighscoreToProblem);

	}
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
			score : score,
		}

		scores.sort();
		scores.reverse();
		for(var i = 0; i<scores.length; i++)
		{
			if(score > scores[i])
			{
				response.message = 'You are ranked number '+(i+1)+' out of '+(scores.length+1)+' players';
				sendToClient(response);
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


var fun = 'return [2,2,23,149];';


var problem = 'primefactors';
gradeSolution(functionizeSolution(fun),problem,sendToClient);

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

router.post('/submitScore', function(req, res, next) {
	var playerName = req.body.name;
	var problem = req.body.problem;//eða id á þeim sem var að solvea
	//submitScore(playerName,problem,score,isNameTaken);
	
});

router.get('/loadProblems', function(req, res, next) {

	//loadProblems();
});



module.exports = router;
