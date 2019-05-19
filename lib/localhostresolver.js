var net = require('net');


//https://tools.ietf.org/html/rfc6761

function LocalhostResolver(db) {
  this._db = db;
}

LocalhostResolver.prototype.resolve = function(hostname, rrtype, cb) {
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

// http://man7.org/linux/man-pages/man5/services.5.html
// https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml
LocalhostResolver.prototype.resolveSrv = function(hostname, cb) {
  var ent = this._db.getEntry(hostname.split('.')[0])
    , err, c;
  if (!ent || !ent.port || ent.protocol !== 'tcp') {
    err = new Error('querySrv ENOTFOUND ' + hostname);
    err.code = 'ENOTFOUND';
    return cb(err);
  }
  
  function onconnect() {
    this.removeListener('error', onerror);
    return cb(null, [ { name: 'localhost', port: ent.port, priority: 1, weight: 1 } ]);
  }
  function onerror(err) {
    this.removeListener('connect', onconnect);
    var error = new Error('querySrv ENOTFOUND ' + hostname);
    error.code = 'ENOTFOUND';
    return cb(error);
  }
  c = net.createConnection(ent.port);
  c.once('connect', onconnect);
  c.once('error', onerror);
};

module.exports = LocalhostResolver;
