var bt = require('./build/Release/btparse');
var fs = require("fs");

console.dir(bt);

fs.readFile("jp.torrent", {encoding:null}, function(e, torrent) {
	console.log(bt.decode(torrent));
});

// console.log(bt.decode(torrent));
