var EnvironResolver = require('../../lib/environresolver');

exports = module.exports = function(list) {
  return new EnvironResolver(list);
};

exports['@require'] = [
  'http://i.bixbyjs.org/ns/ServicesList'
];
