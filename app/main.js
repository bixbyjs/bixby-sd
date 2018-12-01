exports = module.exports = function(registry) {
  var api = {};
  
  api.resolve = function(type, domain, rrtype, cb) {
    if (typeof domain == 'function') {
      cb = domain;
      domain = undefined;
    }
    
    console.log('RESOLVE SERVICE!');
    console.log(type);
    //resolver.resolve(name, rrtype, cb);
    
    registry.resolve(type, function(err, records) {
      cb(err, records);
    });
  }
  
  return api;
};

exports['@implements'] = 'http://i.bixbyjs.org/sd';
exports['@singleton'] = true;
exports['@require'] = [
  './registry',
];
