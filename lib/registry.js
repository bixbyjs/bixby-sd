/**
 * Module dependencies.
 */
var uri = require('url');


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
 * settings specified in a configuration file.  In a typical production cluster,
 * Apache ZooKeeper will be used to provide the underlying coordination
 * primitives.
 *
 * To utilize this component within an application, configure the IoC loader
 * to use service discovery components.
 *
 *     IoC.loader(require('bixby-sd'));
 *
 * References:
 *   - [Apache ZooKeeper](http://zookeeper.apache.org/)
 *
 * @return {Function}
 */
exports = module.exports = function(settings, logger) {
  var config = settings.get('sd') || {};
  if (!config.url) { throw new Error('Misconfigured service discovery: missing URL'); }
  
  var url = uri.parse(config.url);
  var mod, reg;
  
  switch (url.protocol) {
  case 'zk:':
    mod = require('sd-zookeeper');
    reg = new mod.Registry(config);
    break;
  case 'etcd:':
    mod = require('sd-etcd');
    config.host = url.hostname;
    config.port = url.port;
    reg = new mod.Registry(config);
    break;
  default:
    throw new Error('Misconfigured service discovery: unsupported protocol "' + url.protocol + '"');
  }
  
  return reg;
}

/**
 * Component annotations.
 */
exports['@singleton'] = true;
exports['@require'] = [ 'settings', 'logger' ];
