const jobController = require('../controllers/jobController');

const landing = async (req, res) => {
	const isLogin = res.locals.isLogin;

	res.render('index', { url: '/', isLogin: isLogin });
};

const login = async (req, res) => {
	const isLogin = res.locals.isLogin;

	res.render('login', { url: '/login', isLogin: isLogin });
};

const signup = async (req, res) => {
	const isLogin = res.locals.isLogin;

	res.render('signup', { url: '/signup', isLogin: isLogin });
};

const contact = async (req, res) => {
	const isLogin = res.locals.isLogin;

	res.render('contact', { url: '/contact', isLogin: isLogin });
};

const jobsPage = async (req, res) => {
	const isLogin = res.locals.isLogin;

	let data = {};
	data.jobs = await jobController.getPublicJobs();

	res.render('jobs', { url: '/jobs', isLogin: isLogin, data: data });
};

const errorPage = async (req, res) => {
	const isLogin = res.locals.isLogin;

	const message = req.session.message ? req.session.message : 'The page you requested was not found';

	res.render('error', { url: '/error', isLogin: isLogin, message: message });
};

module.exports = {
	landing,
	login,
	signup,
	contact,
	jobsPage,
	errorPage,
};
