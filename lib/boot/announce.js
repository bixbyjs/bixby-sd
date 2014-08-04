/**
 * Module dependencies.
 */
var pkginfo = require('pkginfo')
  , uri = require('url')
  , path = require('path')
  , fs = require('fs')
  , utils = require('../utils')
  , existsSync = fs.existsSync || path.existsSync; // <=0.6

var SCRIPT_RUNNERS = [ '_mocha' ];

/**
 * Component-ized boot phase that announces services.
 *
 * To utilize this component within an application, configure the IoC loader
 * to use common service discovery components.
 *
 *     IoC.loader(require('bixby-sd'));
 *
 * @param {Settings} settings
 * @param {Logger} logger
 * @return {Function}
 */
exports = module.exports = function(registry, settings, logger) {

  return function announce(done) {
    var config = settings.get('sd') || {};
    if (!config.domain) { throw new Error('Misconfigured service announcement: missing domain'); }
    
    var root = path.dirname(pkginfo.find(require.main))
      , fsegs = require.main.filename.split('/');
      , file = path.resolve(root, 'app/services.json')
      , domain = config.domain
      , port, address, protocol
      , addresses;

    if (fsegs[fsegs.length - 1].indexOf(SCRIPT_RUNNERS) !== -1) {
      root = process.cwd();
    }

    if (!existsSync(file)) { return done(new Error('No such file "' + file + '"')); }
    
    if (this.httpServer || this.httpsServer) {
      var server = this.httpsServer || this.httpServer
        , addr = server.address();
      
      protocol = this.httpsServer ? 'https' : 'http';
      address = addr.address
      port = addr.port
    } else {
      return done(new Error('Unable to determine address of server'));
    }
    
    if (address == '0.0.0.0') {
      addresses = utils.ips('IPv4');
    } else {
      addresses = [ address ];
    }
    
    var data = fs.readFileSync(file, 'utf8')
      , services;
    try {
      services = JSON.parse(data);
    } catch (_) {
      return done(new Error('Failed to parse services'));
    }
    
    
    // For each service offered by the application, announce it's availability
    // on all addresses.
    var types = Object.keys(services)
      , sidx = 0;
    
    function siter(err) {
      if (err) { return done(err); }
      
      var type = types[sidx++];
      if (!type) { return done(); }
      
      var target = services[type]
        , aidx = 0;
      
      function aiter(err) {
        if (err) { return siter(err); }
        
        var address = addresses[aidx++];
        if (!address) { return siter(); }
        
        var record;
        if (typeof target == 'boolean') {
          if (/^[a-f0-9:]+$/.test(address)) {
            record = '[' + address + ']:' + port;  // IPv6
          } else {
            record = address + ':' + port;  // IPv4
          }
        } else if (typeof target == 'string') {
          record = uri.format({ protocol: protocol, hostname: address, port: port, pathname: target });
        } else {
          aiter(new Error('Invalid record for service "' + type + '"'));
        }
        
        logger.info('Announcing service %s in %s at %s', type, domain, record);
        registry.announce(domain, type, record, function(err) {
          if (err) { return aiter(err); }
          return aiter();
        });
      }
      aiter();
    }
    siter();
  }
}


/**
 * Component annotations.
 */
exports['@require'] = [ '../registry', 'settings', 'logger' ];
