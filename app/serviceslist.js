var List = require('../lib/serviceslist');

exports = module.exports = function(c, logger) {
  var list = new List();
  
  return Promise.resolve(list)
    .then(function(list) {
      var components = c.components()
        , component, i, len;
      
      for (i = 0, len = components.length; i < len; ++i) {
        component = components[i];
        if (component.a['@service']) {
          
          // TODO: merge these things, in case multiple components have the same service name but different envs, for example
          list.add({
            name: component.a['@service'],
            port: component.a['@port'],
            env: component.a['@env']
          });
          
          // TODO: Improve log message
          logger.info('Registered service name: ' + component.a['@service']);
        }
      }
      
      return list;
    });
};

exports['@implements'] = 'http://i.bixbyjs.org/ns/ServicesList';
exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/Logger'
];
