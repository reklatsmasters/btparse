#ifndef BUILDING_NODE_EXTENSION
	#define BUILDING_NODE_EXTENSION
#endif

#include <string>

#include <nan.h>
#include <node_buffer.h>

//#include "btdecode.hpp"
#include "bencode.hpp"
#include "v8decode.h"

/*
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
*/

using bt::libtorrent::entry;

v8::Handle<v8::Value> entry_parse(entry &e, bool decode_string = false) {
	NanEscapableScope();

	switch(e.type()) {
		case entry::int_t:
			return NanEscapeScope(NanNew<v8::Number>( e.integer() ));
		case entry::string_t: {
			auto str = e.string();

			if (!decode_string) {
				return NanEscapeScope(NanNewBufferHandle((char*)str.data(), str.size()));
			} else {
				v8::Local<v8::Value> v = NanNew(str);
				return NanEscapeScope(v);
			}
		}
		case entry::list_t: {
			auto list = e.list();
			v8::Local<v8::Array> entity_list = NanNew<v8::Array>(list.size());

			for (uint32_t i = 0; i < entity_list->Length(); ++i) {
				entity_list->Set(i, entry_parse(list.front(), decode_string));
				list.pop_front();
			}

			return NanEscapeScope(entity_list);
		}
		case entry::dictionary_t: {
			auto dict = e.dict();
			v8::Local<v8::Object> obj = NanNew<v8::Object>();

			for(auto it = dict.begin(); it != dict.end(); ++it) {
				obj->Set(NanNew(it->first), entry_parse(it->second, decode_string));
			}

			return NanEscapeScope(obj);
		}
		default: // undefined
			return NanUndefined();


	}
}

NAN_METHOD(decode) {
	NanScope();

	// строка c данными
	std::string from = std::string(node::Buffer::Data(args[0]), node::Buffer::Length(args[0]) );

	entry node = bt::libtorrent::decode(from.begin(), from.end());

	if (node.type() == entry::undefined_t) {
		NanReturnUndefined();
	}

	NanReturnValue(entry_parse(node));
}

NAN_METHOD(decode_full) {
	NanScope();

	// строка c данными
	std::string from = std::string(node::Buffer::Data(args[0]), node::Buffer::Length(args[0]) );

	entry node = bt::libtorrent::decode(from.begin(), from.end());

	if (node.type() == entry::undefined_t) {
		NanReturnUndefined();
	}

	NanReturnValue(entry_parse(node, true));
}
