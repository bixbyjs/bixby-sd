var Switch = require('../../lib/switch');

exports = module.exports = function(localhost, environ) {
  
  var nss = new Switch();
  nss.use('localhost.', localhost, true);
  nss.use('localhost.', environ); // TODO: shoudl this be localhost?
  
  return nss;
}

exports['@implements'] = 'http://i.bixbyjs.org/ns/LocalResolver';
exports['@singleton'] = true;
exports['@require'] = [
  '../resolver/port',
  '../resolver/environ'
];
