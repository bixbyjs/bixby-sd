/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/resolver/environ');


describe('resolver/environ', function() {
  
  it('should resolve to value of environment variable matching service name', function(done) {
    var isdef = ('POSTGRESQL_URL' in process.env)
      , value = process.env['POSTGRESQL_URL'];
    
    process.env['POSTGRESQL_URL'] = 'postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp';
    
    var resolver = factory();
    resolver.resolve('_postgresql._tcp', 'URI', function(err, records) {
      if (isdef) { process.env['POSTGRESQL_URL'] = value; }
      else { delete process.env['POSTGRESQL_URL'] }
      
      expect(err).to.be.null;
      expect(records).to.deep.equal([ {
        uri: 'postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp'
      } ]);
      done();
    });
  }); // should error when environment variable is not defined
  
  it('should resolve to value of generic environment variable where scheme matches service name', function(done) {
    var isdef = ('DATABASE_URL' in process.env)
      , value = process.env['DATABASE_URL'];
    
    process.env['DATABASE_URL'] = 'postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp';
    
    var resolver = factory();
    resolver.resolve('_postgresql._tcp', 'URI', function(err, records) {
      if (isdef) { process.env['DATABASE_URL'] = value; }
      else { delete process.env['DATABASE_URL'] }
      
      expect(err).to.be.null;
      expect(records).to.deep.equal([ {
        uri: 'postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp'
      } ]);
      done();
    });
  }); // should resolve to value of generic environment variable where scheme matches service name
  
  it('should error when environment variable is not defined', function(done) {
    var isdef = ('POSTGRESQL_URL' in process.env)
      , value = process.env['POSTGRESQL_URL'];
    
    delete process.env['POSTGRESQL_URL'];
    
    var resolver = factory();
    resolver.resolve('_postgresql._tcp', 'URI', function(err, records) {
      if (isdef) { process.env['POSTGRESQL_URL'] = value; }
      
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('queryUri ENOTFOUND _postgresql._tcp');
      expect(err.code).to.equal('ENOTFOUND');
      done();
    });
  }); // should error when environment variable is not defined
  
});
