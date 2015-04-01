#ifndef BUILDING_NODE_EXTENSION
	#define BUILDING_NODE_EXTENSION
#endif

#include <nan.h>
#include "v8decode.h"

void init(v8::Handle<v8::Object> exports) {
	NODE_SET_METHOD(exports, "decode", decode);
}

NODE_MODULE(btparse, init)
