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

	// Local<String> ret = String::New("decoder");
	Local<Array> ret = Array::New(3);
	ret->Set(0, String::New("decoder"));

	// Local<Value> def = Local<Value>::New(Worker());
	ret->Set(1, Worker());
	// if (def->IsNumber()) {
	// 	ret = String::Concat(ret, String::New("___")); 
	// 	ret = String::Concat(ret, def->ToString()); 
	// }

	if (args.Length() >= 1) {
		if (args[0]->IsString()) {
	// 		ret = String::Concat(ret, args[0]->ToString());
			ret->Set(2, args[0]);
		}
	}

	return scope.Close(ret);
}

void init(Handle<Object> exports) {
	exports->Set(String::NewSymbol("decode"),
		FunctionTemplate::New(Decode)->GetFunction());
}

NODE_MODULE(btparse, init)