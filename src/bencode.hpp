#ifndef BENCODE_H
#define BENCODE_H

#include "entry.hpp"
#include "assert.hpp"

#include <string>
#include <cctype>

namespace bt { namespace libtorrent {

  template <class InIt>
	std::string read_until(InIt& in, InIt end, char end_token, bool& err)	{
		std::string ret;

		if (in == end) {
			err = true;
			return ret;
		}
		while (*in != end_token) {
			ret += *in;
			++in;
			if (in == end) {
				err = true;
				return ret;
			}
		}
		return ret;
	}

  template<class InIt>
	void read_string(InIt& in, InIt end, size_t len, std::string& str, bool& err) {
		for (size_t i = 0; i < len; ++i)
		{
			if (in == end)
			{
				err = true;
				return;
			}
			str += *in;
			++in;
		}
	}


  template<class InIt>
	void bdecode_recursive(InIt& in, InIt end, entry& ret, bool& err, int depth) {
		if (depth >= 100)
		{
			err = true;
			return;
		}

		if (in == end)
		{
			err = true;
			return;
		}
		switch (*in)
		{

		// ----------------------------------------------
		// integer
		case 'i':
			{
			++in; // 'i'
			std::string val = read_until(in, end, 'e', err);
			if (err) return;
			TORRENT_ASSERT(*in == 'e');
			++in; // 'e'
			ret = entry(entry::int_t);
			char* end_pointer;
			ret.integer() = std::strtoll(val.c_str(), &end_pointer, 10);
			if (end_pointer == val.c_str())
			{
				err = true;
				return;
			}
			} break;

		// ----------------------------------------------
		// list
		case 'l':
			{
			ret = entry(entry::list_t);
			++in; // 'l'
			while (*in != 'e')
			{
				ret.list().push_back(entry());
				entry& e = ret.list().back();
				bdecode_recursive(in, end, e, err, depth + 1);
				if (err)
				{
					return;
				}
				if (in == end)
				{
					err = true;
					return;
				}
			}
			TORRENT_ASSERT(*in == 'e');
			++in; // 'e'
			} break;

		// ----------------------------------------------
		// dictionary
		case 'd':
			{
			ret = entry(entry::dictionary_t);
			++in; // 'd'
			while (*in != 'e')
			{
				entry key;
				bdecode_recursive(in, end, key, err, depth + 1);
				if (err || key.type() != entry::string_t)
				{
          err = true;
					return;
				}
				entry& e = ret[key.string()];
				bdecode_recursive(in, end, e, err, depth + 1);
				if (err)
				{
					return;
				}
				if (in == end)
				{
					err = true;
					return;
				}
			}
			TORRENT_ASSERT(*in == 'e');
			++in; // 'e'
			} break;

		// ----------------------------------------------
		// string
		default:
			if (std::isdigit((unsigned char)*in))
			{
				std::string len_s = read_until(in, end, ':', err);
				if (err)
				{
					return;
				}
				TORRENT_ASSERT(*in == ':');
				++in; // ':'
				int len = std::atoi(len_s.c_str());
				ret = entry(entry::string_t);
				read_string(in, end, len, ret.string(), err);
				if (err)
				{
						return;
				}
			}
			else
			{
				err = true;
				return;
			}
		}
	}

  template<class InIt>
	entry decode(InIt start, InIt end) {
		entry e;
		bool err = false;
    try {
      bdecode_recursive(start, end, e, err, 0);
    } catch(std::logic_error&) {
        err = true;
    }

		if (err) return entry();
		return e;
	}

} // libtorrent

} // bt

#endif
