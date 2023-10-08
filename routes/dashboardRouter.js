const express = require('express');
const router = express.Router();
const asyncWrapper = require('../middlewares/asyncWrapper');
const verifyAdminToken = require('../middlewares/verifyAdminToken');
const dashboardController = require('../controllers/dashboardController');

router.route('/')
        .get(verifyAdminToken, asyncWrapper(dashboardController.getPage));

module.exports = router;