/**
 * Module dependencies.
 */
var uri = require('url');

/**
 * Default port constants.
 */
var DEFAULT_PORT = {
  'zk:': 2181,
  'etcd:': 4001,
  'redis:': 6379
};


/**
 * Boot phase that connects to the service registry.
 *
 * @param {Logger} logger
 * @param {Object} [options]
 * @return {Function}
 */
exports = module.exports = function(logger, options) {
  options = options || {};

  return function connect(done) {
    if (!options.url) { throw new Error('Misconfigured service discovery: missing URL'); }
    
    var url = uri.parse(options.url);
    var host = url.hostname;
    var port = url.port || DEFAULT_PORT[url.protocol];
    
    options.connect = url.host;
    delete options.url;
    
    logger.info('Connecting to service registry %s:%d', host, port);
    this.connect(options, function() {
      logger.debug('Connected to service registry %s:%d', host, port);
      done();
    });
    
    // NOTE: By default, if the connection to the service registry is closed,
    //       the process will exit.  In accordance with a microservices
    //       architecture, it is expected that a process monitor will detect
    //       this condition and restart as necessary.
    this.on('close', function() {
      logger.error('Service registry connection closed');
      process.exit(-1);
    });
    
    // NOTE: By default, if an error is encountered from the service registry it
    //       will be rethrown.  This will cause an `uncaughtException` within
    //       Node and the process will exit.  In accordance with a microservices
    //       architecture, it is expected that a process monitor will detect
    //       this condition and restart as necessary.
    this.on('error', function(err) {
      logger.error('Unexpected error from service registry: %s', err.message);
      logger.error(err.stack);
      throw err;
    });
  }
}
