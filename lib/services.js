function Services() {
  this._types = {};
}

Services.prototype.use = function(type, module) {
  this._types[type] = module;
}

Services.prototype.createConnection = function(type, options, connectListener) {
  var module = this._types[type];
  // TODO: throw if no module
  return module.createConnection(options, connectListener);
}


module.exports = Services;
