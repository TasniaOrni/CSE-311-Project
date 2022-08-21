const Sequelize = require('../models/index').sequelize;
const tokenGenerator = require('../utils/tokenGenerator');

// user itself can perform this operation
const profileCreateUpdate = async (req, res) => {
	const uid = res.locals.data.user.id;
	const { phone, address } = req.body;

	const { status, region, country, currentPosition, currentCompany, birthday, education, skill } = req.body;

	// console.log(req.body);

	await User.update(
		{
			phone,
			address,
		},
		{
			where: {
				id: uid,
			},
		}
	)
		.then(() => {
			var url = '';
			if (req.file) {
				url = req.file.path.replace('assets', '');

				Applicant.upsert(
					{
						cv: url,
						dob: birthday,
						skill: skill,
						status: status,
						education: education,
						region: region,
						country: country,
						currentCompany: currentCompany,
						currentPosition: currentPosition,
						uid: uid,
					},
					{
						where: {
							uid: uid,
						},
					}
				)
					.then((applicant, isCreated) => {
						// console.log("New user : ", isCreated, " Applicant : ", applicant);
						//

						// update cookie
						const user = res.locals.data.user;
						user.phone = phone;
						user.address = address;

						const token = tokenGenerator.generateToken(res.locals.data.credential, user);

						/*
						 * Clear previous cookie and set new cookie
						 */
						res.clearCookie('getscouted');

						res.cookie('getscouted', token, {
							maxAge: 12 * 60 * 60 * 1000, // 12 hour
							httpOnly: true,
							sameSite: true,
							secure: true,
							signed: true,
						});

						res.redirect('/applicant/');
					})
					.catch((err) => {
						// console.error(err);

						req.session.message = err.message;
						res.redirect('/error');
					});
			} else {
				Applicant.upsert(
					{
						cv: req.body.previousCV,
						dob: birthday,
						skill: skill,
						status: status,
						education: education,
						region: region,
						country: country,
						currentCompany: currentCompany,
						currentPosition: currentPosition,
						uid: uid,
					},
					{
						where: {
							uid: uid,
						},
					}
				)
					.then((applicant, isCreated) => {
						// console.log("New user : ", isCreated, " Applicant : ", applicant);
						//

						// update cookie
						const user = res.locals.data.user;
						user.phone = phone;
						user.address = address;

						const token = tokenGenerator.generateToken(res.locals.data.credential, user);

						/*
						 * Clear previous cookie and set new cookie
						 */
						res.clearCookie('getscouted');

						res.cookie('getscouted', token, {
							maxAge: 12 * 60 * 60 * 1000, // 12 hour
							httpOnly: true,
							sameSite: true,
							secure: true,
							signed: true,
						});

						res.redirect('/applicant/');
					})
					.catch((err) => {
						// console.error(err);

						req.session.message = err.message;
						res.redirect('/error');
					});
			}
		})
		.catch((err) => {
			console.log(err);
		});

	// // check data is valid
	// // console.log(req.body);
};

const profileCreateView = (req, res) => {
	const data = res.locals.data;

	res.render('applicant/editProfile', { url: '/applicant/profile/edit', title: 'Create profile', data: data });
};

const profileUpdateView = async (req, res) => {
	const data = res.locals.data;

	var applicant = await Sequelize.query(`SELECT * FROM applicants WHERE uid = '${res.locals.data.user.id}' limit 1;`, {
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

	var applicant = await Sequelize.query(`SELECT * FROM applicants WHERE uid = '${res.locals.data.user.id}' limit 1;`, {
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

	var jobs = await Sequelize.query(`SELECT * FROM jobs WHERE "status" = 'open' ORDER BY createdAt DESC;`, {
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
	profileCreateUpdate,
	profileCreateView,
	profileUpdateView,
	dashboardView,
	profileView,
	jobsView,
	applicationView,
};
