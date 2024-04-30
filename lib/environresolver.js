var net = require('net');


//https://tools.ietf.org/html/rfc6761
// https://man7.org/linux/man-pages/man7/environ.7.html

function EnvironResolver(list) {
  this._list = list;
}

EnvironResolver.prototype.resolve = function(hostname, rrtype, cb) {
  if (typeof rrtype == 'function') {
    cb = rrtype;
    rrtype = undefined;
  }
  rrtype = rrtype || 'A';
  
  switch (rrtype) {
    case 'URI':
      return this.resolveUri(hostname, cb);
    default:
      // TODO: add an error code
      return cb(new Error('Unsupported rrtype: ' + rrtype));
  }
};

// http://man7.org/linux/man-pages/man5/services.5.html
// https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml
EnvironResolver.prototype.resolveSrv = function(hostname, cb) {
  // TODO
};

EnvironResolver.prototype.resolveUri = function(hostname, cb) {
  // TODO
  
  var labels = hostname.split('.')
    , service = labels[0].slice(1)
    , proto = labels[1].slice(1);
  
  var entry = this._list.get(service)
    , error;
    
  console.log('CHECK ENTRY:');
  console.log(entry);
  
  if (!entry || !entry.env) {
    error = new Error('querySrv ENOTFOUND ' + hostname);
    error.code = 'ENOTFOUND';
    return cb(error);
  }
  
  // TODO: loop through env vars.
  // TODO: validate that env var ends in "URL"
  // TODO: validate resulting URL against component uri scheme
  var evar = entry.env[0]
  console.log('IS VAR?: ' + evar);
  
  var uri = process.env[evar];
  console.log(uri);
  
  if (!uri) {
    error = new Error('querySrv ENOTFOUND ' + hostname);
    error.code = 'ENOTFOUND';
    return cb(error);
  }
  
  
  return cb(null, [{ uri: uri }]);
  
  //return cb(new Error('not implemented'))
};

module.exports = EnvironResolver;
