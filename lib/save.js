var fs = require('fs');
var fstream = require('fstream');
var zdf = require('../../node-zdf/zdf.js');

function save(options, callback) {
  return new Promise((resolve, reject) => {
    console.log('Packaging %s into %s', options.source, options.destination);

    var publicKey = options.publicKey ? fs.readFileSync(options.publicKey) : null;
    var privateKey = options.privateKey ? fs.readFileSync(options.privateKey) : null;

    var destinationStream = fs.createWriteStream(options.destination)
      .on('error', reject);

    var sourceStream = fstream.Reader({
      path: options.source,
      type: 'Directory'
    }).on('error', reject);

    var zdfStream = new zdf.PackageWriteStream({
      publicKey: publicKey,
      privateKey: privateKey,
      privateKeyPassphrase: options.privateKeyPassphrase
    }).on('error', reject);

    sourceStream.pipe(zdfStream).pipe(destinationStream)
      .on('finish', resolve);
  });
}

module.exports = {
  save: save
};
