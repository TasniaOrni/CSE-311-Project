const router = require('express').Router();

const siteController = require('../controllers/siteController');

router.get('/', siteController.landing);
router.get('/login', siteController.login);
router.get('/signup', siteController.signup);

module.exports = router;
