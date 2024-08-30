/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/resolver/localhost');
var events = require('events');


describe('resolver/localhost', function() {
  
  it('should resolve to value of environment variable matching service name', function(done) {
    var net = {
      createConnection: sinon.spy(function() {
        console.log('CREATE CONNECTION!');
      
        var emitter = new events.EventEmitter();
        process.nextTick(function() {
          emitter.emit('connect');
        });
        return emitter;
      })
    }
    
    var LocalhostResolver = $require('../../lib/localhostresolver', {
      'net': net
    });
    
    var factory = $require('../../app/resolver/localhost', {
      '../../lib/localhostresolver': LocalhostResolver
    });
    
    
    var registry = new Object();
    registry.get = sinon.stub().returns({ port: 6432, protocol: 'tcp' })
    
    var resolver = factory(registry);
    resolver.resolve('_postgresql._tcp', 'SRV', function(err, records) {
      expect(err).to.be.null;
      expect(records).to.deep.equal([ {
        name: 'localhost',
        port: undefined,
        priority: 1,
        weight: 1
      } ]);
      done();
    });
    
  });
  
  
}); // resolver/hosts
