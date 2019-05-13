exports = module.exports = function(ns, services) {
  
  // https://github.com/dhruvbird/dns-srv
  
  // http://rossduggan.ie/blog/infrastructure/cnames-how-do-they-work/index.html
  
  
  function resolveHost(name, cb) {
    ns.resolve(name, 'A', function(err, addrs) {
      console.log(err);
      console.log(addrs);
      
      if (err) { return cb(null, err); }
      
      if (addrs.length == 0) {
        console.log('RESOLVE THE CNAME!');
        ns.resolve(name, 'CNAME', function(err, name) {
          console.log(err);
          console.log(name);
          
          console.log('RESOLVE HOST AGAIN');
          return resolveHost(name[0], cb);
        });
        return;
      }
      
      return cb(null, addrs, name);
      
    });
  }
  
  function resolveService(type, cb) {
    ns.resolve(type, 'SRV', function(err, addrs) {
      console.log(err);
      console.log(addrs);
      
      var error = null, records = []
        , pending = 0;
      var complete = function(err, addrs) {
        error = error || err;
        records = records.concat(addrs);
        pending--;
        if (pending < 1) {
          return cb(error, records);
        }
      };
      
      // TODO: group srv records
      pending = addrs.length;
      
      addrs.forEach(function(addr) {
        console.log('RESOLVE HOST!');
        console.log(addr);
        
        resolveHost(addr.name, function(err, addrs, name) {
          console.log('RESOLVED HOST!!!!');
          console.log(err);
          console.log(addrs);
          console.log('CNAME: ' + name);
          
          addrs = addrs.map(function(a) {
            return { name: addr.name, port: addr.port, address: a, cname: name }
          })
          complete(err, addrs);
        });
        
      });
      
    });
  }
  
  
  return function(types) {
    console.log('CONNECT TO SERVICE! ' + types)
    
    function resolve(i) {
      console.log('ATTEMPT! ' + i);
      
      var type = types[i];
      if (!type) {
        // TODO: better error
        return cb(new Error('SERVICE NOT FOUND'));
      }
      
      console.log('RESOLVE: ' + type);
      
      resolveService(type, function(err, addrs) {
        console.log(err);
        console.log(addrs);
        
      });
      
      
    };
    
    
    process.nextTick(function() { resolve(0); });
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/ns/connect';
exports['@singleton'] = true;
exports['@require'] = [
  'http://i.bixbyjs.org/ns',
  'http://i.bixbyjs.org/services'
];
