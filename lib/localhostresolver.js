// Module dependencies.
var net = require('net');


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
      var error = new TypeError("The argument 'rrtype' is invalid. Received '" + rrtype + "'");
      error.code = 'ERR_INVALID_ARG_VALUE';
      throw error;
  }
};

/**
 * Uses registered port numbers to resolve service records (`SRV` records) for
 * the `hostname`.  The `addresses` argument passed to the `callback` function
 * will be an array of objects with the following properties:
 *
 * - `priority`
 * - `weight`
 * - `port`
 * - `name`
 *
 * ```js
 * {
 *   priority: 10,
 *   weight: 5,
 *   port: 21,
 *   name: 'localhost'
 * }
 * ```
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
    error.hostname = hostname;
    return cb(error);
  }
  c = net.createConnection(entry.port);
  c.once('connect', onconnect);
  c.once('error', onerror);
};

module.exports = LocalhostResolver;
