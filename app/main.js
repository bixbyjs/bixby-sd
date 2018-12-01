exports = module.exports = function(resolver) {
  var api = {};
  
  api.resolve = function(type, domain, rrtype, cb) {
    if (typeof domain == 'function') {
      cb = domain;
      domain = undefined;
    }
    
    console.log('RESOLVE SERVICE!');
    console.log(type);
    //resolver.resolve(name, rrtype, cb);
    
    cb();
  }
  
  return api;
};

exports['@implements'] = 'http://i.bixbyjs.org/sd';
exports['@singleton'] = true;
exports['@require'] = [
  //'http://i.bixbyjs.org/ns/Resolver',
  //'http://i.bixbyjs.org/ns/Updater'
];
