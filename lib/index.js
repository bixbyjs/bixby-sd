module.exports = function sd(id) {
  var map = {
    'registry': './registry',
    'boot/announce': './boot/announce',
    'boot/announceto': './boot/announceto',
    'boot/connection': './boot/connection'
  };
  
  var mid = map[id];
  if (mid) {
    return require(mid);
  }
};
