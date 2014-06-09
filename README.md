## Btparse
Very fast way for parse torrent files. With C++ implementation, based on libtorrent.

### Why only sync api?
Как известно nodejs однопоточен. Для создания асинхронного взаимодействия рабочая функция запускается в отдельном потоке, однако из этого потока мы не имеем доступа к структурам V8. Текущая реализация портирована из libtorrent и использует структуры V8 для хранения данных. Если же использовать некий внутренний безопасный тип для хранения данных, потом всё равно придётся перекидывать эти данные в v8::Value. А это усложнение просто не имеет смысла.

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
    
## License
MIT 


