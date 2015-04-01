#ifndef BUILDING_NODE_EXTENSION
	#define BUILDING_NODE_EXTENSION
#endif

#include <string>

#include <nan.h>
#include <node_buffer.h>

#include "btdecode.hpp"
#include "v8decode.h"

using namespace v8;

NAN_METHOD(decode) {
	NanScope();

	// строка c данными
	std::string from = std::string(node::Buffer::Data(args[0]), node::Buffer::Length(args[0]) );

	NanReturnValue(bt::decode(from.begin(), from.end()));
}

NAN_METHOD(decode_full) {
	NanScope();

	// строка c данными
	std::string from = std::string(node::Buffer::Data(args[0]), node::Buffer::Length(args[0]) );

	NanReturnValue(bt::decode(from.begin(), from.end(), true));
}
