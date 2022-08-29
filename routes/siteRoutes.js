const router = require('express').Router();

const siteController = require('../controllers/siteController');

const authMiddleware = require('../middlewares/authMiddleWare.js');

router.get('/', authMiddleware.isLogin, siteController.landing);
router.get('/jobs', authMiddleware.isLogin, siteController.jobsPage);
router.get('/login', authMiddleware.isLogin, siteController.login);
router.get('/signup', authMiddleware.isLogin, siteController.signup);
router.get('/contact', authMiddleware.isLogin, siteController.contact);
router.get('/error', authMiddleware.isLogin, siteController.errorPage);

module.exports = router;
