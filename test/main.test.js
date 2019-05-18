/* global describe, it, expect */

var factory = require('../app/main');


describe('main', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.deep.equal([ 'http://i.bixbyjs.org/ns', 'http://i.bixbyjs.org/sd' ]);
    expect(factory['@singleton']).to.equal(true);
  });
  
});
