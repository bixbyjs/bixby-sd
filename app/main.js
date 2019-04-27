exports = module.exports = function(registry, services) {
  var api = {};
  
  api.resolve = function(type, domain, rrtype, cb) {
    registry.resolve.apply(registry, arguments);
  };
  
  api.resolveSrv = function(type, domain, cb) {
    registry.resolveSrv.apply(registry, arguments);
  };
  
  api.createConnection = function(type, options) {
    return services.createConnection.apply(services, arguments);
  }
  
  return api;
};

exports['@implements'] = 'http://i.bixbyjs.org/sd';
exports['@singleton'] = true;
exports['@require'] = [
  './registry',
  './services'
];
