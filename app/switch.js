exports = module.exports = function(IoC, services, logger) {
  var Switch = require('../lib/switch')
    , LocalhostResolver = require('../lib/LocalhostResolver');
  
  
  //var iss = new Switch();
  //iss.use('localhost.', new LocalhostResolver(services), true);
  
  var nss = new Switch();
  nss.use('localhost.', new LocalhostResolver(services), true);
  
  // TODO: Load zone files, detect name servers
  
  /*
  var localhost = new LocalhostResolver();
  localhost.resolve('consul-dns', 'SRV', function(err, addresses) {
    console.log('LOCALLY RESOLVED!');
    console.log(err);
    console.log(addresses);
    
    
  });
  */
  
  //var localhost = new LocalhostResolver(services);
  
  
  return Promise.resolve(nss)
    .then(function(nss) {
      return new Promise(function(resolve, reject) {
        var modules = IoC.components('http://i.bixbyjs.org/ns/INameService')
          , mod, ent;
        
        (function iter(i) {
          mod = modules[i];
          if (!mod) { return resolve(nss); } // done
          
          var name = mod.a['@name'];
          console.log('RESOLVING....: ' + name);
          nss.resolve(name, 'SRV', function(err, addresses) {
            if (err) { return iter(i + 1); }
            
            // TODO: Add this naming service here!
            console.log('ADD IT!');
            console.log(name);
            console.log(addresses);
            
            var ns = services.createConnection(name, addresses[0]);
            //console.log(ns);
            nss.use('consul.', ns);
            nss.join('consul')
            
            iter(i + 1);
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
      nss.use('.', require('dns'));
      nss.leave('localhost');
  
      return nss;
    });
}

exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/services',
  'http://i.bixbyjs.org/Logger'
];
