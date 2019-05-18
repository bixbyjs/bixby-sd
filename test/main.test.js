/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../app/main');
var API = require('../lib/api');


describe('main', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.deep.equal([ 'http://i.bixbyjs.org/ns', 'http://i.bixbyjs.org/sd' ]);
    expect(factory['@singleton']).to.equal(true);
  });
  
  it('should create API', function() {
    var _switch = new Object();
    var APIStub = sinon.stub().returns(sinon.createStubInstance(API));
    var api = $require('../app/main',
      { '../lib/api': APIStub }
    )(_switch);
    
    expect(APIStub).to.have.been.calledWithExactly(_switch).and.calledWithNew;
    expect(api).to.be.an.instanceof(API);
  }); // should create API
  
}); // main
