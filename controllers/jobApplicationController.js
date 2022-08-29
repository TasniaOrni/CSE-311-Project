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

const getAppliedJobs = async (req, res) => {
	const data = res.locals.data;

	var sql = `SELECT * FROM jobApplications WHERE applicantId = '${data.applicant.id}';`;

	var appliedJobs = await Sequelize.query(sql, {
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
	return res.status(200).json({
		message: 'Applied Jobs',
		jobs: appliedJobs,
	});
};

const getApplicants = async (req, res) => {
	const data = res.locals.data;

	var sql = `SELECT * FROM jobApplications WHERE jobId = '${req.params.jobId}';`;

	var applicants = await Sequelize.query(sql, {
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

	return res.status(200).json({
		message: 'Applicants',
		applicants: applicants,
	});
};

// find total applications for a recruiter

module.exports = {
	apply,
	getAppliedJobs,
	getApplicants,
};
