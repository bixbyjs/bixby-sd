var dns = require('dns');


function HostsResolver(db) {
  this._db = db;
}

HostsResolver.prototype.resolve = function(hostname, rrtype, cb) {
  if (typeof rrtype == 'function') {
    cb = rrtype;
    rrtype = undefined;
  }
  rrtype = rrtype || 'A';
  
  switch (rrtype) {
    case 'SRV':
      return this.resolveSrv(hostname, cb);
  }
};

HostsResolver.prototype.resolveSrv = function(hostname, cb) {
  if (typeof domain == 'function') {
    cb = domain;
    domain = undefined;
  }
  
  var db = this._db;
  
  dns.lookup(hostname, function(err, addresses) {
    if (err) { return cb(err); }
    
    var ent = db.getEntry(hostname)
      , error;
    if (!ent || !ent.port) {
      error = new Error('querySrv ENOTFOUND ' + hostname);
      error.code = 'ENOTFOUND';
      return cb(err);
    }
    return cb(null, [ { name: hostname, port: ent.port, priority: 1, weight: 1 } ]);
  });
};

module.exports = HostsResolver;
