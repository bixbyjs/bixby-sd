/* global describe, it, expect */

var expect = require('chai').expect;
var sinon = require('sinon');


describe('bixby-ns', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('ns');
      
      expect(json.assembly.components).to.have.length(3);
      expect(json.assembly.components).to.include('resolver');
      expect(json.assembly.components).to.include('serviceslist');
      expect(json.assembly.components).to.include('updater');
    });
  });
  
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  
});

afterEach(function() {
  sinon.restore();
});
