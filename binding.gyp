{
	"targets": [{
		"target_name": "btparse",
		"include_dirs":["src"],
		"sources": [ "src/main.cc", "src/v8decode.cc" ]
	},
	
	{
		"target_name":"action_after_build",
		"type": "none",
		"dependencies": [ "btparse" ],
		"copies": [{
			"files": [ "<(PRODUCT_DIR)/btparse.node" ],
			"destination": "./lib/"
		}]
	}]
}