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
    var portResolver = new Object();
    var environResolver = new Object();
    
    var ResolverStub = sinon.stub().returns(sinon.createStubInstance(Switch));
    var factory = $require('../app/resolver',
      { '../lib/switch': ResolverStub }
    );
    var promise = factory(container, portResolver, environResolver, _logger);
    
    factory(container, _services, _logger)
      .then(function(resolver) {
        expect(resolver).to.be.an.instanceof(Switch);
        expect(resolver.use.callCount).to.equal(2);
        expect(resolver.use.getCall(0).args[0]).to.equal('localhost.');
        expect(resolver.use.getCall(0).args[1]).to.equal(environResolver);
        done();
      })
      .catch(done);
  }); // should create resolver with support for localhost domain
  
}); // switch
