var dns = require('dns');


function HostsRegistry() {
  
}

HostsRegistry.prototype.resolve = function(type, domain, rrtype, cb) {
  if (typeof rrtype == 'function') {
    cb = rrtype;
    rrtype = domain;
    domain = undefined;
  }
  if (typeof domain == 'function') {
    cb = domain;
    rrtype = undefined;
    domain = undefined;
  }
  rrtype = rrtype || 'SRV';
  
  return this.resolveSrv(type, domain, cb);
}

HostsRegistry.prototype.resolveSrv = function(type, domain, cb) {
  if (typeof domain == 'function') {
    cb = domain;
    domain = undefined;
  }
  
  dns.lookup('redis', { all: true }, function(err, addresses) {
    if (err) { return cb(err); }
    return cb(null, [ { name: 'redis' } ]);
  });
}


module.exports = HostsRegistry;
