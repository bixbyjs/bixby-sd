function API(s) {
  this._switch = s;
}

API.prototype.resolve = function(hostname, rrtype, cb) {
  return this._switch.resolve.apply(this._switch, arguments);
};


module.exports = API;
