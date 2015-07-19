var fs = require('fs');
var zdf = require('../../node-zdf/zdf.js');
console.log(zdf.version);

function save(sourceDirectory, outputFile, callback) {
  console.log('Packaging ' + sourceDirectory + ' into ' + outputFile);
  var desintationStream = fs.createWriteStream(outputFile);
  return zdf.package(sourceDirectory).pipe(desintationStream).on('finish', callback).end();
}

module.exports = {
  save: save
};
