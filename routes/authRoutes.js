const router = require('express').Router();

const authController = require('../controllers/authController');

const authMiddleware = require('../middlewares/authMiddleWare.js');
const roleValidation = require('../middlewares/roleMiddleware');

router.post('/signup', authController.register);
router.post('/login', authController.login);
router.get('/logout', authMiddleware.isAuthenticated, authController.deAuth);

module.exports = router;
