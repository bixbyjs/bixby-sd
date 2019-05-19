function Switch() {
  this._mechs = [];
  this._zones = {};
  this._search = [];
}

Switch.prototype.use = function(zone, module, join) {
  var domain = zone;
  if (domain[domain.length - 1] == '.') { domain = domain.slice(0, -1); }
  
  this._zones[zone] = module;
  if (join) {
    this.join(domain);
  }
};

Switch.prototype.join = function(domain) {
  this._search.push(domain);
};

Switch.prototype.leave = function(domain) {
  var idx = this._search.indexOf(domain);
  if (idx != -1) {
    this._search.splice(idx, 1);
  }
};

Switch.prototype.resolve = function(hostname, rrtype, cb) {
  var fqdns = [ hostname ]
    , parts = hostname.split('.');
  if (parts.length == 1) {
    // not fully qualified
    fqdns = this._search.map(function(domain) { return [ hostname, domain ].join('.'); });
  }
  
  console.log('RESOLVE: ' + hostname + ' ' + rrtype);
  console.log(fqdns);
  
  var self = this;
  (function iter(i) {
    var fqdn = fqdns[i]
      , parts;
    if (!fqdn) {
      // TODO: better error
      return cb(new Error('NOT FOUND'));
    }
    
    parts = fqdn.split('.')
      
    // TODO: improve search with trie so multi-level domains are supported
    var tld = parts[parts.length - 1];
    console.log('GETTING ZONE: ' + tld);
    var zone = self._zones[tld + '.'];
    if (!zone) {
      zone = self._zones['.'];
    }
    
    
    return zone.resolve.call(zone, fqdn, rrtype, cb);
  })(0);
};



module.exports = Switch;
