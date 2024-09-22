/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../app/resolver/environ');


describe('resolver/environ', function() {
  
  it('should resolve SRV to value of environment variable matching service name', function(done) {
    var ishdef = ('POSTGRESQL_HOST' in process.env)
      , hvalue = process.env['POSTGRESQL_HOST']
      , ispdef = ('POSTGRESQL_PORT' in process.env)
      , pvalue = process.env['POSTGRESQL_PORT'];
    
    process.env['POSTGRESQL_HOST'] = 'bf1036d9-c2ba-4ae3-ad58-8d14a50117b3.pg.example.com';
    process.env['POSTGRESQL_PORT'] = 45432;
    
    var registry = new Object();
    registry.get = sinon.stub().returns(undefined);
    
    var resolver = factory(registry);
    resolver.resolve('_postgresql._tcp.localhost', 'SRV', function(err, records) {
      if (ishdef) { process.env['POSTGRESQL_HOST'] = hvalue; }
      else { delete process.env['POSTGRESQL_HOST'] }
      if (ispdef) { process.env['POSTGRESQL_PORT'] = pvalue; }
      else { delete process.env['POSTGRESQL_PORT'] }
      
      expect(registry.get.callCount).to.equal(1);
      expect(registry.get.getCall(0).args[0]).to.equal('postgresql');
      expect(registry.get.getCall(0).args[1]).to.equal('tcp');
      
      expect(err).to.be.null;
      expect(records).to.deep.equal([ {
        name: 'bf1036d9-c2ba-4ae3-ad58-8d14a50117b3.pg.example.com',
        port: 45432
      } ]);
      done();
    });
  }); // should resolve to value of environment variable matching service name
  
  it('should resolve to value of environment variable matching service name', function(done) {
    var isdef = ('POSTGRESQL_URL' in process.env)
      , value = process.env['POSTGRESQL_URL'];
    
    process.env['POSTGRESQL_URL'] = 'postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp';
    
    var registry = new Object();
    registry.get = sinon.stub().returns(undefined);
    
    var resolver = factory(registry);
    resolver.resolve('_postgresql._tcp.localhost', 'URI', function(err, records) {
      if (isdef) { process.env['POSTGRESQL_URL'] = value; }
      else { delete process.env['POSTGRESQL_URL'] }
      
      expect(registry.get.callCount).to.equal(1);
      expect(registry.get.getCall(0).args[0]).to.equal('postgresql');
      expect(registry.get.getCall(0).args[1]).to.equal('tcp');
      
      expect(err).to.be.null;
      expect(records).to.deep.equal([ {
        url: 'postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp'
      } ]);
      done();
    });
  }); // should resolve to value of environment variable matching service name
  
  it('should resolve to value of environment variable matching service alias', function(done) {
    var isdef = ('POSTGRES_URL' in process.env)
      , value = process.env['POSTGRES_URL'];
    
    process.env['POSTGRES_URL'] = 'postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp';
    
    var registry = new Object();
    registry.get = sinon.stub().returns({ aliases: [ 'postgres', 'pg' ]});
    
    var resolver = factory(registry);
    resolver.resolve('_postgresql._tcp.localhost', 'URI', function(err, records) {
      if (isdef) { process.env['POSTGRES_URL'] = value; }
      else { delete process.env['POSTGRES_URL'] }
      
      expect(registry.get.callCount).to.equal(1);
      expect(registry.get.getCall(0).args[0]).to.equal('postgresql');
      expect(registry.get.getCall(0).args[1]).to.equal('tcp');
      
      expect(err).to.be.null;
      expect(records).to.deep.equal([ {
        url: 'postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp'
      } ]);
      done();
    });
  }); // should resolve to value of environment variable matching service alias
  
  it('should resolve to value of environment variable matching second service alias', function(done) {
    var isdef = ('PG_URL' in process.env)
      , value = process.env['PG_URL'];
    
    process.env['PG_URL'] = 'postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp';
    
    var registry = new Object();
    registry.get = sinon.stub().returns({ aliases: [ 'postgres', 'pg' ]});
    
    var resolver = factory(registry);
    resolver.resolve('_postgresql._tcp.localhost', 'URI', function(err, records) {
      if (isdef) { process.env['PG_URL'] = value; }
      else { delete process.env['PG_URL'] }
      
      expect(registry.get.callCount).to.equal(1);
      expect(registry.get.getCall(0).args[0]).to.equal('postgresql');
      expect(registry.get.getCall(0).args[1]).to.equal('tcp');
      
      expect(err).to.be.null;
      expect(records).to.deep.equal([ {
        url: 'postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp'
      } ]);
      done();
    });
  }); // should resolve to value of environment variable matching second service alias
  
  it('should resolve to value of generic environment variable where scheme matches service name', function(done) {
    var isdef = ('DATABASE_URL' in process.env)
      , value = process.env['DATABASE_URL'];
    
    process.env['DATABASE_URL'] = 'postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp';
    
    var registry = new Object();
    registry.get = sinon.stub().returns(undefined);
    
    var resolver = factory(registry);
    resolver.resolve('_postgresql._tcp.localhost', 'URI', function(err, records) {
      if (isdef) { process.env['DATABASE_URL'] = value; }
      else { delete process.env['DATABASE_URL'] }
      
      expect(registry.get.callCount).to.equal(1);
      expect(registry.get.getCall(0).args[0]).to.equal('postgresql');
      expect(registry.get.getCall(0).args[1]).to.equal('tcp');
      
      expect(err).to.be.null;
      expect(records).to.deep.equal([ {
        url: 'postgresql://other@localhost/otherdb?connect_timeout=10&application_name=myapp'
      } ]);
      done();
    });
  }); // should resolve to value of generic environment variable where scheme matches service name
  
  it('should resolve to value of generic environment variable where scheme matches service alias', function(done) {
    var isdef = ('DATABASE_URL' in process.env)
      , value = process.env['DATABASE_URL'];
    
    process.env['DATABASE_URL'] = 'postgres://other@localhost/otherdb?connect_timeout=10&application_name=myapp';
    
    var registry = new Object();
    registry.get = sinon.stub().returns({ aliases: [ 'postgres', 'pg' ]});
    
    var resolver = factory(registry);
    resolver.resolve('_postgresql._tcp.localhost', 'URI', function(err, records) {
      if (isdef) { process.env['DATABASE_URL'] = value; }
      else { delete process.env['DATABASE_URL'] }
      
      expect(registry.get.callCount).to.equal(1);
      expect(registry.get.getCall(0).args[0]).to.equal('postgresql');
      expect(registry.get.getCall(0).args[1]).to.equal('tcp');
      
      expect(err).to.be.null;
      expect(records).to.deep.equal([ {
        url: 'postgres://other@localhost/otherdb?connect_timeout=10&application_name=myapp'
      } ]);
      done();
    });
  }); // should resolve to value of generic environment variable where scheme matches service alias
  
  it('should error when environment variable is not defined', function(done) {
    var isdef = ('POSTGRESQL_URL' in process.env)
      , value = process.env['POSTGRESQL_URL'];
    
    delete process.env['POSTGRESQL_URL'];
    
    var registry = new Object();
    registry.get = sinon.stub().returns(undefined);
    
    var resolver = factory(registry);
    resolver.resolve('_postgresql._tcp.localhost', 'URI', function(err, records) {
      if (isdef) { process.env['POSTGRESQL_URL'] = value; }
      
      expect(registry.get.callCount).to.equal(1);
      expect(registry.get.getCall(0).args[0]).to.equal('postgresql');
      expect(registry.get.getCall(0).args[1]).to.equal('tcp');
      
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('queryUri ENOTFOUND _postgresql._tcp.localhost');
      expect(err.code).to.equal('ENOTFOUND');
      expect(err.hostname).to.equal('_postgresql._tcp.localhost');
      done();
    });
  }); // should error when environment variable is not defined
  
  it('should error when generic environment variable has scheme that does not match service name', function(done) {
    var isdef = ('DATABASE_URL' in process.env)
      , value = process.env['DATABASE_URL'];
    
    process.env['DATABASE_URL'] = 'mysql://user_name@198.51.100.2:3306/world';
    
    var registry = new Object();
    registry.get = sinon.stub().returns(undefined);
    
    var resolver = factory(registry);
    resolver.resolve('_postgresql._tcp.localhost', 'URI', function(err, records) {
      if (isdef) { process.env['DATABASE_URL'] = value; }
      else { delete process.env['DATABASE_URL'] }
      
      expect(registry.get.callCount).to.equal(1);
      expect(registry.get.getCall(0).args[0]).to.equal('postgresql');
      expect(registry.get.getCall(0).args[1]).to.equal('tcp');
      
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('queryUri ENOTFOUND _postgresql._tcp.localhost');
      expect(err.code).to.equal('ENOTFOUND');
      expect(err.hostname).to.equal('_postgresql._tcp.localhost');
      done();
    });
  }); // should error when generic environment variable has scheme that does not match service name
  
});
