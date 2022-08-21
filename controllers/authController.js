const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Sequelize = require('../models/index').sequelize;

const tokenGenerator = require('../utils/tokenGenerator');

const register = async (req, res) => {
	var { name, email, password, role } = req.body;

	email = email.toLowerCase().trim();

	var credentials = await Sequelize.query(`SELECT * FROM credentials WHERE email = '${email}';`, {
		type: Sequelize.QueryTypes.SELECT,
		raw: true,
	})
		.then((data) => {
			if (data.length > 0) {
				return data[0];
			}
			return null;
		})
		.catch((err) => {
			console.log(err);
			return null;
		});

	if (credentials) {
		return res.status(400).json({
			status: 'denied',
			message: 'Email already exists!',
		});
	}

	const hashPassword = bcrypt.hashSync(password, 10); // 10 is the salt rounds

	// create new user
	var newId = uuidv4();
	var credentials = await Sequelize.query(
		`INSERT INTO credentials (id, email, password, role) VALUES ('${newId}', '${email}', '${hashPassword}', '${role}');`,
		{
			type: Sequelize.QueryTypes.INSERT,
			raw: true,
		}
	)
		.then((data) => {
			return data;
		})
		.catch((err) => {
			console.log(err);
			return null;
		});

	if (!credentials) {
		return res.status(400).json({
			status: 'denied',
			message: 'Something went wrong!',
		});
	}

	var userId = uuidv4();
	var newUser = await Sequelize.query(
		`INSERT INTO users (id, cid, name, photo, phone, address) VALUES ('${userId}', '${newId}', '${name}', null, null, null);`,
		{
			type: Sequelize.QueryTypes.INSERT,
			raw: true,
		}
	)
		.then((data) => {
			return data;
		})
		.catch((err) => {
			console.log(err);
			return null;
		});

	if (!newUser) {
		return res.status(400).json({
			status: 'denied',
			message: 'Something went wrong!',
		});
	}

	return res.status(200).json({
		message: 'Signup successful!',
	});
};

const login = async (req, res) => {
	var { email, password } = req.body;

	console.log(req.body);

	if (!email || !password) {
		return res.status(400).json({ msg: 'Please enter all fields' });
	}

	email = email.toLowerCase().trim();
	password = password.trim();

	var credentials = await Sequelize.query(`SELECT * FROM credentials WHERE email = '${email}';`, {
		type: Sequelize.QueryTypes.SELECT,
		raw: true,
	})
		.then((data) => {
			if (data.length > 0) {
				return data[0];
			}
			return null;
		})
		.catch((err) => {
			console.log(err);
			return null;
		});

	if (!credentials) {
		return res.status(400).json({
			status: 'denied',
			message: 'Invalid credentials',
		});
	}

	// console.log(credentials);

	if (credentials.isBan) {
		return res.status(403).json({
			status: 'ban',
			message: 'You are banned',
		});
	}

	var user = await Sequelize.query(`SELECT * FROM users WHERE cid = '${credentials.id}' limit 1;`, {
		type: Sequelize.QueryTypes.SELECT,
		raw: true,
	})
		.then((data) => {
			if (data.length > 0) {
				return data[0];
			}
			return null;
		})
		.catch((err) => {
			console.log(err);
			return null;
		});

	// console.log(user);

	if (!user) {
		return res.status(400).json({
			status: 'denied',
			message: 'Invalid credentials',
		});
	}
	if (!bcrypt.compareSync(password, credentials.password)) {
		return res.status(400).json({
			status: 'denied',
			message: 'Invalid credentials',
		});
	}

	const token = tokenGenerator.generateToken(credentials, user);

	res.cookie('cse311', token, {
		maxAge: 2 * 60 * 60 * 1000, // 2 hour
		httpOnly: true,
		sameSite: true,
		secure: true,
		signed: true,
	});

	return res.status(200).json({
		status: 'success',
		message: 'Login successful',
		user: {
			id: user.id,
			name: user.name,
			photo: user.photo,
			email: credentials.email,
			role: credentials.role,
			phome: user.phone,
			address: user.address,
		},
		token: token,
	});
};

const deAuth = (req, res) => {
	let user = res.locals.data;

	if (!user) {
		res.session.message = 'You are not logged in';
		res.redirect('/error');
	}

	delete res.session;
	res.clearCookie('cse311');

	// req.session.message = "Logout Successful!";
	res.redirect('/login');
};

module.exports = {
	register,
	login,
	deAuth,
};
