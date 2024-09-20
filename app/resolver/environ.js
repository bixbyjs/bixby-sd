var EnvironResolver = require('../../lib/environresolver');

exports = module.exports = function(registry) {
  return new EnvironResolver(registry);
};

exports['@require'] = [
  'module:bixby-ns.ServiceRegistry'
];
