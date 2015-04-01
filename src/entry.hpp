#ifndef BT_ENTRY_H
#define BT_ENTRY_H

#include <string>
#include <list>
#include <map>

#include "size_type.hpp"
#include "assert.hpp"

namespace bt { namespace libtorrent {
  namespace detail {
		template<int v1, int v2>
		struct max2 { enum { value = v1>v2?v1:v2 }; };

		template<int v1, int v2, int v3>
		struct max3
		{
			enum
			{
				temp = max2<v1,v2>::value,
				value = temp>v3?temp:v3
			};
		};

		template<int v1, int v2, int v3, int v4>
		struct max4
		{
			enum
			{
				temp = max3<v1,v2, v3>::value,
				value = temp>v4?temp:v4
			};
		};
	}

  class entry;

  class entry {
  public:
    // the key is always a string. If a generic entry would be allowed
		// as a key, sorting would become a problem (e.g. to compare a string
		// to a list). The definition doesn't mention such a limit though.
		typedef std::map<std::string, entry> dictionary_type;
		typedef std::string string_type;
		typedef std::list<entry> list_type;
		typedef size_type integer_type;

		enum data_type
		{
			int_t,
			string_t,
			list_t,
			dictionary_t,
			undefined_t
		};

		data_type type() const;

		entry(dictionary_type const&);
		entry(string_type const&);
		entry(list_type const&);
		entry(integer_type const&);

		entry();
		entry(data_type t);
		entry(entry const& e);
		~entry();

		bool operator==(entry const& e) const;

		void operator=(entry const&);
		void operator=(dictionary_type const&);
		void operator=(string_type const&);
		void operator=(list_type const&);
		void operator=(integer_type const&);

		integer_type& integer();
		const integer_type& integer() const;
		string_type& string();
		const string_type& string() const;
		list_type& list();
		const list_type& list() const;
		dictionary_type& dict();
		const dictionary_type& dict() const;

    // these functions requires that the entry
		// is a dictionary, otherwise they will throw
    entry& operator[](char const* key);
		entry& operator[](std::string const& key);
  protected:
		void construct(data_type t);
    void copy(const entry& e);
		void destruct();
  private:
    data_type m_type;

#if defined(_MSC_VER) && _MSC_VER < 1310
		// workaround for msvc-bug.
		// assumes sizeof(map<string, char>) == sizeof(map<string, entry>)
		// and sizeof(list<char>) == sizeof(list<entry>)
		union
		{
			char data[
				detail::max4<sizeof(std::list<char>)
				, sizeof(std::map<std::string, char>)
				, sizeof(string_type)
				, sizeof(integer_type)>::value];
			integer_type dummy_aligner;
		};
#else
		union
		{
			char data[detail::max4<sizeof(list_type)
				, sizeof(dictionary_type)
				, sizeof(string_type)
				, sizeof(integer_type)>::value];
			integer_type dummy_aligner;
		};
#endif
  };

  inline entry::data_type entry::type() const	{
		return m_type;
	}

  inline entry::~entry() { destruct(); }

  inline void entry::operator=(const entry& e) {
		destruct();
		copy(e);
	}

  inline entry::integer_type& entry::integer() {
    if (m_type == undefined_t) construct(int_t);
    TORRENT_ASSERT(m_type == int_t);
    return *reinterpret_cast<integer_type*>(data);
  }

  inline entry::integer_type const& entry::integer() const {
    TORRENT_ASSERT(m_type == int_t);
    return *reinterpret_cast<const integer_type*>(data);
  }

  inline entry::string_type& entry::string() {
    if (m_type == undefined_t) construct(string_t);
    TORRENT_ASSERT(m_type == string_t);
    return *reinterpret_cast<string_type*>(data);
  }

  inline entry::string_type const& entry::string() const {
    TORRENT_ASSERT(m_type == string_t);
    return *reinterpret_cast<const string_type*>(data);
  }

  inline entry::list_type& entry::list() {
    if (m_type == undefined_t) construct(list_t);
    TORRENT_ASSERT(m_type == list_t);
    return *reinterpret_cast<list_type*>(data);
  }

  inline entry::list_type const& entry::list() const {
    TORRENT_ASSERT(m_type == list_t);
    return *reinterpret_cast<const list_type*>(data);
  }

  inline entry::dictionary_type& entry::dict() {
    if (m_type == undefined_t) construct(dictionary_t);
    TORRENT_ASSERT(m_type == dictionary_t);
    return *reinterpret_cast<dictionary_type*>(data);
  }

  inline entry::dictionary_type const& entry::dict() const {
    TORRENT_ASSERT(m_type == dictionary_t);
    return *reinterpret_cast<const dictionary_type*>(data);
  }

} // libtorrent

} // bt

#endif
