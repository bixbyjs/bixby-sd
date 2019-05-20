exports = module.exports = function(ns, services) {
  var ResolveError = require('../lib/errors/resolveerror');
  
  // https://github.com/dhruvbird/dns-srv
  
  // http://rossduggan.ie/blog/infrastructure/cnames-how-do-they-work/index.html
  
  
  function resolveHost(name, cb) {
    // TODO: call lookup to get IPv4 and v6
    ns.resolve(name, 'A', function(err, addrs) {
      if (err) { return cb(err); }
      
      if (addrs.length == 0) {
        ns.resolve(name, 'CNAME', function(err, name) {
          if (err) { return cb(err); }
          // repeat host resolution, using canonical name
          return resolveHost(name[0], cb);
        });
        return;
      }
      
      // TODO: pass cname down in more obvious fashion
      return cb(null, addrs, name);
    });
  }
  
  function resolveService(type, cb) {
    ns.resolve(type, 'SRV', function(err, addrs) {
      if (err) { return cb(err); }
      
      // accumulate the records, pending all resolveHost calls.
      // save first error, if any
      var records = [], pending = 0
        , error;
      var complete = function(err, addrs) {
        error = error || err;
        if (addrs) { records = records.concat(addrs); }
        pending--;
        if (pending == 0) {
          return cb(error, records);
        }
      };
      
      // TODO: group srv records
      pending = addrs.length;
      addrs.forEach(function(addr) {
        resolveHost(addr.name, function(err, addrs, name) {
          if (err) { return complete(err); }
          addrs = addrs.map(function(a) {
            return { name: name, address: a, port: addr.port }
          })
          complete(err, addrs);
        });
      });
    });
  }
  
  
  return function(types, cb) {
    
    function resolve(i) {
      var type = types[i];
      if (!type) {
        return cb(new ResolveError("Cannot find service '" + types.join(' ') + "'", 'ENOTFOUND', types));
      }
      
      resolveService(type, function(err, addrs) {
        if (err) { return resolve(i + 1); }
        
        
        function connect(i) {
          var addr = addrs[i];
          if (!addr) {
            // TODO: better error
            return cb(new Error('FAILED TO CONNECT'));
          }
          
          
          var parts = type.split('.')
            , name = parts[0]
          
          //console.log(name);
          
          // TODO: err handing and timeouts
          
          var conn = services.createConnection(name, addr, function() {
            //console.log('CONNNECTED!');
            
            return cb(null, this);
            
          });
        };
        connect(0);
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
