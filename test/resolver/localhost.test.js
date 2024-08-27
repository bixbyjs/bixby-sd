/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/resolver/localhost');


describe.skip('resolver/localhost', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should do something', function(done) {
    
    var resolver = factory();
    resolver.resolve('_postgresql._tcp', 'SRV', function(err, records) {
      expect(err).to.be.null;
      expect(records).to.deep.equal([ {
        uri: 'postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp'
      } ]);
      done();
    });
    
  });
  
  
}); // resolver/hosts
