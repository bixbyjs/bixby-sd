/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../app/resolver');
var Switch = require('../lib/switch');


describe('resolver', function() {
  var _container = {
    components: function(){},
    create: function(){}
  };
  var _services = {
    createConnection: function(){}
  };
  var _logger = {
    emergency: function(){},
    alert: function(){},
    critical: function(){},
    error: function(){},
    warning: function(){},
    notice: function(){},
    info: function(){},
    debug: function(){}
  };
  
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('module:bixby-sd.Resolver');
    expect(factory['@singleton']).to.equal(true);
  });
  
  it('should create resolver with support for localhost domain', function(done) {
    var container = new Object();
    container.components = sinon.stub().returns([]);
    var environResolver = new Object();
    var portResolver = new Object();
    
    var ResolverStub = sinon.stub().returns(sinon.createStubInstance(Switch));
    var factory = $require('../app/resolver',
      { '../lib/switch': ResolverStub }
    );
    
    factory(container, environResolver, portResolver, _logger)
      .then(function(resolver) {
        expect(resolver).to.be.an.instanceof(Switch);
        expect(resolver.use.callCount).to.equal(2);
        expect(resolver.use.getCall(0).args[0]).to.equal('localhost');
        expect(resolver.use.getCall(0).args[1]).to.equal(environResolver);
        expect(resolver.use.getCall(1).args[0]).to.equal('localhost');
        expect(resolver.use.getCall(1).args[1]).to.equal(portResolver);
        done();
      })
      .catch(done);
  }); // should create resolver with support for localhost domain
  
  describe('Resolver', function() {
    
    describe('#resolve', function() {
      
      it('should search localhost domain and yield records from first successful service', function(done) {
        var container = new Object();
        container.components = sinon.stub().returns([]);
        var environResolver = new Object();
        environResolver.resolve = sinon.stub().yieldsAsync(null, [ {
          name: 'postgres.test',
          port: 45432
        } ])
        var portResolver = new Object();
        /*
        portResolver.resolve = sinon.stub().yieldsAsync(null, [ {
          name: 'localhost',
          port: 5432
        } ]);
        */
        
        factory(container, environResolver, portResolver, _logger)
          .then(function(resolver) {
            resolver.resolve('_postgresql._tcp', 'SRV', function(err, addresses) {
              if (err) { return done(err); }
              
              expect(environResolver.resolve.callCount).to.equal(1);
              expect(environResolver.resolve.getCall(0).args[0]).to.equal('_postgresql._tcp.localhost');
              expect(environResolver.resolve.getCall(0).args[1]).to.equal('SRV');
              //expect(portResolver.resolve.callCount).to.equal(0);
              
              expect(addresses).to.deep.equal([ {
                name: 'postgres.test',
                port: 45432
              } ]);
              done();
            });
          })
          .catch(done);
      }); // should search localhost domain and yield records from first successful service
      
    }); // #resolve
    
  }); // Resolver
  
}); // resolver
