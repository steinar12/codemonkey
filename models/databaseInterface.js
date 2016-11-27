var databaseInterface = function() {
  var self = this;
  var fs = require("fs");
  var file = "codemonkey.db";
  var exists = fs.existsSync(file);
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(file);


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
     console.log('loaded initial data');
     //TEST DATA
     var stmt = db.prepare('INSERT INTO PLAYERS VALUES (?,?)');
     stmt.run(null,'Siggi');
     stmt.run(null,'Kalli');
     stmt.run(null,'Tralli');
     stmt.run(null,'Fralli');
     stmt.run(null,'Dalli');
     stmt.run(null,'Palli');

     stmt = db.prepare('INSERT INTO PROBLEMS VALUES (?,?,?,?)');
     stmt.run(null,'Primefactors','Return an array containing the prime factors of n in ascending order','Easy');
     for(var i = 0; i < problemss.length; i++){
       stmt.run(null, problemss[i].title, problemss[i].description, problemss[i].difficulty);
     }

     stmt = db.prepare('INSERT INTO SCORES VALUES (?,?,?,?)');
     stmt.run(null,'69','1','1');
     stmt.run(null,'1','2','1');
     stmt.run(null,'5','3','1');
     stmt.run(null,'2','4','1');
     stmt.run(null,'10','5','1');
     stmt.run(null,'3','6','1');
     console.log(problemss.length);
     for(var i = 0; i < problemss.length; i++){
        for(var n = 0; n < problemss[i].highscores.length; n++){
          var hsInfo = problemss[i].highscores[n];
          //console.log("name:  " + hsInfo.name);
          //console.log("title:  " + problemss[i].title);
          //console.log("score:  " + hsInfo.score);
          this.insertScore(hsInfo.name, problemss[i].title, hsInfo.score);
        }
     }

  };

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

        /*db.each('SELECT * FROM PROBLEMS', function(err,row) {
          console.log('row from problems');
          console.log('title number'+row._id+': '+row.title);
        });*/


              var stmt = db.prepare('INSERT INTO PLAYERS VALUES (?,?)');
              stmt.run(null,player);
              console.log('inserted player: ' + player);
              var selectIds = 'SELECT PLAYERS._id AS player_id, PROBLEMS._id AS problem_id from PLAYERS,PROBLEMS where PLAYERS.name = ? AND PROBLEMS.title = ?'
                
              var ids = [];
              db.each(selectIds, [player,problem], function(err, row) {
                console.log(1);
                console.log('here is row');
                console.log(row);
                var id =
                {
                  player_id : row.player_id,
                  problem_id : row.problem_id,
                }
                console.log(2);

                ids.push(id);
                

              }, function() {
                  console.log(3);   
                  player_id = ids[0].player_id;
                  console.log(4);
                  problem_id = ids[0].problem_id;
                  stmt = db.prepare('INSERT INTO SCORES VALUES (?,?,?,?)');
                  stmt.run(null,score,player_id,problem_id);                    
                  
                  
              });

            
            

        });




  };

  var description = 'This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies! This is a description of the problem. Read this carefully before you even attempt to solve this problem. Beware, this problem is not for babies!'
  var problemss = [
  {
    difficulty: 'Easy',
    title: 'The traveling salesman',
    highscores: [{rank: 1, name: 'Arnold', score: 43}, {rank: 1, name: 'Sly', score: 42}, {rank: 1, name: 'Bono', score: 44}, {rank: 1, name: 'Arnold', score: 43}, {rank: 1, name: 'Sly', score: 42}, {rank: 1, name: 'Bono', score: 44}, {rank: 1, name: 'Arnold', score: 43}, {rank: 1, name: 'Sly', score: 42}, {rank: 1, name: 'Bono', score: 44}],
    description: description
  },
  {
    difficulty: 'Easy',
    title: 'Snow white and the huntsman',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Easy',
    title: 'Trouble in paradise',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Easy',
    title: 'One million grasshoppers',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Easy',
    title: 'Romeo is looking for a lover',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Medium',
    title: 'Trees in a graveyard',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Medium',
    title: 'Banking gone wrong',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Medium',
    title: 'Cowboys and wizards',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Medium',
    title: 'Which soup is the coldest?',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Medium',
    title: 'Love and racketball',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Hard',
    title: 'Prince of Russia',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Hard',
    title: 'Three golden coins and a goat',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Hard',
    title: 'Day at the zoo',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Hard',
    title: 'Counting raindrops',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  },
  {
    difficulty: 'Hard',
    title: 'Circus of death',
    highscores: [{rank: 1, name: 'Arnold', score: 43}],
    description: description
  }
]






};



module.exports = databaseInterface;