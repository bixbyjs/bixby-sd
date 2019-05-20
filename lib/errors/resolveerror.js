function NSResolveError(message, code, names) {
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'NSConnectError';
  this.message = message;
  this.code = code;
  this.names = names;
}

NSResolveError.prototype = Error.prototype;


module.exports = NSResolveError;
