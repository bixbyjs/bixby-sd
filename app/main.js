exports = module.exports = function(s) {
  var API = require('../lib/api');
  
  return new API(s);
};

// TODO: Remove the sd namespace
exports['@implements'] = [ 'http://i.bixbyjs.org/ns', 'http://i.bixbyjs.org/sd' ];
exports['@singleton'] = true;
exports['@require'] = [
  './switch'
];
