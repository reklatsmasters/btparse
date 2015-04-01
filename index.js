'use strict';

var bt = require('./lib/btparse');

exports.decode = function(data) {
  if (!arguments.length) {
    throw new TypeError("Wrong number of arguments: 1 argument required, but only 0 present");
  }

  if (typeof data == 'string') {
    if (!data.length) { return {}; }

    data = new Buffer(data);
  } else if (Buffer.isBuffer(data)) {
    if (!data.length) { return {}; }
  } else {
    throw new TypeError("Wrong type of argument 1");
  }

  var ret = bt.decode(data);

  if (typeof ret === 'undefined') {
    throw new Error('Decode error');
  }

  return ret;
};
