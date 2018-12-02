var dns = require('dns');


function HostsRegistry() {
  
}

HostsRegistry.prototype.resolve = function(type, cb) {
  return cb(null, [ { name: 'redis' } ]);
  
  dns.lookup('redis', { all: true }, function(err, addresses) {
    if (err) { return cb(err); }
    return cb(null, [ { name: 'redis' } ]);
  });
}


module.exports = HostsRegistry;
