#include <algorithm>

#include "entry.hpp"
#include "assert.hpp"

namespace {
	template <class T>
	void call_destructor(T* o)
	{
		if (o) {
		  o->~T();
    }
	}
}

namespace bt { namespace libtorrent {

  entry& entry::operator[](char const* key)
	{
		dictionary_type::iterator i = dict().find(key);
		if (i != dict().end()) return i->second;
		dictionary_type::iterator ret = dict().insert(
			dict().begin()
			, std::make_pair(key, entry()));
		return ret->second;
	}

	entry& entry::operator[](std::string const& key)
	{
		dictionary_type::iterator i = dict().find(key);
		if (i != dict().end()) return i->second;
		dictionary_type::iterator ret = dict().insert(
			dict().begin()
			, std::make_pair(std::string(key), entry()));
		return ret->second;
	}

  entry::entry()
		: m_type(undefined_t)
	{	}

	entry::entry(data_type t)
		: m_type(undefined_t)
	{
		construct(t);
	}

	entry::entry(const entry& e)
		: m_type(undefined_t)
	{
		copy(e);
	}

	entry::entry(dictionary_type const& v)
		: m_type(undefined_t)
	{
		new(data) dictionary_type(v);
		m_type = dictionary_t;
	}

	entry::entry(string_type const& v)
		: m_type(undefined_t)
	{
		new(data) string_type(v);
		m_type = string_t;
	}

	entry::entry(list_type const& v)
		: m_type(undefined_t)
	{
		new(data) list_type(v);
		m_type = list_t;
	}

	entry::entry(integer_type const& v)
		: m_type(undefined_t)
	{
		new(data) integer_type(v);
		m_type = int_t;
	}

  void entry::operator=(dictionary_type const& v)
	{
		destruct();
		new(data) dictionary_type(v);
		m_type = dictionary_t;
	}

	void entry::operator=(string_type const& v)
	{
		destruct();
		new(data) string_type(v);
		m_type = string_t;
	}

	void entry::operator=(list_type const& v)
	{
		destruct();
		new(data) list_type(v);
		m_type = list_t;
	}

	void entry::operator=(integer_type const& v)
	{
		destruct();
		new(data) integer_type(v);
		m_type = int_t;
	}

	bool entry::operator==(entry const& e) const
	{
		if (m_type != e.m_type) return false;

		switch(m_type)
		{
		case int_t:
			return integer() == e.integer();
		case string_t:
			return string() == e.string();
		case list_t:
			return list() == e.list();
		case dictionary_t:
			return dict() == e.dict();
		default:
			TORRENT_ASSERT(m_type == undefined_t);
			return true;
		}
	}


  void entry::construct(data_type t) {
		switch(t)
		{
		case int_t:
			new(data) integer_type;
			break;
		case string_t:
			new(data) string_type;
			break;
		case list_t:
			new(data) list_type;
			break;
		case dictionary_t:
			new (data) dictionary_type;
			break;
		default:
			TORRENT_ASSERT(t == undefined_t);
		}
		m_type = t;
	}

  void entry::copy(entry const& e) {
    switch (e.type()) {
    case int_t:
      new(data) integer_type(e.integer());
      break;
    case string_t:
      new(data) string_type(e.string());
      break;
    case list_t:
      new(data) list_type(e.list());
      break;
    case dictionary_t:
      new (data) dictionary_type(e.dict());
      break;
    default:
      TORRENT_ASSERT(e.type() == undefined_t);
    }
    m_type = e.type();
  }

  void entry::destruct() {
		switch(m_type)
		{
		case int_t:
			call_destructor(reinterpret_cast<integer_type*>(data));
			break;
		case string_t:
			call_destructor(reinterpret_cast<string_type*>(data));
			break;
		case list_t:
			call_destructor(reinterpret_cast<list_type*>(data));
			break;
		case dictionary_t:
			call_destructor(reinterpret_cast<dictionary_type*>(data));
			break;
		default:
			TORRENT_ASSERT(m_type == undefined_t);
			break;
		}
		m_type = undefined_t;
	}
} // libtorrent

} // bt
