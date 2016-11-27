
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



