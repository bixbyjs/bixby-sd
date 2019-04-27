exports = module.exports = function(IoC, logger) {
  var Services = require('../lib/services');
  
  
  var services = new Services()
    , components = IoC.components('http://schemas.authnomicon.org/sd/IService');
  
  return Promise.all(components.map(function(c) { return c.create(); }))
    .then(function(plugins) {
      plugins.forEach(function(plugin, i) {
        logger.info('Loaded service: ' + components[i].a['@type']);
        services.use(components[i].a['@type'], plugin);
      });
    })
    .then(function() {
      return services;
    });
}

exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/Logger'
];
