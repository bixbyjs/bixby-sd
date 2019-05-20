function NSResolveError(message, addresses) {
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'NSConnectError';
  this.message = message;
  this.addresses = addresses;
}

NSResolveError.prototype = Error.prototype;


module.exports = NSResolveError;
