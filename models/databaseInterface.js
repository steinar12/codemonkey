var databaseInterface = function() {
  var self = this;
  var fs = require("fs");
  var file = "codemonkey.db";
  var exists = fs.existsSync(file);
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(file);

  // initialises the database
  self.init = function() {
    db.serialize(function() {
      if (!exists) {
        db.run("CREATE TABLE PLAYERS (_id INTEGER PRIMARY KEY, name TEXT)");
        db.run("CREATE TABLE PROBLEMS (_id INTEGER PRIMARY KEY, title TEXT, description TEXT, difficulty TEXT)");
        db.run("CREATE TABLE SCORES (_id INTEGER PRIMARY KEY, score INTEGER, _player_id INTEGER, _problem_id INTEGER,"+
               " FOREIGN KEY(_player_id) REFERENCES PLAYER(_id), FOREIGN KEY(_problem_id) REFERENCES PROBLEMS(_id))");
        
        console.log('Database did not exist before, created a new one!');
        self.loadInitialData();
        
      }    

    });

  };

    /**
   * Setur inn öll upphafsgögn, öll problem og fleira
   * 
   */       
  self.loadInitialData = function() {
     
     //TEST DATA
     var stmt = db.prepare('INSERT INTO PLAYERS VALUES (?,?)');
     stmt.run(null,'Siggi');
     stmt.run(null,'Kalli');
     stmt.run(null,'Tralli');
     stmt.run(null,'Fralli');
     stmt.run(null,'Dalli');
     stmt.run(null,'Palli');

     stmt = db.prepare('INSERT INTO PROBLEMS VALUES (?,?,?,?)');
     for(var i = 0; i < problemss.length; i++){
       stmt.run(null, problemss[i].title, problemss[i].description, problemss[i].difficulty);
     }

     stmt = db.prepare('INSERT INTO SCORES VALUES (?,?,?,?)');
     stmt.run(null,'5','1','1');
     stmt.run(null,'1','2','1');
     stmt.run(null,'5','3','1');
     stmt.run(null,'2','4','1');
     stmt.run(null,'3','5','1');
     stmt.run(null,'3','6','1');
     console.log(problemss.length);
     for(var i = 0; i < problemss.length; i++){
        for(var n = 0; n < problemss[i].highscores.length; n++){
          var hsInfo = problemss[i].highscores[n];          
          this.insertScore(hsInfo.name, problemss[i].title, hsInfo.score);
        }
     }

  };

  // Gets highscores for a specific problem
    self.getHighScores = function(problem,deliverScores,problems) {

    var problemString = '';

    db.serialize(function() {
      
      var statement = 'SELECT score, name FROM SCORES JOIN PLAYERS ON PLAYERS._id = SCORES._player_id'+
                       ' JOIN PROBLEMS ON PROBLEMS._id = SCORES._problem_id WHERE PROBLEMS.title = ?';

      if (typeof problem === 'string') problemString = problem;
      else problemString = problem.title;

      var scores = [];
      db.each(statement, [problemString], function(err, row) {
        var score = 
        {
          score : row.score,
          name : row.name,
          problem : problem,
        };
        scores.push(score);

      }, function() {
        
        deliverScores(scores,problem,problems);
       
                  
      });
      
    });

  };
  


   /**
   * Nær í öll score fyrir tiltekið problem
   * 
   * @param {problem} strengur sem inniheldur titil á vandamáli
   *
   * @callback {deliverScores} Kallar á deliverScores með öllum stigum sem fundust sem parameter
   */

  self.getScores = function(problem,deliverScores) {

    var problemString = '';

    db.serialize(function() {
      
      var statement = 'SELECT score, name FROM SCORES JOIN PLAYERS ON PLAYERS._id = SCORES._player_id'+
                       ' JOIN PROBLEMS ON PROBLEMS._id = SCORES._problem_id WHERE PROBLEMS.title = ?';


      if (typeof problem === 'string') problemString = problem;
      else problemString = problem.title;
      var scores = [];
      db.each(statement, [problemString], function(err, row) {
        var score = 
        {
          score : row.score,
          name : row.name,
          problem : problem,
        };
        scores.push(score);

      }, function() {
        deliverScores(scores,problem);
       
                  
      });
      
    });

  };

  // Get's all problems from the database
  self.getProblems = function(deliverProblems){

     db.serialize(function() {
      
      var problems = [];
      var statement = 'SELECT * FROM PROBLEMS';
      db.each(statement, function(err, row) {

        var problem = {
          id : row._id,
          title : row.title,
          description : row.description,
          difficulty : row.difficulty,
          highscores : [],
        }
        problems.push(problem);       

      }, function() {

        deliverProblems(problems);       
                  
      });
      
    });

  };

   /**
   * Bætir við nýju scorei fyrir tiltekið problem ef ekki er búið að skrá 
   * það nafn núþegar fyrir problemið
   * 
   *
   * @param {player} strengur sem inniheldur nafn á player
   * @param {problem} strengur sem inniheldur titil á vandamáli
   * @param {score} strengur sem inniheldur stig sem playerinn fékk
   *
   */
  self.insertScore = function(player,problem,score) {
    db.serialize(function() {


              var stmt = db.prepare('INSERT INTO PLAYERS VALUES (?,?)');
              stmt.run(null,player);
              var selectIds = 'SELECT PLAYERS._id AS player_id, PROBLEMS._id AS problem_id from PLAYERS,PROBLEMS where PLAYERS.name = ? AND PROBLEMS.title = ?'
  
              var ids = [];
              db.each(selectIds, [player,problem], function(err, row) {
                var id =
                {
                  player_id : row.player_id,
                  problem_id : row.problem_id,
                }
                

                ids.push(id);
                

              }, function() {

                  player_id = ids[0].player_id;
                  problem_id = ids[0].problem_id;

                  stmt = db.prepare('INSERT INTO SCORES VALUES (?,?,?,?)');
                  stmt.run(null,score,player_id,problem_id);                    
                  
                  
              });

            
            

        });




  };

var description = 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies! This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!';

// This is the data for all the problems, it's only here temporarilly. They are also stored in the database.
var problemss = [
  {
    difficulty: 'Easy',
    title: 'Trees in a graveyard (Placeholder)',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Easy',
    title: 'Primefactors',
    highscores: [{rank: 1, name: 'Arnold', score: 43}, {rank: 1, name: 'Sly', score: 42}, {rank: 1, name: 'Bono', score: 44}, {rank: 1, name: 'Arnold', score: 43}, {rank: 1, name: 'Sly', score: 42}, {rank: 1, name: 'Bono', score: 44}, {rank: 1, name: 'Arnold', score: 43}, {rank: 1, name: 'Sly', score: 42}, {rank: 1, name: 'Bono', score: 44}],
    description: 'Find the primefactors of "N".  (Return an array like this one: [f1,f2,f3...fx])'
  },
  {
    difficulty: 'Easy',
    title: 'Trouble in paradise (Placeholder)',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Easy',
    title: 'One million grasshoppers (Placeholder)',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Easy',
    title: 'Romeo is looking for a lover (Placeholder)',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Medium',
    title: 'The knight in the staircase',
    highscores: [{rank: 1, name: 'Arnold', score: 43}, {rank: 1, name: 'Sly', score: 42}, {rank: 1, name: 'Bono', score: 44}, {rank: 1, name: 'Arnold', score: 43}, {rank: 1, name: 'Sly', score: 42}, {rank: 1, name: 'Bono', score: 44}, {rank: 1, name: 'Arnold', score: 43}, {rank: 1, name: 'Sly', score: 42}, {rank: 1, name: 'Bono', score: 44}],
    description: 'A brave knight wants to climb the stairs to the highest tower and rescue the princess. The staircase has "N" steps and they are all marked with a number. The first step is marked with the number "1", the second one with the number "2" and so on. The knight really dislikes prime numbers, but he loves the Fibonacci sequence, so he plans on skipping every step that is marked with a prime number, unless the number is also part of the Fibonacci sequence. How many steps will the knight have to skip over?'
  },
  {
    difficulty: 'Medium',
    title: 'Banking gone wrong (Placeholder)',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Medium',
    title: 'Cowboys and wizards (Placeholder)',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Medium',
    title: 'Which soup is the coldest? (Placeholder)',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Medium',
    title: 'Love and racketball (Placeholder)',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Hard',
    title: 'Prince of Russia (Placeholder)',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Hard',
    title: 'Three golden coins and a goat (Placeholder)',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Hard',
    title: 'Day at the zoo (Placeholder)',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Hard',
    title: 'Counting raindrops (Placeholder)',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Hard',
    title: 'Circus of death (Placeholder)',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  }
];







};



module.exports = databaseInterface;