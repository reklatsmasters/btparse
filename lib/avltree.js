/* eslint-disable n/prefer-global/process */
/* eslint-disable camelcase */
/* eslint-disable n/prefer-global/buffer */

/**
 * Create new AVL tree node
 * @returns {{key: null, value: null, height: number, left: null, right: null}}
 */
export function create(key, value) {
  if (!Buffer.isBuffer(key)) {
    throw new TypeError('expected buffer');
  }

  return {
    key,
    value,
    left: null,
    right: null,
    height: 0,
  };
}

/**
 * Compare 2 keys
 * @param treeKey {Buffer}
 * @param key {string|Buffer}
 * @returns {number}
 */
function compare(treeKey, key) {
  let buf;

  if (Buffer.isBuffer(key)) {
    buf = key;
  } else if (typeof key === 'string') {
    buf = Buffer.from(key);
  } else {
    throw new TypeError('Argument `key` must be a Buffer or a string');
  }

  return Buffer.compare(treeKey, buf);
}

/**
 * Search `key` in AVL tree
 * @param tree {Object}
 * @param key {Buffer|String}
 * @returns {Buffer|Object|null}
 */
export function lookup(tree, key) {
  if (!tree) {
    return null;
  }

  switch (compare(tree.key, key)) {
    case 0: {
      return tree;
    }

    case 1: {
      return lookup(tree.right, key);
    }

    case -1: {
      return lookup(tree.left, key);
    }

    default: {
      break;
    }
  }
}

/**
 * Height of AVL tree
 * @param tree {Object}
 * @returns {number}
 */
function height(tree) {
  return tree ? tree.height : -1;
}

/**
 * Insert new key / value into AVL tree
 * @param tree
 * @param key
 * @param value
 * @returns {*}
 */
export function add(tree, key, value) {
  if (!tree) {
    return create(key, value);
  }

  switch (compare(tree.key, key)) {
    case -1: {
      tree.left = add(tree.left, key, value);
      return balance(tree) === -2 ? add_left(tree, key) : patch(tree);
    }

    case 1: {
      tree.right = add(tree.right, key, value);
      return balance(tree) === 2 ? add_right(tree, key) : patch(tree);
    }

    case 0: {
      tree.value = value;
      break;
    }

    default: {
      break;
    }
  }

  return tree;
}

function balance(tree) {
  return height(tree.right) - height(tree.left);
}

function add_left(tree, key) {
  switch (compare(tree.left.key, key)) {
    case -1: {
      return rotate_right(tree);
    }

    case 1: {
      return rotate_left_right(tree);
    }

    default: {
      break;
    }
  }

  return tree;
}

function add_right(tree, key) {
  switch (compare(tree.right.key, key)) {
    case -1: {
      return rotate_right_left(tree);
    }

    case 1: {
      return rotate_left(tree);
    }

    default: {
      break;
    }
  }

  return tree;
}

function rotate_right(tree) {
  const { left } = tree;
  tree.left = left.right;
  left.right = tree;

  patch(tree);
  patch(left);

  return left;
}

function rotate_left(tree) {
  const { right } = tree;
  tree.right = right.left;
  right.left = tree;

  patch(tree);
  patch(right);

  return right;
}

function rotate_left_right(tree) {
  tree.left = rotate_left(tree.left);
  return rotate_right(tree);
}

function rotate_right_left(tree) {
  tree.right = rotate_right(tree.right);
  return rotate_left(tree);
}

export function print(tree, level) {
  level >>>= 0; // eslint-disable-line no-bitwise

  if (!tree) {
    return;
  }

  for (let i = 0; i < level; ++i) {
    process.stdout.write('\t');
  }

  console.log('%s (h=%s, v=%s)', tree.key.toString(), tree.height, tree.value);

  print(tree.left, level + 1);
  print(tree.right, level + 1);
}

/**
 * Get all keys from AVL tree
 * @param tree
 * @returns {*}
 */
export function keys(tree) {
  return keys_internal(tree, []);
}

function keys_internal(tree, list) {
  if (!tree) {
    return list;
  }

  list.push(tree.key.toString());
  return keys_internal(tree.left, keys_internal(tree.right, list));
}

function patch(tree) {
  tree.height = Math.max(height(tree.left), height(tree.right)) + 1;

  return tree;
}
