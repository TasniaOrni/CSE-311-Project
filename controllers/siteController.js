const landing = (req, res) => {
	res.render('index');
};

const login = (req, res) => {
	res.render('login');
};

const signup = (req, res) => {
	res.render('signup');
};

module.exports = {
	landing,
	login,
	signup,
};
