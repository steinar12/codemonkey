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
        
        self.loadInitialData();
        console.log('Database did not exist before, created a new one!');
      }    

    });

  };

  self.loadInitialData = function() {

     //TEST DATA
     var stmt = db.prepare('INSERT INTO PLAYERS VALUES (?,?)');
     stmt.run(null,'Siggi');
     stmt = db.prepare('INSERT INTO PROBLEMS VALUES (?,?,?,?)');
     stmt.run(null,'Sort','Sort unsorted array','Easy');
     stmt = db.prepare('INSERT INTO SCORES VALUES (?,?,?,?)');
     stmt.run(null,'69','1','1');
  };



  self.getScores = function(problem) {

    db.serialize(function() {

      //var selectPlayer = 'SELECT _id from PLAYERS where name = ?'
      //var selectProblem = 'SELECT _id from PROBLEMS where name  = ?'
      var statement = 'SELECT score FROM SCORES where SCORES._player_id = (SELECT _id from PLAYERS where PLAYERS.name = ?) AND SCORES._problem_id = (SELECT _id from PROBLEMS where PROBLEMS.title  = ?)';
      /*var statement2 ='SELECT score FROM SCORES JOIN PLAYERS ON SCORES._player_id = PLAYERS._id'+
                      ' JOIN PROBLEMS ON SCORES._problem_id = PROBLEM_id WHERE PLAYERS.name = ? AND PROBLEMS.title = ?';*/
      var statement3 = 'SELECT score FROM SCORES where _player_id = ?';
      var statement4 = 'SELECT SCORES.scores, PLAYERS.name FROM SCORES JOIN PLAYERS ON PLAYERS._id = SCORES._player_id'+
                       ' JOIN PROBLEMS._id = SCORES._problem_id WHERE PROBLEMS.title = ?'


      //db.each(statement2, [player,problem], function(err, row) {
      //db.each(statement3, ['1'], function(err, row) {
      var scores = [];
      db.each(statement4, [problem], function(err, row) {
        console.log('score: ' + row.score);
        console.log(err);
        var score = 
        {
          score : row.score,
          name : row.name
        };

      }, function() {
          console.log('completed getScores query');
          //
          /*db.each('SELECT * FROM SCORES', function(err,row) {
            console.log('ROW SCORE AFTER COMPLETION: '+ row.score);

          });
          */
      });
      
    });

  };


  self.insertScore = function(player,problem,score) {
    db.serialize(function() {


        var stmt = db.prepare('INSERT INTO PLAYERS VALUES (?,?)');
        stmt.run(null,player);

        var selectIds = 'SELECT PLAYERS._id AS player_id, PROBLEMS._id AS problem_id from PLAYERS,PROBLEMS where PLAYERS.name = ? AND PROBLEMS.title = ?'
        //var selectProblem = 'SELECT _id from PROBLEMS where name  = ?'
        var statement = 'SELECT score FROM SCORES where SCORES._player_id = (SELECT _id from PLAYERS where PLAYERS.name = ?) AND SCORES._problem_id = (SELECT _id from PROBLEMS where PROBLEMS.title  = ?)';
        
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
            
            /*db.each('SELECT * FROM SCORES', function(err,row) {
              console.log('ROW SCORE AFTER COMPLETION: '+ row.score);

            });*/
            
        });
        
      });
  };


  






};



module.exports = databaseInterface;