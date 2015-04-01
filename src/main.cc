#ifndef BUILDING_NODE_EXTENSION
	#define BUILDING_NODE_EXTENSION
#endif

#include <nan.h>
#include "v8decode.h"

void init(v8::Handle<v8::Object> exports) {
	NODE_SET_METHOD(exports, "decode", decode);
	NODE_SET_METHOD(exports, "decode_full", decode_full);
}

NODE_MODULE(btparse, init)
