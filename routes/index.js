const router = require('express').Router();

const jobRoutes = require('./jobRoutes');
const siteRoutes = require('./siteRoutes');
const applicantRoutes = require('./applicantRoutes');
const recruiterRoutes = require('./recruiterRoutes');
const applicationRoutes = require('./applicationRoutes');

const apiRoutes = require('./apiRoutes');

router.use('/', siteRoutes);
router.use('/applicant', applicantRoutes);
router.use('/recruiter', recruiterRoutes);
router.use('/jobs', jobRoutes);
router.use('/application', applicationRoutes);

router.use('/api', apiRoutes);

module.exports = router;
