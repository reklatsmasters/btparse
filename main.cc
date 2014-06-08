#ifdef _MSC_VER
	#pragma warning(disable:4506)
	#pragma warning(disable:4005)
#endif

#ifndef BUILDING_NODE_EXTENSION
	#define BUILDING_NODE_EXTENSION
#endif

#include <node.h>
#include <node_buffer.h>

#include <string>

#include "btparse.hpp"

using namespace v8;

Handle<Value> Decode(const Arguments& args) {
	HandleScope scope;

	if ( !args.Length() ) {
		ThrowException(Exception::TypeError(String::New("Wrong number of arguments: 1 argument required, but only 0 present")));
		return scope.Close(Undefined());
	}

	// строка c данными
	std::string from;

	if (args[0]->IsString()) {
		String::AsciiValue v8data(args[0]->ToString());

		if (!v8data.length()) {
			ThrowException(Exception::TypeError(String::New("Error when converting string")));
			return scope.Close(Undefined());
		}

		from = std::string(*v8data, v8data.length());
	} else if ( node::Buffer::HasInstance(args[0]) ) {
		from = std::string(node::Buffer::Data(args[0]), node::Buffer::Length(args[0]) );
	} else {
		ThrowException(Exception::TypeError(String::New("Wrong type of argument 1")));
		return scope.Close(Undefined());
	}
	
	Local<Value> ret = Local<Value>::New(bt::bdecode(from.begin(), from.end()));
	return scope.Close(ret);

}

void init(Handle<Object> exports) {
	exports->Set(String::NewSymbol("decode"),
		FunctionTemplate::New(Decode)->GetFunction());
}

NODE_MODULE(btparse, init)