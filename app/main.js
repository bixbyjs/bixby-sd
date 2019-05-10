exports = module.exports = function(s) {
  var API = require('../lib/api');
  
  return new API(s);
};

exports['@implements'] = 'http://i.bixbyjs.org/sd';
exports['@singleton'] = true;
exports['@require'] = [
  './switch'
];
