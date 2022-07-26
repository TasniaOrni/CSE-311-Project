const Sequelize = require('../models/index').sequelize;
const { v4: uuidv4 } = require('uuid');

const apply = async (req, res) => {
	const data = res.locals.data;
	const jobId = req.params.jobId;
	const applicantId = res.locals.data.applicant.id;

	// console.log(data.applicant);
	var applicant = data.applicant;

	if (!applicant) {
		return res.status(400).json({
			message: 'Access denied',
		});
	}

	var jobApplication = await Sequelize.query(
		`SELECT * FROM jobApplications WHERE applicantId = '${applicant.id}' limit 1;`,
		{
			type: Sequelize.QueryTypes.SELECT,
			raw: true,
		}
	)
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

	if (jobApplication) {
		return res.status(200).json({
			message: 'You have already applied for this job',
		});
	}

	const sql = `INSERT INTO jobApplications (id, applicantId, jobId) VALUES ( '${uuidv4()}', '${applicantId}', '${jobId}');`;

	return await Sequelize.query(sql, {
		type: Sequelize.QueryTypes.INSERT,
		raw: true,
	})
		.then((data) => {
			return res.status(200).json({
				message: 'You have applied successfully',
			});
		})
		.catch((err) => {
			console.log(err);

			return res.status(500).json({
				message: 'Something went wrong',
			});
		});
};

const getAppliedJobs = async (applicantId) => {
	var sql = `SELECT * FROM jobApplications as ja INNER JOIN applicants AS a on ja.applicantId = '${applicantId}' INNER JOIN jobs AS j ON ja.jobId = j.id;`;

	return await Sequelize.query(sql, {
		type: Sequelize.QueryTypes.SELECT,
		raw: true,
	})
		.then((data) => {
			if (data.length > 0) {
				return data;
			}
			return [];
		})
		.catch((err) => {
			console.log(err);
			return [];
		});
};

const getApplicants = async (recruiterId) => {
	var sql = `SELECT * FROM jobApplications as ja JOIN applicants AS a ON ja.applicantId = a.id JOIN users AS u ON a.uid = u.id JOIN jobs AS j ON ja.jobId = j.id JOIN recruiters AS r ON r.id = '${recruiterId}' AND j.rid = r.id;`;

	return await Sequelize.query(sql, {
		type: Sequelize.QueryTypes.SELECT,
		raw: true,
	})
		.then((data) => {
			if (data.length > 0) {
				return data;
			}
			return [];
		})
		.catch((err) => {
			console.log(err);
			return [];
		});
};

// find total applications for a recruiter
const getTotalApplications = async (recruiterId) => {
	const sql = `SELECT COUNT(*) as total FROM jobApplications AS ja JOIN jobs AS j ON ja.jobId = j.id JOIN recruiters AS r ON r.id = '${recruiterId}' AND j.rid = r.id;`;

	return await Sequelize.query(sql, {
		type: Sequelize.QueryTypes.SELECT,
	}).then((data) => {
		if (data.length > 0) {
			return data[0].total;
		}
		return 0;
	});
};

module.exports = {
	apply,
	getAppliedJobs,
	getApplicants,

	getTotalApplications,
};
