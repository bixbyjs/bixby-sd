function Services() {
  this._types = {};
}

Services.prototype.use = function(type, module) {
  this._types[type] = module;
}

Services.prototype.createConnection = function(type, options) {
  var module = this._types[type];
  // TODO: throw if no module
  return module.createConnection(options);
}


module.exports = Services;
