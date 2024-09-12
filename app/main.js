exports = module.exports = function(resolver) {
  var dns = require('dns');
  
  function lookup(hostname, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
  
    var result = []
      , i, len;
  
  
    /*
    //dns.lookup('www.google.com', function(err, address, family) {
    dns.lookup('www.google.com', options, function(err, address, family) {
      console.log(err);
      console.log(address);
      console.log(family);
  
    // 142.250.188.4
    // 4
  
    // [ { address: '142.251.46.228', family: 4 } ]
    })
    */
  
  
    //return;
  
    resolver.resolve(hostname, 'A', function(err, addresses) {
      if (err) { return cb(err); }
    
      // TODO: handle empty addresses, likely by resolving CNAME and going again
    
    
      for (i = 0, len = addresses.length; i < len; ++i) {
        result.push({ address: addresses[i], family: 4 });
      }
    
      if (options.all == true) {
        return cb(null, result);
      }
      return cb(null, result[0].address, result[0].family);
    });
  }
  
  
  return {
    lookup: lookup
  };
};

exports['@implements'] = 'module:bixby-sd';
exports['@singleton'] = true;
exports['@require'] = [
  'http://i.bixbyjs.org/ns/Resolver'
];
