exports = module.exports = function(IoC, logger) {
  
  return Promise.resolve()
    .then(function() {
      return IoC.create('./registry/hosts');
    });
};

exports['@implements'] = 'http://i.bixbyjs.org/sd/Registry';
exports['@singleton'] = true;
exports['@require'] = [
  '!container',
  'http://i.bixbyjs.org/Logger'
];
