function Switch() {
  this._zones = {};
}

Switch.prototype.use = function(zone, module) {
  this._zones[zone] = module;
};

Switch.prototype.resolve = function(hostname, rrtype, cb) {
  // TODO: Find best zone
  
  var zone = this._zones['consul.'];
  return zone.resolve.apply(zone, arguments);
};



module.exports = Switch;
