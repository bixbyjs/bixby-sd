exports = module.exports = function(services) {
  var HostsResolver = require('../../lib/hostsresolver');
  
  return new HostsResolver(services);
};

exports['@require'] = [ 'http://i.bixbyjs.org/services' ];
