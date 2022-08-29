const router = require('express').Router();

const jobController = require('../controllers/jobController');
const siteController = require('../controllers/siteController');

const authMiddleware = require('../middlewares/authMiddleWare.js');
const roleValidation = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware.isAuthenticated, roleValidation.isRecruiter, jobController.create);
router.post('/:id/verify', authMiddleware.isAuthenticated, roleValidation.isRecruiter, jobController.verify);
router.post('/promotion', authMiddleware.isAuthenticated, roleValidation.isRecruiter, jobController.getSameCompanyJobs);
router.post('/remove/:id', authMiddleware.isAuthenticated, roleValidation.isRecruiter, jobController.deleteJob);

// router.get('/', authMiddleware.isAuthenticated, roleValidation.isApplicant, jobController.openJobs);
router.get('/', authMiddleware.isLogin, siteController.jobsPage);
router.get('/all', authMiddleware.isAuthenticated, roleValidation.isAdmin, jobController.getAllJobs);
router.get('/:id', authMiddleware.isAuthenticated, roleValidation.isAdmin, jobController.deleteJob);

module.exports = router;
