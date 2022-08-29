const Sequelize = require('../models/index').sequelize;

// user itself can perform this operation
const profileupdate = async (req, res) => {
	const uid = res.locals.data.user.id;

	const { phone, address } = req.body;
	const { status, region, country, currentPosition, currentCompany, birthday, education, skill } = req.body;

	var url = null;

	if (req.file) {
		url = req.file.path;
		url = url.replace('assets', '');
	}

	var sql = `UPDATE users SET phone = '${phone}', address = '${address}' WHERE id = '${uid}'`;

	await Sequelize.query(sql, {
		type: Sequelize.QueryTypes.UPDATE,
	})
		.then((data) => {
			console.log(data);
			// return data;
		})
		.catch((err) => {
			console.log(err);
			// return null;
		});

	if (url) {
		sql = `UPDATE applicants SET status = '${status}', cv = '${url}', region = '${region}', country = '${country}', currentPosition = '${currentPosition}', currentCompany = '${currentCompany}', birthday = '${birthday}', education = '${education}', skill = '${skill}', updatedAt = NOW() WHERE uid = '${uid}'`;

		await Sequelize.query(sql, {
			type: Sequelize.QueryTypes.UPDATE,
		})
			.then((data) => {
				console.log(data);
				// return data;
			})
			.catch((err) => {
				console.log('When url :', err);
				// return null;
			});
	} else {
		var sql = `UPDATE applicants SET status = '${status}',  region = '${region}', country = '${country}', currentPosition = '${currentPosition}', currentCompany = '${currentCompany}', dob = '${birthday}', education = '${education}', skill = '${skill}', updatedAt = NOW() WHERE uid = '${uid}'`;

		await Sequelize.query(sql, {
			type: Sequelize.QueryTypes.UPDATE,
		})
			.then((data) => {
				console.log(data);
				// return data;
			})
			.catch((err) => {
				console.log('When url is null :', err);
				// return null;
			});
	}

	return res.status(200).json({ message: 'Profile updated successfully' });

	// // check data is valid
	// // console.log(req.body);
};

const profileCreateView = (req, res) => {
	const data = res.locals.data;

	res.render('applicant/editProfile', { url: '/applicant/profile/edit', title: 'Create profile', data: data });
};

const profileUpdateView = async (req, res) => {
	const data = res.locals.data;

	const sql = `SELECT * FROM applicants WHERE uid = '${res.locals.data.user.id}' limit 1;`;

	var applicant = await Sequelize.query(sql, {
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

	if (!applicant) {
		res.redirect('/error');
	}
	data.applicant = applicant;
	res.render('applicant/updateProfile', { url: '/applicant/profile/update', title: 'Update profile', data: data });
};

const dashboardView = (req, res) => {
	const data = res.locals.data;

	if (data.user.phone == '' || data.user.phone == null) {
		res.redirect('/applicant/profile/edit');
	} else {
		res.render('applicant/index', { url: '/applicant', title: 'Dashboard', isLogin: res.locals.isLogin });
	}
};

const profileView = async (req, res) => {
	var data = res.locals.data;

	const sql = `SELECT * FROM applicants WHERE uid = '${res.locals.data.user.id}' limit 1;`;

	var applicant = await Sequelize.query(sql, {
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

	if (!applicant) {
		res.redirect('/error');
	}
	data.applicant = applicant;

	res.render('applicant/profile', { url: '/applicant/profile', title: 'Profile', data: data });
};

const jobsView = async (req, res) => {
	const data = res.locals.data;

	const sql = `SELECT * FROM jobs WHERE status = 'Open' ORDER BY createdAt DESC;`;

	var jobs = await Sequelize.query(sql, {
		type: Sequelize.QueryTypes.SELECT,
		raw: true,
	})
		.then((data) => {
			if (data) {
				return data;
			}
			return null;
		})
		.catch((err) => {
			console.log(err);
			return null;
		});

	if (!jobs) {
		res.redirect('/error');
	}

	console.log(jobs);

	data.jobs = jobs;

	res.render('applicant/jobs', { url: '/applicant/jobs', title: 'Jobs', data: data });
};

const applicationView = async (req, res) => {
	const data = res.locals.data;

	data.jobs = [];

	// console.log(data.jobs);

	res.render('applicant/applications', { url: '/applicant/applications', title: 'Job Applications', data: data });
	// res.send({ url: "/applicant/applications", title: "Job Applications", data: data });
};

module.exports = {
	profileupdate,
	profileCreateView,
	profileUpdateView,
	dashboardView,
	profileView,
	jobsView,
	applicationView,
};
