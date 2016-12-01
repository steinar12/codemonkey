var express = require('express');
var fs = require('fs');
var router = express.Router();
var databaseInterfaceModule = require('../models/databaseInterface');
var testerModule = require('../models/tester');
var xss = require('xss');
var https = require('https');
var pem = require('pem');


var tester = new testerModule();
var databaseInterface = new databaseInterfaceModule();
databaseInterface.init();
var problems_with_scores = [];
var unregistered_scores = [];
var submitted_ids = {};
tester.defineParameters();
var counter = 0;

function submitScore(player,problem,sendToClient,id)
{
	var matchedScore = false;
	var score = '';
	for(var i = 0; i<unregistered_scores.length; i++)
	{		
		if(id === unregistered_scores[i].id && problem === unregistered_scores[i].problem)
		{
			matchedScore = true;
			score = unregistered_scores[i].score;
		}
	}

	if(!matchedScore)
	{
		console.log('Cheat detected');
		sendToClient('Nice try cheater');
		return;
	}

	databaseInterface.insertScore(player,problem,score);

}


function handleResponse(response,problem,sendToClient,id)
{
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

function gradeSolution(solution,problem,sendToClient,id)
{
	function deliverResults(response,problem)
	{
		handleResponse(response,problem,sendToClient,id);
	}

	tester.examineSolution(solution,problem,deliverResults);	
}

function determineRank(score,problem,sendToClient)
{	
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
			
			for(var i = 0; i<scores.length; i++)
			{
				if(i >= 10) break;
				score = 
				{
					rank : (i+1),
					name : scores[i].name,
					score : scores[i].score,
				}
				
				problem.highscores.push(score);
			}
			

			counter++;
			problems_with_scores.push(problem);

			if(problems_with_scores.length >= original_problems.length)
			{
				console.log('CONDITION MET');				
				sendToClient(problems_with_scores);
				problems_with_scores = [];
				return;
			}

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


/*function sendToClient(response)
{
	console.log(response);
	//res.send(response);
}*/

//var fun = 'function primefactors(n){ var factors = []; var i = 2; while(n > 1){   if(n % i === 0){ factors.push(i); n /= i; } else { i++;  } }  return factors;}return primefactors(n);'
//gradeSolution(functionizeSolution(fun),'Primefactors',sendToClient,'1');


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
	
});

/* Submit solution */
router.post('/submit', function(req, res, next) {

	var id = req.session.id;
	if(submitted_ids.hasOwnProperty(id))
	{
		if(submitted_ids[id] === 1)
		{
			console.log('Already calculating, returning!');
			return;
		}
	}
	function sendToClient(response)
	{
		submitted_ids[id] = 0;
		res.send(response);
	}
	
	solution = req.body.solution;
	solution = solution.replace(/(\r\n|\n|\r)/gm,"");
	var problem = xss(req.body.title || '');
	
	

	submitted_ids[id] = 1;
	
	gradeSolution(functionizeSolution(solution),problem,sendToClient,id);
});

router.post('/submitScore', function(req, res, next) {
	problems_with_scores = [];

	
	function sendToClient(response)
	{
		res.send(response);
	}

	
	var playerName = xss(req.body.name || '');
	var problem = xss(req.body.problem || '');
	var id = req.session.id;

		
	submitScore(playerName,problem,sendToClient,id);
	
});

router.post('/loadProblems', function(req, res, next) {

	function sendToClient(response)
	{
		res.send(response);
		
	}

	loadProblems(sendToClient);
});



module.exports = router;
