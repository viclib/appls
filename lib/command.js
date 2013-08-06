require("viclib")();
(function(){
  var exec, path, fs, browserify, lsc, file;
  exec = require('child_process').exec;
  path = require('path');
  fs = require('fs');
  browserify = path.join(path.dirname(fs.realpathSync(__filename)), '../node_modules/browserify/bin');
  lsc = path.join(path.dirname(fs.realpathSync(__filename)), '../node_modules/LiveScript/bin');
  file = process.argv[2];
  if (file == null) {
    console.log("File not found!");
    process.exit();
  }
  if (file.indexOf(".ls") !== -1) {
    file = file.slice(0, file.indxOf(".ls"));
  }
  console.log("Appls: compiling " + file);
  exec(lsc + '/lsc -cp ' + file + '.ls > ' + file + '.js', function(){
    return exec('(echo "<!doctype html><html><body><script>" && node ' + browserify + '/cmd.js --ig ' + file + '.js && echo "</script></body></html>") > ' + file + '.html', function(){
      return exec('rm ' + file + '.js', function(){
        return console.log("Done!");
      });
    });
  });
}).call(this);
