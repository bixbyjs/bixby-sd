/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/resolver/localhost');
var events = require('events');


describe('resolver/localhost', function() {
  
  it('should resolve SRV when connection to port is established', function(done) {
    var net = {
      createConnection: sinon.spy(function(port) {
        var socket = new events.EventEmitter();
        process.nextTick(function() {
          socket.remotePort = port;
          socket.emit('connect');
        });
        return socket;
      })
    }
    var LocalhostResolver = $require('../../lib/localhostresolver', {
      'net': net
    });
    var factory = $require('../../app/resolver/localhost', {
      '../../lib/localhostresolver': LocalhostResolver
    });
    
    
    var registry = new Object();
    registry.get = sinon.stub().returns({ port: 5432, protocol: 'tcp' });
    
    var resolver = factory(registry);
    resolver.resolve('_postgresql._tcp', 'SRV', function(err, records) {
      expect(err).to.be.null;
      
      expect(registry.get.callCount).to.equal(1);
      expect(registry.get.getCall(0).args[0]).to.equal('postgresql');
      expect(registry.get.getCall(0).args[1]).to.equal('tcp');
      expect(net.createConnection.callCount).to.equal(1);
      expect(net.createConnection.getCall(0).args[0]).to.equal(5432);
      
      expect(records).to.deep.equal([ {
        name: 'localhost',
        port: 5432,
        priority: 1,
        weight: 1
      } ]);
      done();
    });
  }); // should resolve SRV when connection to port is established
  
  it('should error resolving SRV when connection to port cannot be established', function(done) {
    var net = {
      createConnection: sinon.spy(function(port) {
        var socket = new events.EventEmitter();
        process.nextTick(function() {
          socket.emit('error', new Error('something went wrong'));
        });
        return socket;
      })
    }
    var LocalhostResolver = $require('../../lib/localhostresolver', {
      'net': net
    });
    var factory = $require('../../app/resolver/localhost', {
      '../../lib/localhostresolver': LocalhostResolver
    });
    
    
    var registry = new Object();
    registry.get = sinon.stub().returns({ port: 5432, protocol: 'tcp' });
    
    var resolver = factory(registry);
    resolver.resolve('_postgresql._tcp', 'SRV', function(err, records) {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('querySrv ENOTFOUND _postgresql._tcp');
      expect(err.code).to.equal('ENOTFOUND');
      
      expect(registry.get.callCount).to.equal(1);
      expect(registry.get.getCall(0).args[0]).to.equal('postgresql');
      expect(registry.get.getCall(0).args[1]).to.equal('tcp');
      expect(net.createConnection.callCount).to.equal(1);
      expect(net.createConnection.getCall(0).args[0]).to.equal(5432);
      
      expect(records).to.be.undefined;
      done();
    });
  }); // should error resolving SRV when connection to port cannot be established
  
  it('should error resolving SRV when service is not found in registry', function(done) {
    var net = {
      createConnection: sinon.spy(function(port) {
        var socket = new events.EventEmitter();
        process.nextTick(function() {
          socket.remotePort = port;
          socket.emit('connect');
        });
        return socket;
      })
    }
    var LocalhostResolver = $require('../../lib/localhostresolver', {
      'net': net
    });
    var factory = $require('../../app/resolver/localhost', {
      '../../lib/localhostresolver': LocalhostResolver
    });
    
    
    var registry = new Object();
    registry.get = sinon.stub().returns(undefined);
    
    var resolver = factory(registry);
    resolver.resolve('_postgresql._tcp', 'SRV', function(err, records) {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('querySrv ENOTFOUND _postgresql._tcp');
      expect(err.code).to.equal('ENOTFOUND');
      
      expect(registry.get.callCount).to.equal(1);
      expect(registry.get.getCall(0).args[0]).to.equal('postgresql');
      expect(registry.get.getCall(0).args[1]).to.equal('tcp');
      expect(net.createConnection.callCount).to.equal(0);
      
      expect(records).to.be.undefined;
      done();
    });
  }); // should error resolving SRV when service is not found in registry
  
});
