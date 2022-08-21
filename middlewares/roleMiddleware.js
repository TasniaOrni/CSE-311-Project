const Sequelize = require('../models/index').sequelize;

const isAdmin = async (req, res, next) => {
	const { role } = res.locals.data.credential;
	const { id } = res.locals.data.user;

	if (role === 'admin') {
		var admin = await Sequelize.query(`SELECT * FROM admins WHERE uid = '${id}';`, {
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
	const { role } = res.locals.data.credential;
	const { id } = res.locals.data.user;

	if (role === 'recruiter') {
		// console.log(res.locals.data);

		var recruiter = await Sequelize.query(`SELECT * FROM recruiters WHERE uid = '${id}';`, {
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
			res.locals.data.recruiter = recruiter;
		} else {
			res.locals.data.recruiter = {};
		}
		// console.log(res.locals.data);

		return next();
	} else {
		res.session.message = 'Access denied';
		await res.redirect('/error');
	}
};

const isApplicant = async (req, res, next) => {
	const { role } = res.locals.data.credential;
	const { id } = res.locals.data.user;

	if (role === 'applicant') {
		var applicant = await Sequelize.query(`SELECT * FROM applicants WHERE uid = '${id}';`, {
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
			res.locals.data.applicant = applicant;
		} else {
			res.locals.data.applicant = {};
		}

		// console.log(res.locals.data);

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
