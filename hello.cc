#ifdef _MSC_VER
	#pragma warning(disable:4506)
	#pragma warning(disable:4005)
#endif

#define BUILDING_NODE_EXTENSION

#include <node.h>

using namespace v8;

Handle<Value> Worker() {
	HandleScope scope;

	Local<Number> value = Number::New(115);

	return scope.Close(value);
}

Handle<Value> Decode(const Arguments& args) {
	HandleScope scope;

	Local<String> ret = String::New("decoder");

	Local<Value> def = Local<Value>::New(Worker());

	if (def->IsNumber()) {
		ret = String::Concat(ret, String::New("___")); 
		ret = String::Concat(ret, def->ToString()); 
	}

	return scope.Close(ret);
}

void init(Handle<Object> exports) {
	exports->Set(String::NewSymbol("decode"),
		FunctionTemplate::New(Decode)->GetFunction());
}

NODE_MODULE(btparse, init)