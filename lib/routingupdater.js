var utils = require('./utils');

function RoutingUpdater() {
  this._services = [];
}

RoutingUpdater.prototype.use = function(zone, module) {
  if (typeof zone != 'string') {
    module = zone;
    zone = undefined;
  }
  
  this._services.push({ module: module, zone: zone });
};

RoutingUpdater.prototype.update = function(hostname, rrtype, rr, cb) {
  var services = this._services
    , names = [ hostname ]
    , parts = hostname.split('.');
  if (parts.length == 1) {
    // not fully qualified
    names = names.concat(this._search.map(function(domain) { return [ hostname, domain ].join('.'); }));
  }

  var self = this;
  (function niter(i) {
    var name = names[i]
      , error;
    if (!name) {
      error = new Error('resolve ENOTFOUND ' + hostname);
      error.code = 'ENOTFOUND';
      return cb(error);
    }
  
    (function riter(j) {
      var resolver = services[j];
      if (!resolver) { return niter(i + 1); }
      if (!utils.withinZone(name, resolver.zone)) { return riter(j - 1); }
      
      resolver.module.update(name, rrtype, rr, function(err, records) {
        if (err) { return riter(j - 1); }
        return cb(null, records);
      });
    })(services.length - 1);
  })(0);
  
}



module.exports = RoutingUpdater;
