function Switch() {
  this._zones = {};
  // TODO: make this dynamic
  this._search = [ 'consul' ];
}

Switch.prototype.use = function(zone, module) {
  this._zones[zone] = module;
};

Switch.prototype.resolve = function(hostname, rrtype, cb) {
  var fqdns = [ hostname ]
    , parts = hostname.split('.');
  
  
  if (parts.length == 1) {
    // not fully qualified
    fqdns = this._search.map(function(domain) { return [ hostname, domain ].join('.'); });
  }
  
  var self = this;
  (function iter(i) {
    var fqdn = fqdns[i]
      , parts = fqdn.split('.');
    if (!fqdn) {
      // TODO: better error
      return cb(new Error('NOT FOUND'));
    }
    
    
    // TODO: improve search with trie so multi-level domains are supported
    var tld = parts[parts.length - 1];
    var zone = self._zones[tld];
    return zone.resolve.call(zone, fqdn, rrtype, cb);
  })(0);
};



module.exports = Switch;
