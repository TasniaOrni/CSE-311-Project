const landing = (req, res) => {
	res.render('index');
};

const login = (req, res) => {
	res.render('login');
};

module.exports = {
	landing,
  login
};
