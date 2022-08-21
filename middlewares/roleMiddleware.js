const Sequelize = require('../models/index').sequelize;

const isAdmin = async (req, res, next) => {
	const { role, email } = res.locals.data.credential;

	if (role === 'admin') {
		var admin = await Sequelize.query(`SELECT * FROM credentials WHERE email = '${email}';`, {
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

		if (admin) {
			delete admin.password;

			res.locals.data.admin = admin;
		} else {
			res.locals.data.admin = {};
		}

		return next();
	} else {
		res.session.message = 'Access denied';
		res.redirect('/error');
	}
};

const isRecruiter = async (req, res, next) => {
	const { role, email } = res.locals.data.credential;

	if (role === 'recruiter') {
		// console.log(res.locals.data);

		var recruiter = await Sequelize.query(`SELECT * FROM credentials WHERE email = '${email}';`, {
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

		if (recruiter) {
			delete recruiter.password;

			res.locals.data.recruiter = recruiter;
		} else {
			res.locals.data.recruiter = {};
		}

		return next();

		// console.log(res.locals.data);
	} else {
		res.session.message = 'Access denied';
		await res.redirect('/error');
	}
};

const isApplicant = async (req, res, next) => {
	const { role, email } = res.locals.data.credential;

	// console.log(res.locals.data);

	if (role === 'applicant') {
		var applicant = await Sequelize.query(`SELECT * FROM credentials WHERE email = '${email}';`, {
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

		if (applicant) {
			delete applicant.password;

			res.locals.data.applicant = applicant;
		} else {
			res.locals.data.applicant = {};
		}

		return next();
	} else {
		res.session.message = 'Access denied';
		res.redirect('/error');
	}
};

module.exports = {
	isAdmin,
	isRecruiter,
	isApplicant,
};
