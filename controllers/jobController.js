const Sequelize = require('../models/index').sequelize;

const create = async (req, res) => {
	const rid = res.locals.data.recruiter.id;
	const { title, description, deadline, type, placement, salary, location, vacancy, status } = req.body;

	const sql = `INSERT INTO jobs (title, description, deadline, type, placement, salary, location, vacancy, status, rid) VALUES ('${title}', '${description}', '${deadline}', '${type}', '${placement}', '${salary}', '${location}', '${vacancy}', '${status}', '${rid}')`;

	return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT, raw: true })
		.then(async (result) => {
			return res.status(200).json({
				message: 'Job created successfully',
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({
				message: 'Job not created',
			});
		});
};

const updateStatus = async (req, res) => {
	const { id, status, rid } = req.body;

	const sql = `UPDATE jobs SET status = '${status}' WHERE id = ${id} AND rid = ${rid}`;

	return await Sequelize.query(sql, { type: Sequelize.QueryTypes.UPDATE, raw: true })
		.then((result) => {
			return res.status(200).json({
				message: 'Job status updated successfully',
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({
				message: 'Job status not updated',
			});
		});
};

const deleteJob = async (req, res) => {
	const { id, rid } = req.body;

	const sql = `DELETE FROM jobs WHERE id = ${id} AND rid = ${rid}`;

	return await Sequelize.query(sql, { type: Sequelize.QueryTypes.DELETE, raw: true })
		.then(async (result) => {
			return res.status(200).json({
				message: 'Job deleted successfully',
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({
				message: 'Job not deleted',
			});
		});
};

const verify = (req, res) => {
	const { id, rid, isVerified } = req.body;

	const sql = `UPDATE jobs SET isVerified = ${isVerified} WHERE id = ${id} AND rid = ${rid}`;

	return Sequelize.query(sql, { type: Sequelize.QueryTypes.UPDATE, raw: true })
		.then(async (result) => {
			return res.status(200).json({
				message: 'Job verified successfully',
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({
				message: 'Job not verified',
			});
		});
};

const getSameCompanyJobs = async (req, res) => {
	const { rid } = req.body;

	const sql = `SELECT * FROM jobs WHERE rid = ${rid}`;

	return Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT, raw: true })
		.then(async (result) => {
			return res.status(200).json({
				message: 'Jobs fetched successfully',
				jobs: result,
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({
				message: 'Jobs not fetched',
				jobs: [],
			});
		});
};

const openJobs = async (req, res) => {
	const query = `SELECT * FROM jobs WHERE status = 'open'`;

	return await Sequelize.query(query, { type: Sequelize.QueryTypes.SELECT, raw: true })
		.then(async (result) => {
			return res.status(200).json({
				message: 'Jobs fetched successfully',
				jobs: result,
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({
				message: 'Jobs not fetched',
				jobs: [],
			});
		});
};

const getAllJobs = async (req, res) => {
	const sql = `SELECT * FROM jobs ORDER BY deadline ASC`;

	return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT, raw: true })
		.then((result) => {
			return res.status(200).json({
				message: 'Jobs fetched successfully',
				jobs: result,
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({
				message: 'Jobs not fetched',
				jobs: [],
			});
		});
};

module.exports = {
	create,
	updateStatus,
	deleteJob,
	verify,
	openJobs,
	getAllJobs,
	getSameCompanyJobs,
};
