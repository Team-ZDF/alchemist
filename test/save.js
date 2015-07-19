var saver = require('../lib/save.js');

saver.save(__dirname + '/how-to-spy/', __dirname + '/how-to-spy.zdf', function() {
  console.log('Finished');
});
