function RoutingUpdater() {
  this._services = [];
}

RoutingUpdater.prototype.use = function(zone, module) {
  if (typeof zone != 'string') {
    module = zone;
    zone = undefined;
  }
  
  this._services.push({ module: module, zone: zone });
};

RoutingUpdater.prototype.update = function(hostname, rrtype, rr, cb) {
  console.log('## RoutingUpdater#update');
  console.log(hostname);
  console.log(rrtype);
  console.log(rr);
  
}



module.exports = RoutingUpdater;
