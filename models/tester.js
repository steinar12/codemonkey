var tester = function() {

  var self = this;

  self.testSolution = function(solution,problem)
  {
    

    try {
      eval(solution);
      
    }
    catch(err){
      return error;
    }

    //tester('PINGGGGGDING');

  }



};



module.exports = tester;