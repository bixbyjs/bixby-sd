exports = module.exports = function(IoC, services, logger) {
  var Switch = require('../lib/switch');
  
  
  var s = new Switch();
  // TODO: Load zone files, detect name servers
  
  //var type = 'consul-catalog-http';
  var type = 'consul-dns';
  //services.createConnection(type, { url: 'TODO' });
  var ns = services.createConnection(type, { url: 'TODO' });
  
  s.use('consul', ns);
  
  
  
  //console.log('DNS LOOKUPS!');
  /*
  var dns = require('dns');
  
  
  //dns.lookup('xmpp.l', function(err, addresses) {
  //dns.resolve('www.google.com', function(err, addresses) {
  dns.resolve('_xmpp-client._tcp.google.com', 'SRV', function(err, addresses) {
    console.log('www.google.com resolve');
    console.log(err);
    console.log(addresses);
  });
  */
  
  return s;
}

exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/services',
  'http://i.bixbyjs.org/Logger'
];
