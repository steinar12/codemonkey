// A testing module.
// It's used to test the user's code submission in various ways.

var tester = function() {
  var nanoTimer = require('nanotimer');
  var timeout = require('node-timeout');
  var async = require('async');
  var timer = require('intelli-timer');
  var Promise = require('bluebird');
  var childProcess = require('child_process');
  var sandbox = require('sandbox');
  var problems = {};
  

  var self = this;

  // Takes the text input from the client and converts it into actual code.
  // Runs the code in a sandbox (safe environment).
  self.examineSolution = function(solution, problem, deliverResults) {

    var string_func = "function speedtest_function(solution_function, param) {var start = new Date();var totalTime = 0;for (var i = 0; i < 50; i++) {solution_function(param);}    var end = new Date() - start; var time = end/50; return time;}";

    s = new sandbox();
    s.options.timeout = 5000;
    var param1 = problems[problem].param1;
    var answer1 = problems[problem].answer1;
    var param2 = problems[problem].param2;
    var answer2 = problems[problem].answer2;
    var outerfunction = "function wrapping_function(param1,param2,solution,speedtest) {eval(speedtest); eval(solution); var response = {res1:'', res2:'', speed1:'',}; " +
      " response.res1 = solution_function(param1); response.speed1 = speedtest_function(solution_function,param1);  " +
      "response.res2 = solution_function(param2); " +
      "return response;}";


    var speedtest = string_func;
    
    var stringversion = "(" + outerfunction + ")";
    
    var parameters = "('" + param1 + "','" + param2 + "','" + solution + "','" + speedtest + "')";
    var stringToRun = stringversion + parameters;


    s.run(stringToRun, function(output) {
      console.log(output.result);
      self.handleResult(output.result, problem, deliverResults);
    });

  };

  // Returns a score based on the time complexity of the solution.
  self.growthScore = function(time1, problem) {
    /*var ratio = time1 / time2;
    var ratioSquared = ratio * ratio;*/
    var coefficient = problems[problem].coefficient;
    //var score = Math.floor(ratioSquared * coefficient);
    var score = Math.floor(coefficient/time1);
    //var roundedScore = Math.floor(score/5);
    return score;
  }

  // Handles the code from the client. If it's not real code, then the client is notified.
  // If it's not the correct answer, the client is notified  etc.
  self.handleResult = function(result, problem, deliverResults) {

    var resp = {
      type: '',
      message: '',
    }

    if(result === 'TimeoutError')
    {
      resp.type = 'Error',
      resp.message = 'Your program timed out! Check if you have any infinite loops or endless recursions';
      deliverResults(resp,problem);
      return;
    }
    result = JSON.stringify(eval("(" + result + ")"));
    result = JSON.parse(result);

    if (result !== null && typeof result === 'object') {
      
      
      var answer1 = problems[problem].answer1;
      var answer2 = problems[problem].answer2;

      var correctAnswer1 = self.compareToAnswer(result.res1, problem, answer1);
      var correctAnswer2 = self.compareToAnswer(result.res2, problem, answer2);
      if (correctAnswer1 && correctAnswer2) {
        resp.type = 'Score';
        resp.message = self.growthScore(result.speed1,problem);
        deliverResults(resp, problem);
        return;
      } else {
        resp.type = 'Answer';
        resp.message = 'Incorrect';
        deliverResults(resp, problem);
        return;
      }
    }

    resp.type = 'Error';
    resp.message = result;
    deliverResults(resp, problem);

  };

  // Checks whether to arrays are equal or not.
  self.equalArrays = function(array1, array2) {
    var equalLength = array1.length === array2.length;
    if (!equalLength) return false;
    for (var i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  }

  // Checks if the answer is correct.
  self.compareToAnswer = function(result, problem, answer) {

    switch (problem) {
      case 'The knight in the staircase':
        {
          var solutionIsCorrect;
          if (typeof(result) === "undefined") return false;
          if (Number.isInteger(result) === false) return false;
          solutionIsCorrect = (parseInt(result) === parseInt(answer));
          return solutionIsCorrect;
        }
        break;
      case 'Primefactors':
        {
          var solutionIsCorrect;
          if (typeof(result) === "undefined") return false;
          if (result.constructor !== Array) return false;
          solutionIsCorrect = self.equalArrays(result, answer);
          return solutionIsCorrect;
        }
        break;
      default:
        return false;
        
    }

    return false;
  };

  // All the parameter that are passed into the functions that the users create. (based on which problem they are solving)
  self.defineParameters = function() {
    var answerx = [2,2,3,3,3,5,7,41887];
    var answery = [2,2,2,3,3,3,5,7,41887];
    problems['Primefactors'] = {
      param1: 4*39583215,
      answer1: answerx,
      param2: 8*39583215,
      answer2: answery,
      coefficient: 100,
    }

    
    problems['The knight in the staircase'] = {
      param1: 3467,
      answer1: 499,
      param2: 2*3467,
      answer2: 913,
      coefficient: 300,
    }

  }




};

module.exports = tester;