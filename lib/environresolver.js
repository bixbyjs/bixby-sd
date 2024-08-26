//https://tools.ietf.org/html/rfc6761
// https://man7.org/linux/man-pages/man7/environ.7.html

function EnvironResolver() {
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
  var labels = hostname.split('.')
    , service = labels[0].slice(1)
    , proto = labels[1].slice(1);
  
  var name = service.toUpperCase() + '_URL';
  var isdef = (name in process.env);
  var error;
  if (!isdef) {
    error = new Error('queryUri ENOTFOUND ' + hostname);
    error.code = 'ENOTFOUND';
    return cb(error);
  } 
  
  
  var value = process.env[name];
  
  // TODO: support "generic" env vars, with check against URI scheme
  
  return cb(null, [{ uri: value }]);
  
  //return cb(new Error('not implemented'))
};

module.exports = EnvironResolver;
