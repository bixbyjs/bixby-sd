var dns = require('dns');


//dns.resolveSrv('_xmpp-client._tcp.gmail.com', function(err, recs) {
//dns.resolveSrv('_xmpp-client._tcp.jabber.org', function(err, recs) {
dns.resolve('_xmpp-client._tcp.jabber.org', 'SRV', function(err, recs) {
//dns.resolve('_xmpp-client._tcp.localhost', 'SRV', function(err, recs) {
  console.log(err);
  console.log(recs);
})

dns.resolve('hermes2.jabber.org', 'A', function(err, recs) {
  console.log(err);
  console.log(recs);
})

dns.resolve('_services._dns-sd._udp.local.', 'SRV', function(err, recs) {
//dns.resolve('_xmpp-client._tcp.localhost', 'SRV', function(err, recs) {
  console.log(err);
  console.log(recs);
})

dns.resolve('fs1.localdomain', 'A', function(err, recs) {
  console.log(err);
  console.log(recs);
})

dns.resolve('fs1', 'A', function(err, recs) {
  console.log(err);
  console.log(recs);
})
