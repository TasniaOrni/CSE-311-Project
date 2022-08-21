const router = require('express').Router();

const jobApplicationController = require('../controllers/jobApplicationController');

const authMiddleware = require('../middlewares/authMiddleWare.js');
const roleValidation = require('../middlewares/roleMiddleware');

router.post('/:jobId', authMiddleware.isAuthenticated, roleValidation.isApplicant, jobApplicationController.apply);

module.exports = router;
