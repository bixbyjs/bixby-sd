/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../app/services');


describe('services', function() {
  
  it.skip('should get service', function(done) {
    factory()
      .then(function(services) {
        console.log(svc);
        
        var svc = services.get('foo');
        console.log(svc)
      })
      .catch(done);
  });
  
});
