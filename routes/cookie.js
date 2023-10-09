const express = require('express');
const router = express.Router();
const cokie = require('../controllers/cookie');

router.route('/')
        .get(cokie.getCookie);

module.exports = router;