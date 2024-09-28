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
    , aliases = (entry && entry.aliases) || []
    , name, host, port, i, len;

  name = service.toUpperCase() + '_HOST';
  if (name in process.env) {
    host = process.env[name];
  }

  name = service.toUpperCase() + '_PORT';
  if (name in process.env) {
    port = parseInt(process.env[name]);
  }
  
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
  
  var error = new Error('querySrv ENOTFOUND ' + hostname);
  error.code = 'ENOTFOUND';
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
    , aliases = (entry && entry.aliases) || []
    , name, value, i, len;
  
  name = service.toUpperCase() + '_URL';
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
      if ((u.protocol == (service + ':')) || (aliases.indexOf(u.protocol.slice(0, -1)) != -1)) {
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
