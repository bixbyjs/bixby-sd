exports = module.exports = function(services) {
  var LocalhostResolver = require('../../lib/localhostresolver');
  
  return new LocalhostResolver(services);
};

exports['@require'] = [ 'http://i.bixbyjs.org/services' ];
