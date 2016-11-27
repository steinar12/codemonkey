var childProcesser = function() {
  var self = this;
  
  process.on('message', function(data){
  var method = data.method;
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




};



module.exports = childProcesser;