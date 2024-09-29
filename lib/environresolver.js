// Module dependencies.
var url = require('url');

var GENERIC_URL_NAMES = [
  'DATABASE_URL'
];


/**
 * Create a new resolver.
 *
 * @classdesc This resolver performs name resolution using environment
 * variables.
 *
 * Because environment variables are defined by the host, it is assumed that
 * resolution occurs within the {@link https://datatracker.ietf.org/doc/html/rfc6761#section-6.3 special-use}
 * `localhost` domain.
 *
 * This class is named after {@link https://man7.org/linux/man-pages/man7/environ.7.html environ},
 * the POSIX standard variable that defines the process's environment.
 *
 * @public
 * @class
 */
function EnvironResolver(registry) {
  this._registry = registry;
}

/**
 * Uses environment variables to resolve a host name (e.g. 'ftp.localhost') into
 * an array of the resource records.  The `callback` function has arguments
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
EnvironResolver.prototype.resolve = function(hostname, rrtype, cb) {
  if (typeof rrtype == 'function') {
    cb = rrtype;
    rrtype = undefined;
  }
  rrtype = rrtype || 'A';
  
  var error;
  
  switch (rrtype) {
    case 'SRV':
      return this.resolveSrv(hostname, cb);
    case 'URI':
      return this.resolveUri(hostname, cb);
    default:
      var error = new TypeError("The argument 'rrtype' is invalid. Received '" + rrtype + "'");
      error.code = 'ERR_INVALID_ARG_VALUE';
      throw error;
  }
};

/**
 * Uses environment variables to resolve service records (`SRV` records) for the
 * `hostname`.  The `addresses` argument passed to the `callback` function will
 * be an array of objects with the following properties:
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
 *   name: 'ftp1.example.com'
 * }
 * ```
 *
 * These records are synthesized from environment variables using established
 * conventions.  First, two names are formed: one by upper-casing the service
 * name and postfixing `_HOST` and another by postfixing `_PORT`.  If an
 * environment variable with the host name is set, its value is used, along with
 * the port, as the target of the record.  If the port is not set, the default
 * port will be used.  Next, a set of two names are formed by upper-casing each
 * service name alias and postfixing `_HOST` and `_PORT`.  If any environment
 * variable with thoses host names is set, its value is used as the target of
 * the record, along with the corresponding port.
 *
 * These conventions are followed by many cloud providers, including {@link https://www.heroku.com/ Heroku}
 * via {@link https://devcenter.heroku.com/articles/add-ons#basic-usage add-ons}.
 * For instance, {@link https://www.stackhero.io/ Stackhero} makes {@link https://devcenter.heroku.com/articles/ah-postgresql-stackhero#provisioning-the-add-on Postgres},
 * {@link https://devcenter.heroku.com/articles/ah-mysql-stackhero#provisioning-the-add-on MySQL},
 * and {@link https://devcenter.heroku.com/articles/ah-mariadb-stackhero#provisioning-the-add-on MariaDB}
 * avaiable via `STACKHERO_{DBNAME}_HOST` and `{STACKHERO_{DBNAME}_PORT}`
 * environment variables.
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
EnvironResolver.prototype.resolveSrv = function(hostname, cb) {
  var labels = hostname.split('.')
    , service = labels[0].slice(1)
    , proto = labels[1].slice(1)
    , entry = this._registry.get(service, proto)
    , aliases = [ service ].concat((entry && entry.aliases) || [])
    , name, host, port, i, len;
  
  for (i = 0, len = aliases.length; i < len; ++i) {
    name = aliases[i].toUpperCase() + '_HOST';
    if (name in process.env) {
      host = process.env[name];
      
      name = aliases[i].toUpperCase() + '_PORT';
      if (name in process.env) {
        port = parseInt(process.env[name]);
      }
      break;
    }
  }
  
  if (entry && port === undefined) {
    port = entry.port;
  }
  
  if (host && port) {
    return cb(null, [{ name: host, port: port }]);
  }
  
  // Error with ENODATA, rather than ENOTFOUND.   ENOTFOUND indicates that the
  // host name does not exist.  The `localhost` domain is special-use, with the
  // assumption that address queries for localhost names will resolve to the IP
  // loopback address.  While this function is resolving `SRV` records, it is
  // assumed that any service may exist, even in the absence of explicit
  // configuration.  Therefore, ENODATA is the more appropriate error code.
  // This also has the benefit of not halting Bixby's `$location` resolution,
  // allowing it to try other non-environment-based resolution mechanisms.
  var error = new Error('querySrv ENODATA ' + hostname);
  error.code = 'ENODATA';
  error.hostname = hostname;
  return cb(error);
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
 * postfixing `_URL`.  If an environment variable with that name is set, its
 * value is used as the target of the record.  Next, a set of names is formed by
 * upper-casing each service name alias and postfixing `_URL`.  If any
 * environment variable with thoses names is set, its value is used as the
 * target of the record.  Finally, a set of generic environment variables are
 * checked to see if they are set to a usable value.  The value is usable if the
 * protocol matches the service name or an alias.  By default, the set of
 * generic environment variables is: `DATABASE_URL`.
 *
 * For example, when querying for the service `_postgresql._tcp`, the value of
 * the environment variable `POSTGRESQL_URL` will be used, if set.  If that is
 * not set, the value of `POSTGRES_URL` will be used.  Finally, the value of
 * `DATABASE_URL` will be used.
 *
 * These conventions are followed by many cloud providers, including {@link https://www.heroku.com/ Heroku}
 * via {@link https://devcenter.heroku.com/articles/add-ons#basic-usage add-ons}.
 * For instance, {@link https://elements.heroku.com/addons/heroku-postgresql Heroku Postgres}
 * is available via the {@link https://devcenter.heroku.com/articles/heroku-postgresql#designating-a-primary-database generic}
 * `DATABASE_URL` environment variable.  {@link https://elements.heroku.com/addons/heroku-redis Heroku Data for Redis}
 * is available via the {@link https://devcenter.heroku.com/articles/heroku-redis#establish-the-primary-instance service-specific}
 * `REDIS_URL` environment variable.  Other platform-as-a-service providers have
 * followed suit, including {@link https://fly.io/ Fly.io} with their {@link https://fly.io/docs/postgres/managing/attach-detach/#attach-a-fly-app support}
 * for Postgres and {@link https://vercel.com/ Vercel} with their {@link https://vercel.com/docs/storage/vercel-postgres/quickstart#review-what-was-created support}
 * for Postgres.
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
    , aliases = [ service ].concat((entry && entry.aliases) || [])
    , name, value, i, len;
  
  for (i = 0, len = aliases.length; i < len; ++i) {
    name = aliases[i].toUpperCase() + '_URL';
    if (name in process.env) {
      return cb(null, [{ url: process.env[name] }]);
    }
  }
  
  for (i = 0, len = GENERIC_URL_NAMES.length; i < len; ++i) {
    name = GENERIC_URL_NAMES[i];
    if (name in process.env) {
      value = process.env[name];
      var u = url.parse(value);
      if ((u.protocol == (service + ':')) || (aliases.indexOf(u.protocol.slice(0, -1)) != -1)) {
        return cb(null, [{ url: value }]);
      }
    }
  }
  
  // Error with ENODATA, rather than ENOTFOUND.   ENOTFOUND indicates that the
  // host name does not exist.  The `localhost` domain is special-use, with the
  // assumption that address queries for localhost names will resolve to the IP
  // loopback address.  While this function is resolving `URI` records, it is
  // assumed that any service may exist, even in the absence of explicit
  // configuration.  Therefore, ENODATA is the more appropriate error code.
  // This also has the benefit of not halting Bixby's `$location` resolution,
  // allowing it to try other non-environment-based resolution mechanisms.
  var error = new Error('queryUri ENODATA ' + hostname);
  error.code = 'ENODATA';
  error.hostname = hostname;
  return cb(error);
};

module.exports = EnvironResolver;
