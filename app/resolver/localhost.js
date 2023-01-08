var LocalhostResolver = require('../../lib/localhostresolver');

exports = module.exports = function(list) {
  return new LocalhostResolver(list);
};

exports['@require'] = [
  'http://i.bixbyjs.org/ns/ServicesList'
];
