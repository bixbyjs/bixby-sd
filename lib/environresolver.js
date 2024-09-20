// Module dependencies.
var url = require('url');

//https://tools.ietf.org/html/rfc6761
// https://man7.org/linux/man-pages/man7/environ.7.html

var GENERIC_URL_ENV = [
  'DATABASE_URL'
];


function EnvironResolver(registry) {
  this._registry = registry;
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

/**
 * Uses environment variables to resolve uniform resource identifier records
 * (`URI` records) for the `hostname`.  The `addresses` argument passed to the
 * `callback` function will be an array of objects with the following
 * properties:
 *
 * - `priority`
 * - `weight`
 * - `url`
 *
 * ```js
 * {
 *   priority: 10,
 *   weight: 1,
 *   url: 'ftp://ftp1.example.com/public'
 * }
 * ```
 *
 * These records are synthesized from environment variables using established
 * conventions.  First, a name is formed by upper-casing the service name and
 * prefixing `_URL`.  If an environment variable with that name is set, its
 * value is used as the target of the record.  Next, a set of names is formed by
 * upper-casing each service name alias and prefixing `_URL`.  If any
 * environment variable with thoses names is set, its value is used as the
 * target of the record.  Finally, a set of generic environment variables are
 * checked to see if they are set to a usable value.  The value is usable if the
 * protocol matches the service name or an alias.  By default, the set of
 * generic environment variables is: `DATABASE_URL`.
 *
 * For example, when querying for the service `_postgresql._tcp`, the value of
 * the environment variable `POSTGRESQL_URL` will be used, if set.
 *
 * @public
 * @param {string} hostname
 * @param {Function} callback
 * @param {Error} callback.err
 * @param {Object[]} callback.addresses
 *
 * @example
 * resolver.resolveSrv('_ftp._tcp.localhost', function(err, addresses) {
 *   // ...
 * });
 */
EnvironResolver.prototype.resolveUri = function(hostname, cb) {
  var labels = hostname.split('.')
    , service = labels[0].slice(1)
    , proto = labels[1].slice(1)
    , entry = this._registry.get(service, proto)
    , aliases = (entry && entry.aliases) || []
    , value, i, len;
  
  var name = service.toUpperCase() + '_URL';
  if (name in process.env) {
    return cb(null, [{ url: process.env[name] }]);
  }
  
  for (i = 0, len = aliases.length; i < len; ++i) {
    name = aliases[i].toUpperCase() + '_URL';
    if (name in process.env) {
      return cb(null, [{ url: process.env[name] }]);
    }
  }
  
  for (i = 0, len = GENERIC_URL_ENV.length; i < len; ++i) {
    name = GENERIC_URL_ENV[i];
    if (name in process.env) {
      value = process.env[name];
      var u = url.parse(value);
      if (u.protocol == (service + ':')) {
        return cb(null, [{ url: value }]);
      }
    }
  }
  
  var error = new Error('queryUri ENOTFOUND ' + hostname);
  error.code = 'ENOTFOUND';
  error.hostname = hostname;
  return cb(error);
};

module.exports = EnvironResolver;
