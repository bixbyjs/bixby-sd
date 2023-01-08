// https://www.npmjs.com/package/getent
// https://man7.org/linux/man-pages/man5/services.5.html

// TODO: would be nice to have a getservbyname funciton in Node
// http://man7.org/linux/man-pages/man3/getservbyname.3.html

function ServicesList() {
  this._names = {};
}

ServicesList.prototype.get = function(name) {
  // TODO: Get by name or port number
  return this._names[name];
};

ServicesList.prototype.add = function(info) {
  this._names[info.name] = info;
};


module.exports = ServicesList;
