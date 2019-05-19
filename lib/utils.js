exports.withinZone = function(name, zone) {
  var parts = name.split('.')
    , zparts
    , i, len;
  if (parts.length == 1) {
    // The name is not fully qualified, and therefore not in a zone.
    return zone ? false : true;
  }
  if (!zone) { return false; }
  if (zone == '.') { return true; }
  
  if (zone[zone.length - 1] == '.') { zone = zone.slice(0, -1); }
  zparts = zone.split('.');
  for (i = 1, len = zparts.length; i <= len; ++i) {
    if (parts[parts.length - i] !== zparts[zparts.length - i]) { return false; }
  }
  return true;
};
