const router = require('express').Router();

const applicantController = require('../controllers/applicantController');

const authMiddleware = require('../middlewares/authMiddleWare.js');
const roleValidation = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware.isAuthenticated, roleValidation.isApplicant, applicantController.profileupdate);

router.get('/', authMiddleware.isAuthenticated, roleValidation.isApplicant, applicantController.dashboardView);
router.get('/profile', authMiddleware.isAuthenticated, roleValidation.isApplicant, applicantController.profileView);
router.get('/profile/edit', authMiddleware.isAuthenticated, roleValidation.isApplicant, applicantController.profileCreateView);
router.get('/profile/update', authMiddleware.isAuthenticated, roleValidation.isApplicant, applicantController.profileUpdateView);

router.get('/jobs', authMiddleware.isAuthenticated, roleValidation.isApplicant, applicantController.jobsView);
router.get('/jobs/applications', authMiddleware.isAuthenticated, roleValidation.isApplicant, applicantController.applicationView);

module.exports = router;
