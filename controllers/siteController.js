const landing = (req, res) => {
	res.render('index');
};

const login = (req, res) => {
	res.render('login');
};

const signup = (req, res) => {
	res.render('signup');
};

const contact = (req, res) => {
	res.render('contact');
};

module.exports = {
	landing,
	login,
	signup,
	contact,
};
