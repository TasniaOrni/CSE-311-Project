const Sequelize = require('../models/index').sequelize;
const JobController = require('../controllers/jobController');
const jobApplicationController = require('./jobApplicationController');

const dashboardView = async (req, res) => {
	const data = res.locals.data;

	if (data.recruiter.id == undefined) {
		data.recruiter.id = '0';
	}

	// console.log(data);
	const total = await JobController.getTotalPost(data.recruiter.id);
	const active = await JobController.getTotalOpenPost(data.recruiter.id);
	const responses = await jobApplicationController.getTotalApplications(data.recruiter.id);

	if (data.user.phone == '' || data.user.phone == null) {
		res.redirect('/recruiter/profile/edit');
	} else {
		res.render('recruiter/index', {
			url: '/recruiter',
			title: 'Dashboard',
			isLogin: res.locals.isLogin,
			data: data,
			total: total,
			responses: responses,
			active: active,
		});
	}
};

const profileView = async (req, res) => {
	const data = res.locals.data;

	const sql = `SELECT * FROM recruiters WHERE uid = '${res.locals.data.user.id}' limit 1;`;

	var recruiter = await Sequelize.query(sql, {
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

	if (!recruiter) {
		res.redirect('/error');
	}
	data.recruiter = recruiter;

	res.render('recruiter/companyProfile', {
		url: '/recruiter/profile',
		title: 'Profile',
		isLogin: res.locals.isLogin,
		data: data,
	});
	// res.send({ url: "/recruiter/profile", title: "Profile", isLogin: res.locals.isLogin, data: data });
};

const createProfileView = async (req, res) => {
	const data = res.locals.data;
	const uid = data.user.id;

	const sql = `SELECT * FROM recruiters WHERE uid = '${uid}' limit 1;`;

	var recruiter = await Sequelize.query(sql, {
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

	if (!recruiter) {
		res.redirect('/error');
	}
	data.recruiter = recruiter;

	// console.log("Later", data);

	await res.render('recruiter/editCompanyProfile', {
		url: '/recruiter/profile/edit',
		title: 'Create Profile',
		isLogin: res.locals.isLogin,
		data: data,
	});
};

const updateProfileView = async (req, res) => {
	const data = res.locals.data;

	const sql = `SELECT * FROM recruiters WHERE uid = '${res.locals.data.user.id}' limit 1;`;

	var recruiter = await Sequelize.query(sql, {
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

	if (!recruiter) {
		res.redirect('/error');
	}
	data.recruiter = recruiter;

	res.render('recruiter/updateCompanyProfile', {
		url: '/recruiter/profile/update',
		title: 'Profile update',
		isLogin: res.locals.isLogin,
		data: data,
	});
};

const jobsView = async (req, res) => {
	const data = res.locals.data;
	const rid = data.recruiter.id;

	const sql = `SELECT * FROM jobs WHERE rid = '${rid}'`;

	data.jobs = await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT, raw: true })
		.then(async (result) => {
			return result;
		})
		.catch((err) => {
			console.log(err);
			return [];
		});

	// console.log(data);

	res.render('recruiter/jobs', {
		url: '/recruiter/jobs',
		title: 'Ongoing Jobs',
		isLogin: res.locals.isLogin,
		data: data,
	});
};

const createJobView = (req, res) => {
	res.render('recruiter/jobPost', { url: '/recruiter/jobs/post', title: 'Create Job', isLogin: res.locals.isLogin });
};

const allApplicantView = async (req, res) => {
	const data = res.locals.data;

	data.applications = await jobApplicationController.getApplicants(data.recruiter.id);

	// return res.json({
	// 	url: '/recruiter/jobs/applicants',
	// 	title: 'All Applicants',
	// 	isLogin: res.locals.isLogin,
	// 	data: data.applications,
	// });
	res.render('recruiter/JobApplications', {
		url: '/recruiter/jobs/applicants',
		title: 'All Applicants',
		isLogin: res.locals.isLogin,
		data: data,
	});
};

module.exports = {
	dashboardView,
	createJobView,
	jobsView,
	profileView,
	createProfileView,
	updateProfileView,
	allApplicantView,
};
