## Btparse
Very fast way for parse torrent files. With C++ implementation, based on libtorrent.

### Why only sync api?
Current implementation used V8 structures and types in a decoder.

## Install
````
npm install btparse
````

## Example

	var bt = require("btparse")
    	, fs = require("fs")
        ;
        
     fs.readFile("some.torrent", {encoding:null}, function(e, file){
     	var torrent = bt.decode(file);	// Buffer for decode torrents
     });
     
     var list = bt.decode("li1ei2ei3ee");	// String for decode simple string
     
     try {
     	bt.decode("i120e");
     } catch(e) {                  // fire exception on error
     	console.error(e.message);
     }
    
## TODO
- Add stream support
- Add callback support

## License
MIT 


