const router = require('express').Router();

const siteRoutes = require('./siteRoutes');

router.use('/', siteRoutes);


module.exports = router;
