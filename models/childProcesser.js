
module.exports = function () {
    console.log('Im in childProcesser module');
  process.on('message', function(data){
  console.log('recieved message in child!');
  var options = data.options;
  var someData = options.someData;
  var asyncFn = new Function('return ' + options.asyncFn)();
  asyncFn(someData, function(err, result){
    process.send({
      err: err,
      result: result
    });
  });
});
  
}





      /*function cb(err,res)
      {
        console.log('CALLED CALLBACK');
        console.log('error',err);
        console.log('result',res);
      }

      var options = {
        someData: {a:1, b:2, c:3},
        asyncFn: function (data, callback) {console.log(data);},        
      };

      options.asyncFn = options.asyncFn.toString();

      function Parent(options, callback) {

        //var childProcesser = new childProcesserModule();
        var child = childProcess.fork('./models/childProcesser');
        child.send({
          method : 'blabla',
          options: options,
        });
        child.on('message', function(data){
          callback(data.err,data.result);
          child.kill();
        });
      }
      //console.log('Before calling parent');
      Parent(options, cb);
      console.log('finished creating parent');
      */



