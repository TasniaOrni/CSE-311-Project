const router = require('express').Router();

const siteController = require('../controllers/siteController');

router.get('/', siteController.landing);
router.get('/login', siteController.login);

module.exports = router;
