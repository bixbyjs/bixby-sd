var isValidHostname = require('is-valid-hostname');
var utils = require('./utils');


function Switch() {
  this._zones = {};
  this._domain = 'localhost'; // TODO: Should this be localdomain?
  this._search = [];
}

Switch.prototype.use = function(zone, module) {
  if (typeof zone != 'string') {
    module = zone;
    zone = '';
  }
  
  var zd = zone + '.';
  this._zones[zd] = (this._zones[zd] || []).concat(module);
};

/**
 * Sets the domain name the resolver should use when resolving host names.
 *
 * This setting is equivalent to what would be configured via the domain name
 * option ({@link https://datatracker.ietf.org/doc/html/rfc2132#section-3.17 option 15})
 * using {@link https://datatracker.ietf.org/doc/html/rfc2131 DHCP}.  This
 * setting can vary independently of configuration obtained via other sources,
 * in order to facilitate cluster-specific configuration mechansisms.
 *
 * @public
 * @param {string} domain
 */
Switch.prototype.domain = function(domain) {
  this._domain = domain;
};

/**
 * Sets the domain search list the resolver should use when resolving host names.
 *
 * This setting is equivalent to what would be configured via the domain search
 * option ({@link https://datatracker.ietf.org/doc/html/rfc3397 option 119})
 * using {@link https://datatracker.ietf.org/doc/html/rfc2131 DHCP}, or the
 * `search` option within {@link https://man7.org/linux/man-pages/man5/resolv.conf.5.html resolv.conf}.
 * This setting can vary independently of configuration obtained via other
 * sources, in order to facilitate cluster-specific configuration mechansisms.
 *
 * @public
 * @param {string} domain
 */
Switch.prototype.search = function(domain) {
  if (domain[domain.length - 1] == '.') { domain = domain.slice(0, -1); }
  this._search.push(domain);
};

Switch.prototype.leave = function(domain) {
  var idx = this._search.indexOf(domain);
  if (idx != -1) {
    this._search.splice(idx, 1);
  }
};

Switch.prototype.resolve = function(hostname, rrtype, cb) {
  var firstError;
  
  var labels = hostname.split('.')
    , fqdns = [ hostname ];
  
  if (labels.length == 1 || !isValidHostname(labels[labels.length - 1])) {
    fqdns = [ this._domain ].concat(this._search).map(function(domain) { return [ hostname, domain ].join('.'); });
  }
  
  var self = this;
  function niter(i, e) {
    var fqdn = fqdns[i]
      , error;
    if (!fqdn) {
      error = new Error('resolve ENOTFOUND ' + hostname);
      error.code = 'ENOTFOUND';
      return cb(firstError || error);
    }
    
    // Find the zone which resolves this domain name.
    var labels = fqdn.split('.')
      , zone, zd, i, len;
    for (i = labels.length - 1; i > 0; --i) {
      zd = labels.slice(0 - i).join('.') + '.';
      zone = self._zones[zd];
      if (zone) { break; }
    }
    
    if (!zone) {
      // TODO: 
      console.log('######### NOT HANDLED NO ZONE');
      
      // TODO: probably niter
    }
    
    function ziter(j, error) {
      var resolver = zone[j];
      if (!resolver) {
        if (error) { return cb(error); }
        console.log('######### NOT HANDLED NO RESOLVER');
        console.log(error);
        return;
      }
      
      try {
        resolver.resolve(fqdn, rrtype, function(err, records) {
          if (err) { return ziter(j + 1, error || err); }
          return cb(null, records);
        });
      } catch(ex) {
        // dns throws when trying to resolve URI records
        firstError = firstError || ex;
        return ziter(j + 1, error || ex);
      }
    };
    ziter(0);    
  };
  niter(0);
};

module.exports = Switch;
