exports = module.exports = function(registry) {
  var api = {};
  
  api.resolve = function(type, domain, rrtype, cb) {
    registry.resolve.apply(registry, arguments);
  };
  
  api.resolveSrv = function(type, domain, cb) {
    registry.resolveSrv.apply(registry, arguments);
  };
  
  return api;
};

exports['@implements'] = 'http://i.bixbyjs.org/sd';
exports['@singleton'] = true;
exports['@require'] = [
  './registry',
];
