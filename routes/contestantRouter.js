const express = require('express');
const router = express.Router();
const contestantController = require('../controllers/contestantController.js');
const verifyAdmin = require('../middlewares/verifyAdminToken.js');

router.route('/')
        .get(contestantController.getAll)
        .post(contestantController.addContestant);

router.route('/:id')
        .get(contestantController.getContestant)
        .put(contestantController.updateContestant)
        .delete(contestantController.deleteContestant);

router.route('/signup')
        .post(contestantController.signup);

router.route('/login')
        .post(contestantController.login);
        
module.exports = router;
