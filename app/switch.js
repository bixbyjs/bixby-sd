exports = module.exports = function(IoC, services, logger) {
  var Switch = require('../lib/switch');
  
  
  var s = new Switch();
  // TODO: Load zone files, detect name servers
  
  //var type = 'consul-catalog-http';
  var type = 'consul-dns';
  //services.createConnection(type, { url: 'TODO' });
  var ns = services.createConnection(type, { url: 'TODO' });
  
  s.use('consul.', ns);
  
  return s;
}

exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/services',
  'http://i.bixbyjs.org/Logger'
];
