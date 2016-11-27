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
     stmt.run(null,'primefactors','return an array containing the prime factors of n in ascending order','Easy');

     stmt = db.prepare('INSERT INTO SCORES VALUES (?,?,?,?)');
     stmt.run(null,'69','1','1');
     stmt.run(null,'1','2','1');
     stmt.run(null,'5','3','1');
     stmt.run(null,'2','4','1');
     stmt.run(null,'10','5','1');
     stmt.run(null,'3','6','1');

  };

  

   /**
   * Nær í öll score fyrir tiltekið problem
   * 
   * @param {problem} strengur sem inniheldur titil á vandamáli
   *
   * @callback {deliverScores} Kallar á deliverScores með öllum stigum sem fundust sem parameter
   */

  self.getScores = function(problem,deliverScores) {

    db.serialize(function() {
      console.log('problem in getScores: ' + problem);

      var statement = 'SELECT score, name FROM SCORES JOIN PLAYERS ON PLAYERS._id = SCORES._player_id'+
                       ' JOIN PROBLEMS ON PROBLEMS._id = SCORES._problem_id WHERE PROBLEMS.title = ?';


      var scores = [];
      db.each(statement, [problem], function(err, row) {
        var score = 
        {
          score : row.score,
          name : row.name,
          problem : problem,
        };
        scores.push(score);

      }, function() {
        deliverScores(scores);
       
                  
      });
      
    });

  };

  self.getProblems = function(deliverProblems){

     db.serialize(function() {
      console.log('problem in getScores: ' + problem);

      var problems = [];
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
   *
   * @callback {isNameTaken} Kallar á isNameTaken(true) ef búið var að skrá player, annars isNameTaken(false)
   */
  self.insertScore = function(player,problem,score,isNameTaken) {
    db.serialize(function() {

        var players = [];
        var selectPlayers = 'SELECT name FROM PLAYERS JOIN SCORES ON SCORES._player_id = PLAYERS._id'+
                            ' JOIN PROBLEMS ON PROBLEMS._id = SCORES._problem_id WHERE PROBLEMS.title = ? AND PLAYERS.name = ?';
        db.each(selectPlayers, [problem,player], function(err,row) {
          players.push(row.name);

        }, function() {
            if(players.length > 0) isNameTaken(true);
            
            else
            {
              

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
                  isNameTaken(false);          
                  db.each('SELECT * FROM SCORES',function(err, row) {
                    console.log('score: ' + row.score);

                  });
                  
                  
              });

            }
            

        });




        
        
      });
  };


  






};



module.exports = databaseInterface;