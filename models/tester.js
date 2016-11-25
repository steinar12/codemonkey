var tester = function() {

  var self = this;

  self.testSolution = function(solution,problem)
  {
    //console.log('solution: ' + solution);
    try {
      eval(solution);
      solution_function([1,2,3]);
      return 'No errors were found';
    }
    catch(err){
      return err;
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
  }

  self.gradeSolution = function(solution,problem)
  {
    var testResult = self.testSolution(solution,problem);



    if(testResult === 'No errors were found')
    {

      eval(solution);
      var n = self.generateTestArray(problem);
      var hrstart = process.hrtime();
       
      solution_function(n);

      var hrend = process.hrtime(hrstart);
      

      console.log('this solution took: ' + (hrend[1]/1000000) + ' milliseconds');
    }

    else
    {
      console.log('error was found: ' + testResult);
    }

  };



};



module.exports = tester;