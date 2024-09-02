exports = module.exports = function(resolver) {
  
  
  return {
    lookup: function(hostname, options, cb) {
      //console.log('SD LOOKUP!');
      //console.log(this);
      //console.log(hostname);
      //console.log(options);
      
      // TODO: implement this properly
      
      resolver.resolve(hostname, 'A', function(err, addresses) {
        console.log(err);
        console.log(addresses);
        
        //if (err) { return cb(err); }
        //return cb(null, addresses[0]);
        
      });
    }
  };
};

exports['@implements'] = 'module:bixby-sd';
exports['@singleton'] = true;
exports['@require'] = [
  'http://i.bixbyjs.org/ns/Resolver'
];
