exports = module.exports = function(IoC, hosts, localhost, services, logger) {
  var Switch = require('../lib/switch');
  
  
  var nss = new Switch();
  nss.use(hosts);
  nss.use('.', require('dns'));
  nss.use('localhost.', localhost, true);
  
  return Promise.resolve(nss)
    .then(function(nss) {
      return new Promise(function(resolve, reject) {
        var modules = IoC.components('http://i.bixbyjs.org/ns/INameService')
          , mod, ent;
        
        (function iter(i) {
          mod = modules[i];
          if (!mod) { return resolve(nss); } // done
          
          var name = mod.a['@name'];
          nss.resolve(name, 'SRV', function(err, addresses) {
            if (err) { return iter(i + 1); }
            
            var ns = services.createConnection(name, addresses[0]);
            // FIXME: Improve this to not be hardcoded to consul
            nss.use('consul.', ns, true);
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
      //nss.use('.', require('dns'));
      nss.leave('localhost');
  
      return nss;
    });
}

exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  './resolver/hosts',
  './resolver/localhost',
  'http://i.bixbyjs.org/services',
  'http://i.bixbyjs.org/Logger'
];
