var net = require('net');


//https://tools.ietf.org/html/rfc6761

function LocalhostResolver(registry) {
  this._registry = registry;
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
    default:
      // TODO: add an error code
      return cb(new Error('Unsupported rrtype: ' + rrtype));
  }
};

// http://man7.org/linux/man-pages/man5/services.5.html
// https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml
LocalhostResolver.prototype.resolveSrv = function(hostname, cb) {
  var labels = hostname.split('.')
    , service = labels[0].slice(1)
    , proto = labels[1].slice(1);
  
  // TODO: Check that domain is localhost
  
  // TODO: Check that proto is tcp
  
  var entry = this._registry.get(service, proto)
    , error;
  
  if (!entry || !entry.port) {
    error = new Error('querySrv ENOTFOUND ' + hostname);
    error.code = 'ENOTFOUND';
    return cb(error);
  }
  
  function onconnect() {
    this.removeListener('error', onerror);
    return cb(null, [ { name: 'localhost', port: this.remotePort, priority: 1, weight: 1 } ]);
  }
  function onerror(err) {
    this.removeListener('connect', onconnect);
    var error = new Error('querySrv ENOTFOUND ' + hostname);
    error.code = 'ENOTFOUND';
    return cb(error);
  }
  c = net.createConnection(entry.port);
  c.once('connect', onconnect);
  c.once('error', onerror);
};

module.exports = LocalhostResolver;
