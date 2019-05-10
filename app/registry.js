exports = module.exports = function(IoC, logger) {
  var uri = require('url');
  
  // TODO: Remove this file.
  
  return Promise.resolve()
    .then(function discoverService() {
      var components = IoC.components('http://i.bixbyjs.org/sd/RegistryDiscoverFunc');
      
      return Promise.all(components.map(function(c) { return c.create(); } ))
        .then(function(funcs) {
          return new Promise(function(resolve, reject) {
            
            // Iterate over each of the `discover` functions, attempting to
            // locate a service registry via supported protocols.
            (function iter(i) {
              var func = funcs[i];
              if (!func) {
                // Reject with `ENOTFOUND`, causing a jump to the next catch
                // function.  This function will attempt to create a suitable
                // service registry based on the host environment.
                //return reject('ENOTFOUND');
                return resolve();
              }
          
              logger.debug('Discovering service registry via ' + components[i].a['@service']);
              func(function(err, records, ctx) {
                if (err && err.code == 'ENOTFOUND') {
                  // Unable to locate a service registry using this particular
                  // protocol.  Continue discovery using remaining supported
                  // protocols.
                  return iter(i + 1);
                } else if (err) {
                  return reject(err);
                }
                
                if (!records) { return iter(i + 1); }
                return resolve([records, ctx]);
              });
            })(0);
            
          });
        });
    })
    .then(function(args) {
      if (!args) {
        // TODO: better error handling
        logger.notice('Using hosts service registry for development');
        return IoC.create('./registry/hosts');
      }
      
      
      var records = args[0]
        , ctx = args[1] || {};
      
      // Iterate over the available components that support the service registry
      // interface, and create an instance that is compatible with the protocol
      // found via discovery.
      var components = IoC.components('http://i.bixbyjs.org/sd/Registry')
        , rec = records[0]
        , component, i, len
        , url, scheme;
      
      for (i = 0, len = components.length; i < len; ++i) {
        component = components[i];
        if (component.a['@service'] == ctx.service && component.a['@protocol'] == ctx.protocol) {
          logger.debug('Connecting to service registry via ' + ctx.service);

          if (rec.url) {
            url = uri.parse(rec.url);
            scheme = url.protocol.slice(0, -1);
            if (component.a['@uri-scheme'] == scheme) {
              return component.create({ url: rec.url });
            }
          }
        }
      }
    });
};

//exports['@implements'] = 'http://i.bixbyjs.org/sd/Registry';
exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/Logger'
];
