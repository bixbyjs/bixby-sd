var utils = require('./utils');

function Switch() {
  this.domain = 'localhost';
  
  this._services = [];
  this._search = [];
}

Switch.prototype.use = function(zone, module, join) {
  if (typeof zone != 'string') {
    join = module;
    module = zone;
    zone = undefined;
  }
  
  console.log('Switch#use - ' + zone);
  
  this._services.push({ module: module, zone: zone });
  if (join) { this.join(zone); }
};

Switch.prototype.join = function(domain) {
  if (domain[domain.length - 1] == '.') { domain = domain.slice(0, -1); }
  this._search.push(domain);
};

Switch.prototype.leave = function(domain) {
  var idx = this._search.indexOf(domain);
  if (idx != -1) {
    this._search.splice(idx, 1);
  }
};

Switch.prototype.resolve = function(hostname, rrtype, cb) {
  // FIXME: Correctly support search domains.  For now, just assuming `.localhost`.
  hostname += ('.' + this.domain);
  
  console.log('## Switch#resolve');
  console.log(hostname);
  console.log(rrtype);
  
  // hardcoded success for redis
  //return cb(null, [{ name: 'localhost', port: 6379 }]);
  
  
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
      
      console.log('resolving...: ' + name + ' ' + rrtype);
      console.log(resolver.module)
      
      try {
      resolver.module.resolve(name, rrtype, function(err, records) {
        console.log('RESOLVED!');
        console.log(err);
        console.log(records)
        if (err) { return riter(j - 1); }
        return cb(null, records);
      });
      } catch(ex) {
        console.log('exXXXX');
        console.log(ex)
        // dns throws when trying to resolve URI records
        return riter(j - 1);
      }
    })(services.length - 1);
  })(0);
};

module.exports = Switch;
