/**
 * Module dependencies.
 */
var uri = require('url');

/**
 * Default port constants.
 */
var DEFAULT_PORT = {
  'zk:': 2181,
  'etcd:': 4001
};


/**
 * Component-ized boot phase that connects to the service registry.
 *
 * To utilize this component within an application, configure the IoC loader
 * to use service discovery components.
 *
 *     IoC.loader(require('bixby-sd'));
 *
 * @param {Settings} settings
 * @param {Logger} logger
 * @return {Function}
 */
exports = module.exports = function(registry, settings, logger) {

  return function connection(done) {
    var config = settings.get('sd') || {};
    if (!config.url) { throw new Error('Misconfigured service discovery: missing URL'); }
    
    var url = uri.parse(config.url);
    var host = url.hostname;
    var port = url.port || DEFAULT_PORT[url.protocol];
    
    config.connect = url.host;
    delete config.url;
    
    logger.info('Connecting to service registry %s:%d', host, port);
    registry.connect(config, function() {
      logger.debug('Connected to service registry %s:%d', host, port);
      done();
    });
    
    // NOTE: By default, if the connection to the service registry is closed,
    //       the process will exit.  In accordance with a microservices
    //       architecture, it is expected that a higher-level monitor will
    //       detect process termination and restart as necessary.
    registry.on('close', function() {
      logger.error('Service registry connection closed');
      process.exit(-1);
    });
    
    // NOTE: By default, if an error is encountered from the service registry it
    //       will be rethrown.  This will cause an `uncaughtException` within
    //       Node and the process will exit.  In accordance with a microservices
    //       architecture, it is expected that a higher-level monitor will
    //       detect process failures and restart as necessary.
    registry.on('error', function(err) {
      logger.error('Unexpected error from service registry: %s', err.message);
      logger.error(err.stack);
      throw err;
    });
  }
}

/**
 * Component annotations.
 */
exports['@require'] = [ '../registry', 'settings', 'logger' ];
