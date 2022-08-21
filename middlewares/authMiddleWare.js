const jwt = require('jsonwebtoken');

const config = require('../config/server.config');

const isAuthenticated = (req, res, next) => {
	var cookies = req.signedCookies.cse311;
	var accessToken = '';

	// console.log("cookies: ", cookies);

	if (cookies == undefined) {
		req.session.message = 'Access denied';
		res.redirect('/error');
		return;
	}

	try {
		// console.log("Try");
		accessToken = cookies && cookies.split(' ')[1];
	} catch (err) {
		console.log(err);
		res.redirect('/error');
		return;
	}

	jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || config.JWT_SECRET, (err, decodeData) => {
		// console.log("ACCESS TOKEN VERIFY: ",tokens.accessToken);

		if (err) {
			if (err.name == 'TokenExpiredError') {
				// Timeout
				req.session.message = 'Login timeout';
				res.redirect('/error');
			}

			if (!err.message) {
				req.session.message = err.message;
				return res.redirect('/error');
			}
		} else {
			res.locals.data = decodeData;
			res.locals.isLogin = true;

			// console.log('decodeData: ', decodeData);

			// console.log("SUCCESS: AuthMiddleware: ", res.locals);
			// console.log("DECODE: AuthMiddleware: ", decodeData);

			// console.log("ERROR: AuthMMiddleware", err);

			next();
		}
	});
};

const isLogin = (req, res, next) => {
	var cookies = req.signedCookies.cse311;
	var accessToken = '';

	// console.log("cookies: ", cookies);

	if (cookies == undefined) {
		res.locals.isLogin = false;
		next();
	}

	try {
		// console.log("Try");
		accessToken = cookies && cookies.split(' ')[1];
	} catch (err) {
		res.locals.isLogin = false;
		next();
	}

	jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || config.JWT_SECRET, (err, decodeData) => {
		// console.log("ACCESS TOKEN VERIFY: ",tokens.accessToken);

		if (err) {
			res.locals.isLogin = false;
		} else {
			res.locals.isLogin = true;
		}

		next();
	});
};

module.exports = {
	isAuthenticated,
	isLogin,
};
