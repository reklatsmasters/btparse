{
	"targets": [{
		"target_name": "btparse",
		"include_dirs":["src", "<!(node -e \"require('nan')\")"],
		"sources": [ "src/main.cc", "src/v8decode.cc", "src/entry.cc" ],
		'win_delay_load_hook': 'true',
		"conditions":[
			['OS=="win"', {
				"configurations": {
					'Release': {
					  'msvs_settings': {
							'VCCLCompilerTool': {
								'WarningLevel': 4,
								'ExceptionHandling': 1,
								'DisableSpecificWarnings': [4100, 4127, 4201, 4244, 4267, 4506, 4611, 4714, 4800, 4005]
							}
					  }
					}
				}
			}, {
				'cflags_cc!': ['-fno-rtti', '-fno-exceptions'],
				"cflags_cc+": [
					"-fexceptions",
					"-std=c++0x",
					'-frtti'
				]
			}]
		]
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
