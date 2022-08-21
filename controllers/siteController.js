const landing = (req, res) => {
	const isLogin = res.locals.isLogin;

	res.render('index', { url: '/', isLogin: isLogin });
};

const login = (req, res) => {
	const isLogin = res.locals.isLogin;

	res.render('login', { url: '/login', isLogin: isLogin });
};

const signup = (req, res) => {
	const isLogin = res.locals.isLogin;

	res.render('signup', { url: '/signup', isLogin: isLogin });
};

const contact = (req, res) => {
	const isLogin = res.locals.isLogin;

	res.render('contact', { url: '/contact', isLogin: isLogin });
};

const errorPage = (req, res) => {
	const isLogin = res.locals.isLogin;

	const message = req.session.message ? req.session.message : 'The page you requested was not found';

	res.render('error', { url: '/error', isLogin: isLogin, message: message });
};

module.exports = {
	landing,
	login,
	signup,
	contact,
	errorPage,
};
