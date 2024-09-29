var PortResolver = require('../../lib/portresolver');

exports = module.exports = function(registry) {
  return new PortResolver(registry);
};

exports['@require'] = [
  'module:bixby-ns.ServiceRegistry'
];
