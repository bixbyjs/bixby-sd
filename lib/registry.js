/**
 * Module dependencies.
 */
var uri = require('url')
  , bootable = require('bootable');


/**
 * Service registry.
 *
 * This component provides a registry used for service discovery.
 *
 * When servers come online, they announce which services they provide and where
 * those services are located.  Other entities, including services, workers, and
 * agents, can then resolve services to specific locations and then utilize the
 * resolved services in order to perform the necessary functions.
 *
 * This componenent will create a concrete service registry based on the
 * settings specified in a configuration file.  Apache ZooKeeper and etcd are
 * currently supported.
 *
 * To utilize this component within an application, configure the IoC loader
 * to use service discovery components.
 *
 *     IoC.use(require('bixby-sd'));
 *
 * @param {Logger} logger
 * @param {Settings} settings
 * @return {Registry}
 */
exports = module.exports = function(logger, settings) {
  var options = settings.toObject();
  if (!options.url) { throw new Error('Misconfigured service discovery: missing URL'); }
  
  var url = uri.parse(options.url);
  var mod, reg;
  
  switch (url.protocol) {
  case 'zk:':
    mod = require('sd-zookeeper');
    reg = new mod.Registry(options);
    break;
  case 'etcd:':
    mod = require('sd-etcd');
    options.host = url.hostname;
    options.port = url.port;
    reg = new mod.Registry(options);
    break;
  case 'redis:':
    mod = require('sd-redis');
    options.host = url.hostname;
    options.port = url.port;
    reg = new mod.Registry(options);
    break;
  default:
    throw new Error('Misconfigured service discovery: unsupported protocol "' + url.protocol + '"');
  }
  
  
  // Augument with bootable functionality.
  reg = bootable(reg);
  reg.phase(require('./init/connect')(logger, options));
  
  return reg;
}

/**
 * Component annotations.
 */
exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'settings' ];
