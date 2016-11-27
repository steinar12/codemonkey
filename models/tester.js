var tester = function() {
  var nanoTimer = require('nanotimer');
  var timeout = require('node-timeout');
  var async = require('async');
  var timer = require('intelli-timer');
  var Promise = require('bluebird');

  var primefactors_param = 13708;
  var primefactors_answer = [2,2,23,149];

  var self = this;

  self.testSolution = function(solution,problem)
  {
    //console.log('solution: ' + solution);
    try {


      eval(solution);

      /*function do_something()
      {
        console.log('made it to test');

        for(var i = 0; i<100000; i++)
        {
          console.log('ding ding: ' + i);
        }

      }

      var fun = do_something();

      function setToNull()
      {
        fun = null;
      }


      setTimeout(fun,1000);
      fun();


      






      function testfunc() {
        var fail = false;
        return new Promise(function(resolve, reject){
          do_something();          
        });

      }

      testfunc().timeout(100).then(function() {
            console.log('resolved!');
        
      }).catch(Promise.TimeoutError, function(e) {
        console.log("could not execute file within 1000ms");
      });*/

          
      
      
      
      
/*
      timer.countdown(20, function(timerCallback){  // time limit is 0.5 second 
        
        //test();
        //timerCallback();

        do_something('err',function(){
            
            timerCallback();    // timerCallback() after finish do_something() 
        });
     
    }, function(err){
     
        if(err) console.log(err);  // err is null when the task is completed in time 
        else console.log('success');
     
    });

*/    
      solution_function(500);
     
      return 'No errors were found';
    }
    catch(err){
      return 'The following error was found in your code: '+err;
      //return err;
    }

  }   


  self.generateTestArray = function(problem)
  {
    var arr = [];
    for(var i = 0; i<800000; i++)
    {
      arr.push(Math.floor((Math.random() * 50) + 1));
    }
    return arr;
  };

  self.convertToScore = function(time,problem)
  {
    var score = Math.ceil(time*100);
    return score;
  }

  self.gradeSolution = function(solution,problem)
  {

    var testResult = self.testSolution(solution,problem);

    var response = 
    {
      type: '',
      message: '',
    };

    if(testResult === 'No errors were found')
    {
      eval(solution);
      var isSolutionCorrect = self.compareToAnswer(solution_function,problem);
      if(isSolutionCorrect)
      {
        var time = self.speedTest(solution_function,problem);
        response.type = 'Score';
        response.message = self.convertToScore(time,problem);
        return response;
      } 
      else
      {
        response.type = 'Answer';
        response.message = 'Incorrect';
        return response;
      }
      
    }

    else
    {
      response.type = 'Error';
      response.message = testResult;
      return response;
    }

  };


  self.speedTest = function(solution_function,problem)
  {
    
    switch(problem) {
        case 'primefactors':
            {

            var hrstart = process.hrtime();

            solution_function(primefactors_param);

            var hrend = process.hrtime(hrstart);
            console.log('this solution took: ' + (hrend[1]/1000000) + ' milliseconds');
            return (hrend[1]/1000000);
            }
            break;
        default:
            console.log('this problem do not exist');
    }

  };


  self.equalArrays = function(array1,array2)
  {
    var equalLength = array1.length===array2.length;
    if(!equalLength) return false;
    for(var i = 0; i<array1.length; i++)
    {
      if(array1[i]!==array2[i]) 
      {
        return false;
      }
    }
    return true;
  }

  self.compareToAnswer = function(solution_function,problem)
  {    

    switch(problem) {
        case 'primefactors':
            {
              var solutionIsCorrect;
              var solution_res = solution_function(primefactors_param);
              if(typeof(solution_res) === "undefined") return false;
              if(solution_res.constructor !== Array) return false;
              solutionIsCorrect = self.equalArrays(solution_res,primefactors_answer);
              return solutionIsCorrect;

            }
            break;
        default:
            console.log('this problem does not exist');
    }

    return false;
  };


/*
  self.getParameters = function(problem)
  {
    switch(problem) {
        case 'primefactors':
            return primefactors_param;
            break;
        default:
            console.log('parameteres for this problem do not exist');
    }
      
  };
*/




};



module.exports = tester;