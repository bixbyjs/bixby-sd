exports = module.exports = function(IoC, logger) {
  
  return Promise.resolve()
    .then(function discoverService() {
      console.log('discover service...');
      var components = IoC.components('http://i.bixbyjs.org/sd/RegistryDiscoverFunc');
      
      return Promise.all(components.map(function(c) { return c.create(); } ))
        .then(function(funcs) {
          return new Promise(function(resolve, reject) {
            
            // Iterate over each of the `discover` functions, attempting to
            // locate a service registry.
            (function iter(i) {
              var func = funcs[i];
              if (!func) {
                // Reject with `ENOTFOUND`, causing a jump to the next catch
                // function.  This function will attempt to create a suitable
                // store based on the host environment.
                //return reject('ENOTFOUND');
                return resolve();
              }
          
              logger.debug('Discovering service registry via ' + components[i].a['@service']);
              func(function(err, records) {
                if (err && err.code == 'ENOTFOUND') {
                  // Unable to locate a service using this particular protocol.
                  // Continue discovery using remaining supported protocols.
                  return iter(i + 1);
                } else if (err) {
                  return reject(err);
                }
                
                if (!records) { return iter(i + 1); }
                return resolve(records);
              });
            })(0);
            
          });
        });
    })
    .then(function(records) {
      console.log('CREATE HOSTS REGISTRY!');
      console.log(records)
      
      return IoC.create('./registry/hosts');
    });
};

exports['@implements'] = 'http://i.bixbyjs.org/sd/Registry';
exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/Logger'
];
