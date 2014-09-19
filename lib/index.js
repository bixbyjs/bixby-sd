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


exports.scope = function scope(id, obj, $scope) {
  if (id == 'settings') {
    var prefix = 'sd';
    if ($scope.prefix) {
      prefix = $scope.prefix;
    }
    return obj.isolate(prefix);
  }
  return obj;
}