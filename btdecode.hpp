#ifndef BTDECODE_H
#define BTDECODE_H

#ifndef BUILDING_NODE_EXTENSION
	#define BUILDING_NODE_EXTENSION
#endif

#include <node.h>

#include <string>
#include <list>
#include <cctype>

namespace bt {

using namespace v8;

// читает строку до определённого символа
template <class InIt>
Handle<Value> read_until(InIt& in, InIt end, char end_token, bool& err) {
	HandleScope scope;

	std::string ret;

	// ++in;
	if (in == end) {
		err = true;
		return scope.Close(Undefined());
	}

	while (*in != end_token) {
		ret += *in;
		++in;

		if (in == end) {
			err = true;
			return scope.Close(Undefined());
		}
	}

	return scope.Close(String::New(ret.c_str(), ret.length()));
}

// читает строку заданного размера
template<class InIt>
Handle<Value> read_string(InIt& in, InIt end, int64_t len, bool& err) {
	HandleScope scope;
	std::string str;
	
	for (int64_t i = 0; i < len; ++i) {
		if (in == end) {
			err = true;
			return scope.Close(Undefined());
		}

		str += *in;
		++in;
	}

	return scope.Close(String::New(str.c_str(), str.length()));
}

template<class InIt>
void read_raw_string(InIt& in, InIt end, int64_t len, std::string& str, bool& err) {
	for (int64_t i = 0; i < len; ++i) {
		if (in == end) {
			err = true;
			return;
		}

		str += *in;
		++in;
	}
}

std::string ToHex(const std::string& input) {
    static const char* const lut = "0123456789ABCDEF";
    size_t len = input.length();

    std::string output;
    output.reserve(2 * len);
    for (size_t i = 0; i < len; ++i) {
        const unsigned char c = input[i];
        output.push_back(lut[c >> 4]);
        output.push_back(lut[c & 15]);
    }
    return output;
}

// читает бинарный хэш торрента в массив по 20 байт каждый элемент
template<class InIt>
Handle<Value> read_pieces(InIt& in, InIt end, bool& err) {
	HandleScope scope;

	int length = 20;	// длина одного слова
	std::string word;
	// std::stringstream hexword;
	std::list<std::string> list;

	if (!std::isdigit((unsigned char)*in)) {
		err = true;
		return scope.Close(Undefined());
	}

	Local<Value> v8_pieces_length = Local<Value>::New(read_until(in, end, ':', err));

	if (err) {
		return scope.Close(Undefined());
	}
	
	++in; // ':'

	int64_t pieces_length = v8_pieces_length->ToInteger()->Value();

	if ( (pieces_length % length) != 0 ) {
		err = true;
		return scope.Close(Undefined());
	}


	// читаем по 20 байт и конвертим их в hex строку
	for (int64_t i = 0; i < pieces_length; i += length) {
		if (in == end) {
			err = true;
			return scope.Close(Undefined());
		}

		read_raw_string(in, end, length, word, err);
		
		if (err) {
			return scope.Close(Undefined());
		}

		list.push_back(ToHex(word));

		word.erase();
	}

	Local<Array> entity = Array::New(list.size());
	for (uint32_t i = 0; i < entity->Length(); ++i) {
		entity->Set(i, String::New(list.front().c_str()));
		list.pop_front();
	}

	//++in; // last + 1

	return scope.Close(entity);
}

// переименовываем для более удобной работы с контейнером
typedef Local<Value> value_type;

template<class InIt>
Handle<Value> bdecode_recursive(InIt& in, InIt end, bool& err, int depth) {
	HandleScope scope;
	Local<Value> entity;

	if (depth >= 100) {
		err = true;
		return scope.Close(Undefined());
	}

	if (in == end) {
		err = true;
		return scope.Close(Undefined());
	}

	switch (*in) {

	// ----------------------------------------------
	// integer
	case 'i': {

		++in; // 'i' 
		Local<Value> val = Local<Value>::New(read_until(in, end, 'e', err));

		if (err) {
			return scope.Close(Undefined());
		}

		entity = val->ToNumber();
		++in; // 'e'
	}
	
	break;

	// ----------------------------------------------
	// list
	case 'l': {
		std::list<value_type> list;

		++in; // 'l'
		while (*in != 'e') {
			list.push_back( Local<Value>::New(bdecode_recursive(in, end, err, depth + 1)) );

			if (err) {
				return scope.Close(Undefined());
			}

			if (in == end) {
				err = true;
				return scope.Close(Undefined());
			}
		}

		entity = Array::New(list.size());
		Local<Array> entity_list = Local<Array>::Cast(entity);

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
		entity = Object::New();
		Local<Object> entity_map = Local<Object>::Cast(entity);

		++in; // 'd'

		while (*in != 'e') {
			Local<Value> key = Local<Value>::New(bdecode_recursive(in, end, err, depth + 1));

			if (err || !key->IsString()) {
				return scope.Close(Undefined());
			}

			String::AsciiValue v8key(key->ToString());
			std::string rawkey(*v8key, v8key.length());

			if (rawkey.compare("pieces") == 0) {
				entity_map->Set(key, Local<Value>::New(read_pieces(in, end, err)));
				// entity_map->Set(key, String::Empty());
				// bdecode_recursive(in, end, err, depth + 1);
			} else {
				entity_map->Set(key, Local<Value>::New(bdecode_recursive(in, end, err, depth + 1)));
			}

			if (err) {
				return scope.Close(Undefined());
			}

			if (in == end) {
				err = true;
				return scope.Close(Undefined());
			}
		}

		++in; // 'e'
	}

	break;

	// ----------------------------------------------
	// string
	default:
		if (std::isdigit((unsigned char)*in)) {
			Local<Value> len = Local<Value>::New(read_until(in, end, ':', err));

			if (err) {
				return scope.Close(Undefined());
			}

			++in; // ':'

			entity = Local<Value>::New(read_string(in, end, len->ToInteger()->Value(), err));

			if (err) {
				return scope.Close(Undefined());
			}
		} else {
			err = true;
			return scope.Close(Undefined());
		}
	}

	return scope.Close(entity);
}

// главная функция-декодер
template<class InIt>
Handle<Value> bdecode(InIt start, InIt end) {
	HandleScope scope;

	bool err = false;
	Local<Value> entity = Local<Value>::New(bdecode_recursive(start, end, err, 0));

	if (err) {
		return scope.Close(Undefined());
	}

	return scope.Close(entity);
}


}

#endif 