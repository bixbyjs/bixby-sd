exports = module.exports = function(IoC, logger) {
  var RoutingUpdater = require('../lib/routingupdater');
  
  
  var updater = new RoutingUpdater();
  
  return Promise.resolve(updater)
    .then(function(updater) {
      return new Promise(function(resolve, reject) {
        var components = IoC.components('module:bixby-ns.Updater');
      
        console.log(components);
      
        (function iter(i) {
          var component = components[i];
          if (!component) {
            return resolve(updater);
          }
          
          component.create()
            .then(function(service) {
              console.log('CREATED UPDATER!!!');
              
              // FIXME: Improve this to not be hardcoded to consul
              updater.use('consul.', service);
              
              //logger.info('Loaded HTTP authentication scheme: ' + (component.a['@scheme'] || scheme.name));
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
          
        })(0);
      });
    })
    .then(function(updater) {
      return updater;
    });
};

exports['@implements'] = 'http://i.bixbyjs.org/ns/Updater';
exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/Logger'
];
