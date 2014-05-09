module.exports = function sd(id) {
  var map = {
    'registry': './registry',
    'boot/announce': './boot/announce',
    'boot/connection': './boot/connection'
  };
  
  var mid = map[id];
  if (mid) {
    return require(mid);
  }
};
