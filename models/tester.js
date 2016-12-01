var tester = function() {
  var nanoTimer = require('nanotimer');
  var timeout = require('node-timeout');
  var async = require('async');
  var timer = require('intelli-timer');
  var Promise = require('bluebird');
  var childProcess = require('child_process');
  var sandbox = require('sandbox');
  var problems = {};


  //yourVariable !== null && typeof yourVariable === 'object'

  var self = this;


  self.examineSolution = function(solution, problem, deliverResults) {

    var string_func = "function speedtest_function(solution_function, param) {var start = new Date();var totalTime = 0;for (var i = 0; i < 20; i++) {solution_function(param);}    var end = new Date() - start; var time = end/20; return time;}";

    s = new sandbox();
    s.options.timeout = 5000;
    var param1 = problems[problem].param1;
    var answer1 = problems[problem].answer1;
    var param2 = problems[problem].param2;
    var answer2 = problems[problem].answer2;
    var outerfunction = "function wrapping_function(param1,param2,solution,speedtest) {eval(speedtest); eval(solution); var response = {res1:'', res2:'', speed1:'', speed2:'',}; " +
      " response.res1 = solution_function(param1); response.speed1 = speedtest_function(solution_function,param1);  " +
      "response.res2 = solution_function(param2); response.speed2 = speedtest_function(solution_function,param2); " +
      "return response;}";


    var speedtest = string_func;
    
    var stringversion = "(" + outerfunction + ")";
    
    var parameters = "('" + param1 + "','" + param2 + "','" + solution + "','" + speedtest + "')";
    var stringToRun = stringversion + parameters;


    s.run(stringToRun, function(output) {
      console.log("Example 2: " + output.result + "\n");
      self.handleResult(output.result, problem, deliverResults);
    });

  };

  self.growthScore = function(time1, time2, problem) {
    var ratio = time1 / time2;
    var ratioSquared = ratio * ratio;
    var coefficient = problems[problem].coefficient;
    var score = Math.floor(ratioSquared * coefficient);
    return score;
  }


  self.handleResult = function(result, problem, deliverResults) {

    var resp = {
      type: '',
      message: '',
    }

    console.log('PRINTING RESULT');
    console.log(result);
    console.log('type of result: ' + typeof result);

    
    if (result !== null && typeof result === 'object') {
      result = JSON.stringify(eval("(" + result + ")"));
      result = JSON.parse(result);
      
      var answer1 = problems[problem].answer1;
      var answer2 = problems[problem].answer2;

      var correctAnswer1 = self.compareToAnswer(result.res1, problem, answer1);
      var correctAnswer2 = self.compareToAnswer(result.res2, problem, answer2);
      if (correctAnswer1 && correctAnswer2) {
        resp.type = 'Score';
        resp.message = self.growthScore(result.speed1, result.speed2,problem);
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

  self.compareToAnswer = function(result, problem, answer) {

    switch (problem) {
      case 'The knight in the staircase':
        {
          var solutionIsCorrect;
          if (typeof(result) === "undefined") return false;
          if (Number.isInteger(result)) return false;
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
        
    }

    return false;
  };

  self.defineParameters = function() {
    var answerx = [2, 7, 28273727];
    var answery = [2, 2, 7, 28273727];
    problems['Primefactors'] = {
      param1: 395832178,
      answer1: answerx,
      param2: 2*395832178,
      answer2: answery,
      coefficient: 2500,
    }

    
    problems['The knight in the staircase'] = {
      param1: 346789,
      answer1: 29847,
      param2: 2*346789,
      answer2: 56239,
      coefficient: 2500,
    }

  }




};

module.exports = tester;