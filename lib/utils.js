var os = require('os');


exports.ips = function(fams, devs) {
  if (fams && !Array.isArray(fams)) { fams = [ fams ] }
  if (devs && !Array.isArray(devs)) { devs = [ devs ] }
  
  var arr = []
    , nics = os.networkInterfaces()
    , nic, dev, addr, i, len;
  
  for (dev in nics) {
    if (devs && devs.indexOf(dev) == -1) { continue; }
    
    nic = nics[dev];
    for (i = 0, len = nic.length; i < len; ++i) {
      addr = nic[i];
      if (addr.internal) { continue; }
      if (fams && fams.indexOf(addr.family) == -1) { continue; }
      arr.push(addr.address);
    }
  }
  return arr;
}
