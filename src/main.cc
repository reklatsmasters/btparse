#ifdef _MSC_VER
	#pragma warning(disable:4506)
	#pragma warning(disable:4005)
#endif

#ifndef BUILDING_NODE_EXTENSION
	#define BUILDING_NODE_EXTENSION
#endif

#include <node.h>
#include "v8decode.h"

using namespace v8;

void init(Handle<Object> exports) {
	exports->Set(String::NewSymbol("decode"),
		FunctionTemplate::New(decode)->GetFunction());
}

NODE_MODULE(btparse, init)