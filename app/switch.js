exports = module.exports = function(IoC, services, logger) {
  var Switch = require('../lib/switch')
    , LocalhostResolver = require('../lib/LocalhostResolver');
  
  
  var nss = new Switch();
  // TODO: Load zone files, detect name servers
  
  /*
  var localhost = new LocalhostResolver();
  localhost.resolve('consul-dns', 'SRV', function(err, addresses) {
    console.log('LOCALLY RESOLVED!');
    console.log(err);
    console.log(addresses);
    
    
  });
  */
  
  var localhost = new LocalhostResolver(services);
  
  
  return Promise.resolve(nss)
    .then(function(nss) {
      return new Promise(function(resolve, reject) {
        var modules = IoC.components('http://i.bixbyjs.org/ns/INameService')
          , mod, ent;
        
        (function iter(i) {
          mod = modules[i];
          if (!mod) { return resolve(nss); } // done
          
          localhost.resolve(mod.a['@name'] + '.localhost', 'SRV', function(err, addresses) {
            if (err) { return iter(i + 1); }
            
            // TODO: Add this naming service here!
            iter(i + 1);
          });
        })(0);
      });
    })
    .then(function(nss) {
      //var type = 'consul-catalog-http';
      var type = 'consul-dns';
      //services.createConnection(type, { url: 'TODO' });
      var ns = services.createConnection(type, { url: 'TODO' });
  
      nss.use('consul.', ns);
      nss.use('.', require('dns'));
  
      return nss;
    });
}

exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/services',
  'http://i.bixbyjs.org/Logger'
];
