const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middlewares/verifyAdminToken');
const dashboardController = require('../controllers/dashboardController');
router.route('/count')
        .get(verifyAdmin, dashboardController.getCountData);


module.exports = router;