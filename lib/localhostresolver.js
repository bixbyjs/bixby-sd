// Module dependencies.
var net = require('net');


/**
 * Create a new resolver.
 *
 * @classdesc This resolver performs name resolution using registered port
 * numbers.
 *
 * Because registered port numbers are obtained from configuration local to the
 * host, it is assumed that resolution occurs within the {@link https://datatracker.ietf.org/doc/html/rfc6761#section-6.3 special-use}
 * `localhost` domain.
 *
 * This class is named after the IANA {@link https://www.iana.org/assignments/service-names-port-numbers Service Name and Transport Protocol Port Number Registry}.
 *
 * @public
 * @class
 */
function LocalhostResolver(registry) {
  this._registry = registry;
}

/**
 * Uses registered port numbers to resolve a host name (e.g. 'ftp.localhost')
 * into an array of the resource records.  The `callback` function has arguments
 * `(err, records)`.  When successful, records will be an array of resource
 * records.  The type and structure of individual results varies based on
 * `rrtype`.
 *
 * On error, `err` is an `Error` object, where `err.code` is one of the DNS
 * error codes.
 *
 * @public
 * @param {string} hostname
 * @param {string} rrtype
 * @param {Function} callback
 * @param {Error} callback.err
 * @param {string[]|Object[]|Object} callback.records
 */
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
