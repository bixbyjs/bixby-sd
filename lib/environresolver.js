var url = require('url');

//https://tools.ietf.org/html/rfc6761
// https://man7.org/linux/man-pages/man7/environ.7.html

var GENERIC_URL_ENV = [
  'DATABASE_URL'
];


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
    , service = labels[0].slice(1);
  
  var name = service.toUpperCase() + '_URL';
  if (name in process.env) {
    return cb(null, [{ uri: process.env[name] }]);
  }
  
  var value
    , i, len;
  for (i = 0, len = GENERIC_URL_ENV.length; i < len; ++i) {
    name = GENERIC_URL_ENV[i];
    if (name in process.env) {
      value = process.env[name];
      var u = url.parse(value);
      if (u.protocol == (service + ':')) {
        return cb(null, [{ uri: value }]);
      }
    }
  }
  
  var error = new Error('queryUri ENOTFOUND ' + hostname);
  error.code = 'ENOTFOUND';
  return cb(error);
};

module.exports = EnvironResolver;
