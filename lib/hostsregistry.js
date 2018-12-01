var dns = require('dns');


function HostsRegistry() {
  
}

HostsRegistry.prototype.resolve = function(type, cb) {
  console.log('RESOLVE HOST FOR TYPE');
  console.log(type);
  
  /*
  dns.lookup('iana.org', function(err, address, family) {
    console.log('iana.org address: %j family: IPv%s', address, family);
  });
  
  dns.lookup('iana.org', { all: true }, function(err, addresses) {
    console.log('IANA ALL LOOKUP');
    console.log(err)
    console.log(addresses);
  });
  
  dns.resolve('iana.org', function(err, addresses) {
    console.log('IANA RESOLVE A');
    console.log(err)
    console.log(addresses);
  });
  
  dns.resolve('iana.org', 'AAAA', function(err, addresses) {
    console.log('IANA RESOLVE AAAA');
    console.log(err)
    console.log(addresses);
  });
  */
  
  dns.lookup('redis', function(err, address, family) {
    console.log('redis address: %j family: IPv%s', address, family);
  });
  
  dns.lookup('redis', { all: true }, function(err, addresses) {
    console.log('redis ALL LOOKUP');
    console.log(err)
    console.log(addresses);
  });
  
  dns.lookup('tasks.redis', { all: true }, function(err, addresses) {
    console.log('tasks.redis ALL LOOKUP');
    console.log(err)
    console.log(addresses);
  });
  
  dns.resolve('redis', function(err, addresses) {
    console.log('redis RESOLVE A');
    console.log(err)
    console.log(addresses);
  });
  
  dns.resolve('tasks.redis', function(err, addresses) {
    console.log('tasks.redis RESOLVE A');
    console.log(err)
    console.log(addresses);
  });
  
  dns.resolve('redis', 'AAAA', function(err, addresses) {
    console.log('IANA RESOLVE AAAA');
    console.log(err)
    console.log(addresses);
  });
  
  cb();
}


module.exports = HostsRegistry;
