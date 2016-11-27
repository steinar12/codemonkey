var express = require('express');
var router = express.Router();
var databaseInterfaceModule = require('../models/databaseInterface');
var testerModule = require('../models/tester');

var tester = new testerModule();
var databaseInterface = new databaseInterfaceModule();
databaseInterface.init();
var problems_with_scores = [];
var unregistered_scores = [];

function submitScore(player,problem,score,sendToClient,id)
{
	var matchedScore = false;
	for(var i = 0; i<unregistered_scores.length; i++)
	{
		if(id === unregistered_scores[i].id && problem === unregistered_scores[i].problem && score === unregistered_scores[i].score)
		{
			matchedScore = true;			
		}
	}

	if(!matchedScore)
	{
		sendToClient('Nice try cheater');
		return;
	}

	function isNameTaken(taken)
	{
		if(taken) {
			sendToClient('Name is taken');
		}
		else {
			sendToClient('Name is not taken');
		}
		sendToClient(taken);
	}

	databaseInterface.insert(player,problem,score,isNameTaken);

}

function gradeSolution(solution,problem,sendToClient,id)
{
	var response = tester.gradeSolution(solution,problem);
	console.log('type after grading solution: ' + response.type);
	switch(response.type) {
        case 'Error':
        	sendToClient(response);
        	break;
         case 'Answer':
        	sendToClient(response);
        	break;
         case 'Score':
         	{
         		var unregistered_score = 
         		{
         			id : id,
         			score : response.message,
         			problem : problem,
         		}
         		unregistered_scores.push(unregistered_score);
         		determineRank(response.message,problem,sendToClient);

         	}         	
            break;
        default:
            console.log('failed to grade solution');
    }
	
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
			type : 'Rank',
			message : '',
			score : score,
		}

		scores.sort(function(a,b) {
    		return b.score - a.score;
  		});
		
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

function functionizeSolution(solution)
{
	var functionIzedSolution = 'function solution_function(n){'+solution+'}';
	return functionIzedSolution;
}


/*	function sendToClient(response)
	{
		console.log('SENDING TO CLIENT');
		console.log(response);
		//res.send(response);
	}

var fun = '';*/


//var problem = 'primefactors';
//gradeSolution(functionizeSolution(fun),problem,sendToClient);
//loadProblems();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

/* Submit solution */
router.post('/submit', function(req, res, next) {
	//console.log('this is our session id');
	//console.log(req.session.id);

	function sendToClient(response)
	{
		console.log('SENDING TO CLIENT');
		res.send(response);
	}

	var solution = req.body.solution;
	//var problem = req.body.title;
	var problem = 'primefactors';
	var id = req.session.id;
	gradeSolution(functionizeSolution(solution),problem,sendToClient,id);
});

router.post('/submitScore', function(req, res, next) {
	var playerName = req.body.name;
	var problem = req.body.problem;
	var id = req.session.id;
	//eða id á þeim sem var að solvea
	//submitScore(playerName,problem,score,isNameTaken);
	
});

router.get('/loadProblems', function(req, res, next) {

	function sendToClient(response)
	{
		console.log('SENDING TO CLIENT');
		res.send(response);
	}

	loadProblems(sendToClient);
});



module.exports = router;
