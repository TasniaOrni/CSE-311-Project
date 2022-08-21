const router = require('express').Router();

const siteRoutes = require('./siteRoutes');
const applicantRoutes = require('./applicantRoutes');
const recruiterRoutes = require('./recruiterRoutes');

const apiRoutes = require('./apiRoutes');

router.use('/', siteRoutes);
router.use('/applicant', applicantRoutes);
router.use('/recruiter', recruiterRoutes);

router.use('/api', apiRoutes);

module.exports = router;
