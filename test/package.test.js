/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../app/main');


describe('bixby-sd', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('ns');
      
      expect(json.assembly.components).to.have.length(4);
      expect(json.assembly.components).to.include('resolver');
      expect(json.assembly.components).to.include('updater');
    });
  });
  
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  
  describe('#lookup', function() {
    
    it('should yield address and family', function(done) {
      var resolver = new Object();
      resolver.resolve = sinon.stub().yieldsAsync(null, [ '104.20.23.46' ]);
      
      var sd = factory(resolver);
      sd.lookup('nodejs.org', function(err, address, family) {
        if (err) { return done(err); }
        expect(address).to.equal('104.20.23.46');
        expect(family).to.equal(4);
        done();
      });
    }); // should yield address and family
    
    it('should yield array when all option is set to true', function(done) {
      var resolver = new Object();
      resolver.resolve = sinon.stub().yieldsAsync(null, [ '104.20.22.46', '104.20.23.46' ]);
      
      var sd = factory(resolver);
      sd.lookup('nodejs.org', { family: undefined, hints: 1024, all: true }, function(err, addresses) {
        if (err) { return done(err); }
        expect(addresses).to.deep.equal([
          { address: '104.20.22.46', family: 4 },
          { address: '104.20.23.46', family: 4 }
        ]);
        done();
      });
    }); // should yield array when all option is set to true
    
  }); // #lookup
  
});

afterEach(function() {
  sinon.restore();
});
