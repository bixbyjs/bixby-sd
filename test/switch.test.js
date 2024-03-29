/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../app/resolver');
var Switch = require('../lib/switch');


describe('switch', function() {
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
  
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/ns/Resolver');
    expect(factory['@singleton']).to.equal(true);
  });
  
  it('should resolve with switch', function(done) {
    sinon.stub(_container, 'components').returns([]);
    
    var SwitchStub = sinon.stub().returns(sinon.createStubInstance(Switch));
    var promise = $require('../app/resolver',
      { '../lib/switch': SwitchStub }
    )(_container, _services, _logger);
    
    promise.then(function(s) {
      expect(s).to.be.an.instanceof(Switch);
      //expect(s.use).to.have.been.calledTwice;
      done();
    }).catch(done);
  }); // should resolve with session store found via service discovery
  
}); // switch
