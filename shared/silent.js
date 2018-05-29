var mlog = require("./logger")("silent:minor");

// Callback wrapper that catches errors and prevents them from propagating.
function silent(messageRegex, _next) {

	// The following function needs to be an ES5-style function in order for "arguments" to work.  Note: At the time of writing, the ES6 spread operator is not supported in Node.JS.
	return function() {
		var err = arguments[0];
		if (err && !messageRegex.test(err.message)) {
			return _next.apply(this, arguments);
		} else if (err) {
			// May 2018: The message could contain email-based identifiers. Do not log the full message.
			mlog.trace("Message suppressed (regex: " + messageRegex + ")");
		}
		var args = Array.prototype.slice.call(arguments, 1);
		args.unshift(null);
		_next.apply(this, args);
	};
};

module.exports = silent;
