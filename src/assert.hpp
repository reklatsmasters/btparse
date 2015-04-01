#ifndef BT_ASSERT_H
#define BT_ASSERT_H

#include <stdexcept>

#define TORRENT_ASSERT(v) if (!(v)) { throw new std::logic_error("decode error"); }

#endif
