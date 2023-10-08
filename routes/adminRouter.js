const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const asyncWrapper = require('../middlewares/asyncWrapper');
const verifyAdmin = require('../middlewares/verifyAdminToken');
router.route('/')
            .get(verifyAdmin, asyncWrapper(adminController.getAll))
            .post(asyncWrapper(adminController.add));
            
router.route('/login')
            .post(asyncWrapper(adminController.login));

module.exports = router;