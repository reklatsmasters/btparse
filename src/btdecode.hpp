#ifndef BTDECODE_H
#define BTDECODE_H

#include <nan.h>

#include <string>
#include <list>
#include <cctype>

namespace bt {

// читает строку до определённого символа
template <class InIt>
v8::Handle<v8::Value> read_until(InIt& in, InIt end, char end_token, bool& err) {
	NanEscapableScope();
	std::string ret;

	// ++in;
	if (in == end) {
		err = true;
		return NanUndefined();
	}

	while (*in != end_token) {
		ret += *in;
		++in;

		if (in == end) {
			err = true;
			return NanUndefined();
		}
	}

	return NanEscapeScope(NanNew(ret));
}

// читает строку заданного размера в буфер
template<class InIt>
v8::Handle<v8::Value> read_buffer(InIt& in, InIt end, int64_t len, bool& err) {
	NanEscapableScope();
	std::string str;

	for (int64_t i = 0; i < len; ++i) {
		if (in == end) {
			err = true;
			return NanUndefined();
		}

		str += *in;
		++in;
	}

	return NanEscapeScope(NanNewBufferHandle((char*)str.data(), str.size()));
}

// читает строку заданного размера
template<class InIt>
v8::Handle<v8::Value> read_string(InIt& in, InIt end, int64_t len, bool& err) {
	NanEscapableScope();
	std::string str;

	for (int64_t i = 0; i < len; ++i) {
		if (in == end) {
			err = true;
			return NanUndefined();
		}

		str += *in;
		++in;
	}

	return NanEscapeScope(NanNew(str));
}

typedef v8::Local<v8::Value> value_type;

template<class InIt>
v8::Handle<v8::Value> bdecode_recursive(InIt& in, InIt end, bool& err, int depth, bool decodeString) {
	NanEscapableScope();
	v8::Local<v8::Value> entity;

	if (depth >= 100) {
		err = true;
		return NanUndefined();
	}

	if (in == end) {
		err = true;
		return NanUndefined();
	}

	switch (*in) {

	// ----------------------------------------------
	// integer
	case 'i': {

		++in; // 'i'
		v8::Local<v8::Value> val = NanNew(read_until(in, end, 'e', err));

		if (err) {
			return NanUndefined();
		}

		entity = NanNew(val->ToNumber());
		++in; // 'e'
	}

	break;

	// ----------------------------------------------
	// list
	case 'l': {
		std::list<value_type> list;

		++in; // 'l'
		while (*in != 'e') {
			list.push_back( NanNew(bdecode_recursive(in, end, err, depth + 1, decodeString)) );

			if (err) {
				return NanUndefined();
			}

			if (in == end) {
				err = true;
				return NanUndefined();
			}
		}

		entity = NanNew<v8::Array>(list.size());
		v8::Local<v8::Array> entity_list = v8::Local<v8::Array>::Cast(entity);

		for (uint32_t i = 0; i < entity_list->Length(); ++i) {
			entity_list->Set(i, list.front());
			list.pop_front();
		}

		++in; // 'e'
	}

	break;

	// ----------------------------------------------
	// dictionary
	case 'd': {
		entity = NanNew<v8::Object>();
		v8::Local<v8::Object> entity_map = v8::Local<v8::Object>::Cast(entity);

		++in; // 'd'

		while (*in != 'e') {
			v8::Local<v8::Value> b_key = NanNew(bdecode_recursive(in, end, err, depth + 1, decodeString));

			if (err || !(node::Buffer::HasInstance(b_key) || b_key->IsString() )) {
				return NanUndefined();
			}

			entity_map->Set(b_key, NanNew(bdecode_recursive(in, end, err, depth + 1, decodeString)));

			if (err) {
				return NanUndefined();
			}

			if (in == end) {
				err = true;
				return NanUndefined();
			}
		}

		++in; // 'e'
	}

	break;

	// ----------------------------------------------
	// string
	default:
		if (std::isdigit((unsigned char)*in)) {
			v8::Local<v8::Value> len = NanNew(read_until(in, end, ':', err));

			if (err) {
				return NanUndefined();
			}

			++in; // ':'

			if (decodeString) {
				entity = NanNew(read_string(in, end, len->ToInteger()->Value(), err));
			} else {
				entity = NanNew(read_buffer(in, end, len->ToInteger()->Value(), err));
			}

			if (err) {
				return NanUndefined();
			}
		} else {
			err = true;
			return NanUndefined();
		}
	}

	return NanEscapeScope(entity);
}

// главная функция-декодер
template<class InIt>
v8::Handle<v8::Value> decode(InIt start, InIt end, bool decodeString = false) {
	NanEscapableScope();

	bool err = false;
	v8::Local<v8::Value> entity = NanNew(bdecode_recursive(start, end, err, 0, decodeString));

	if (err) {
		return NanUndefined();
	}

	return NanEscapeScope(entity);
}


}

#endif
