exports = module.exports = function(IoC, hosts, localhost, services, logger) {
  var Switch = require('../lib/switch');
  
  
  var nss = new Switch();
  nss.use(hosts);
  nss.use('.', require('dns'));
  nss.use('localhost.', localhost, true);
  
  return Promise.resolve(nss)
    .then(function(resolver) {
      // NOTE: These are resolved directly here, to avoid a circular dependency with the
      // $location variable, which implicilty requires this component.
      
      return new Promise(function(resolve, reject) {
        var components = IoC.components('module:bixby-ns.Resolver');
        
        (function iter(i) {
          var component = components[i];
          if (!component) {
            return resolve(resolver);
          }
          
          
          var service = component.a['@service'];
          var proto = component.a['@protocol'] || 'tcp';
          var label = '_' + service + '._' + proto;
          
          // TODO: Should resolver.domain be here???  Or should it search domains if not specified?
          resolver.resolve(label + '.' + resolver.domain, 'SRV', function(err, addresses) {
            if (err) {
              return iter(i + 1);
            }
          
            var ctx = {
              '$location': addresses[0]
            };
            component.create(ctx)
              .then(function(service) {
                logger.info('Loaded NS service: ' + (component.a['@scheme'] || service.name));
            
                // FIXME: Improve this to not be hardcoded to consul
                resolver.use('consul.', service, true);
                iter(i + 1);
              }, function(err) {
                // TODO: Print the package name in the error, so it can be found
                // TODO: Make the error have the stack of dependencies.
                if (err.code == 'IMPLEMENTATION_NOT_FOUND') {
                  logger.notice(err.message + ' while loading component ' + component.id);
                  return iter(i + 1);
                }
            
                reject(err);
              });
          });
        })(0);
      });
    })
    .then(function(nss) {
      //var type = 'consul-catalog-http';
      //var type = 'consul-dns';
      //services.createConnection(type, { url: 'TODO' });
      //var ns = services.createConnection(type, { url: 'TODO' });
  
      //nss.use('consul.', ns);
      //nss.use('.', require('dns'));
      nss.leave('localhost');
  
      return nss;
    });
}

exports['@implements'] = 'http://i.bixbyjs.org/ns/Resolver';
exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  './resolver/hosts',
  './resolver/localhost',
  'http://i.bixbyjs.org/services',
  'http://i.bixbyjs.org/Logger'
];
