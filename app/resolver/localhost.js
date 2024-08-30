var LocalhostResolver = require('../../lib/localhostresolver');

exports = module.exports = function(registry) {
  return new LocalhostResolver(registry);
};

exports['@require'] = [
  'module:bixby-ns.ServiceRegistry'
];
