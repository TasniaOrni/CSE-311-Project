const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config/server.config');

const generateToken = (credential, user) => {
	credential.isBan ? (credential.isBan = true) : (credential.isBan = false);

	delete credential.password;
	delete credential.isBan;
	delete credential.createdAt;
	delete credential.updatedAt;

	delete user.cid;
	delete user.createdAt;
	delete user.updatedAt;

	var accessToken = jwt.sign(
		{
			credential,
			user,
		},
		JWT_SECRET,
		{
			expiresIn: '1h',
		}
	);

	return 'Bearer ' + accessToken;
};

const verifyToken = (token) => {
	const code = token.split(' ')[1];

	const data = jwt.verify(code, JWT_SECRET, (err, decoded) => {
		if (err) {
		}

		return decoded;
	});

	return data;
};

module.exports = {
	generateToken,
	verifyToken,
};
